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

/**
 * parseJSON parses json string.
 *
 * @param s
 */
const parseJSON = (s: string): Parameters => JSON.parse(s);

/**
 * convert converts POJO to parameter.
 */
const convert = S.curry2(Object.assign)(new Parameters());

/**
 * validate validates parameters, if it is invalid then return left monad contains errors,
 * otherwise return right with immutable map.
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

/**
 * sensitizeScreenName sensitize screen_name parameter by trimming, removing empty and removing duplicates
 * from the list.
 */
const sensitizeScreenName = S.pipe([listTrim, listRemoveEmpty, listUnique]);

/**
 * filterNumber removes any number that is less or equals to 0.
 *
 * @param list
 */
const filterNumber = (list: immutable.List<number>): immutable.List<number> => list.filterNot(x => x <= 0)

/**
 * sensitizeUserId sensitizes user_id parameter by removing duplicates and remove any number is
 * less or equals to 0.
 */
const sensitizeUserId = S.pipe([listUnique, filterNumber]);

/**
 * sensitizeAndUpdate sensitizes elements in immutable map by key, and then update
 * the immutable map by returning a new one.
 */
const sensitizeAndUpdate = (key: string, sensitizer: any, map: immutable.Map<string, any>) => {
    if (map.has(key)) {
        return map.set(key, sensitizer(map.get(key)));
    }

    return map;
}

/**
 * toFetchParameters converts parameters to POJO as fetching parameter via twitter api.
 *
 * @param map
 */
const toFetchParameters = (map: immutable.Map<string, any>): { [key: string]: string } => {
    return {
        screen_name: _.join(map.get('screen_name').toArray(), ","),
        user_id: _.join(map.get('user_id').toArray(), ","),
        include_entities: bool2Str(map.get('include_entities')),
        tweet_mode: bool2Str(map.get('tweet_mode')),
    };
}

/**
 * transform performs transformation of immutable map, so that screen_name parameters can be converted
 * from array to comma separated string, likewise to user_id.
 */
const transform = S.pipe([
    S.curry3(sensitizeAndUpdate)('screen_name')(sensitizeScreenName),
    S.curry3(sensitizeAndUpdate)('user_id')(sensitizeUserId),
]);

/**
 * fetch performs API call to lookup users and returns an observable.
 *
 * @param tw
 * @param params
 */
const fetch = (tw: Twitter, params: RequestParams): Observable<ResponseData> => from(tw.get("users/lookup", params));

/**
 * upload performs upload API call via AWS s3 sdk to upload fetched data to s3.
 *
 * @param putObjectRequest
 * @param s3
 * @param o
 */
const upload = (putObjectRequest: PutObjectRequest, s3: S3, o: Observable<ResponseData>) => {
    return o.pipe(
        flatMap(p => from(s3.upload(Object.assign({}, putObjectRequest, { Body: JSON.stringify(p) })).promise())),
    );
};

/**
 * extractResult extract results from container(Either) so results can be used by
 * caller.
 */
const extractResult = S.either(fp.identity)(fp.identity);

/**
 * sync is entry point for synchronizes users, it compose all the process in a functional way.
 *
 * @param logger
 * @param tw
 * @param putObjectRequest
 * @param s3
 */
export const sync = (logger: Logger, tw: Twitter, putObjectRequest: PutObjectRequest, s3: S3) => {
    return S.pipe([
        fp.tap(logger.info),
        S.encase(parseJSON),
        S.map(convert),
        S.chain(validate),
        S.map(transform),
        fp.tap(logger.info),
        S.map(toFetchParameters),
        S.map(S.curry2(fetch)(tw)),
        fp.tap(logger.info),
        S.map(S.curry3(upload)(putObjectRequest)(s3)),
        extractResult
    ]);
}