import S from "sanctuary"
import { validateSync } from "class-validator";
import _ from "lodash";
import Parameters from "./Parameters";
import * as immutable from "immutable"
import { listTrim, listRemoveEmpty, listUnique, bool2Str } from "jianhan-fp-lib/dist/operations";
import Twitter, { ResponseData, RequestParams } from "twitter";
import { Logger } from "winston";
import { from, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators'
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { S3 } from 'aws-sdk';
import fp from "lodash/fp";

const parseJSON = (s: string): Parameters => JSON.parse(s);

const convert = S.curry2(Object.assign)(new Parameters());

/**
 *
 * @param parameters
 */
const validate = (parameters: Parameters) => {
    const errors = validateSync(parameters);
    if (errors.length > 0) {
        return S.Left(errors);
    }
    return S.Right(immutable.fromJS(Object.assign({}, parameters)))
}


const sensitizeList = S.pipe([listTrim, listRemoveEmpty, listUnique]);

const sensitizeAndUpdate = (key: string, map: immutable.Map<string, any>) => {
    if (map.has(key)) {
        return map.set(key, sensitizeList(map.get(key)));
    }

    return map;
}

const toFetchParameters = (map: immutable.Map<string, any>): { [key: string]: string } => {
    return {
        screen_name: _.join(map.get('screen_name').toArray(), ","),
        user_id: _.join(map.get('user_id').toArray(), ","),
        include_entities: bool2Str(map.get('include_entities')),
        tweet_mode: bool2Str(map.get('tweet_mode')),
    };
}

/**
 *
 */
const transform = S.pipe([S.curry2(sensitizeAndUpdate)('screen_name'), S.curry2(sensitizeAndUpdate)('user_id')]);

const fetch = (tw: Twitter, params: RequestParams): Observable<ResponseData> => from(tw.get("users/lookup", params));

const upload = (putObjectRequest: PutObjectRequest, s3: S3, o: Observable<ResponseData>) => {
    return o.pipe(
        flatMap(p => from(s3.upload(Object.assign({}, putObjectRequest, { Body: JSON.stringify(p) })).promise())),
    );
};

const extractResult = S.either(fp.identity)(fp.identity);


export const sync = (logger: Logger, tw: Twitter, putObjectRequest: PutObjectRequest, s3: S3) => {
    return S.pipe([
        fp.tap(logger.info),
        S.encase(parseJSON),
        S.map(convert),
        S.chain(validate),
        S.map(transform),
        S.map(toFetchParameters),
        S.map(S.curry2(fetch)(tw)),
        S.map(fp.tap(logger.info)),
        S.map(S.curry3(upload)(putObjectRequest)(s3)),
        extractResult
    ]);
}