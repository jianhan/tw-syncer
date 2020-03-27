import {Environment} from "jianhan-fp-lib";
import {Logger} from "winston";
import {getClientsFromEnvs} from "../../clients";
import {sync} from "./sync";
import * as httpStatus from "http-status-codes";
import * as immutable from "immutable";
import S from "sanctuary"
import moment = require("moment");
import {LambdaResponse} from "../../structures/LambdaResponse";
import fp from "lodash/fp";
import {newResponseFunc} from "../../operations";
import {Observable} from "rxjs";
import {ResponseData} from "twitter";
// tslint:disable-next-line:no-var-requires
const sprintf = require("sprintf");

/**
 * isLambdaResponse checks if an give variable is an instance of LambdaResponse.
 *
 * @param obj
 */
const isLambdaResponse = (obj: any) => obj instanceof LambdaResponse;

/**
 * processLeft contains logic to process Left monad of sync result.
 */
const processLeft = S.ifElse(isLambdaResponse)(fp.identity)(S.curry3(newResponseFunc)(httpStatus.INTERNAL_SERVER_ERROR)('Unable to process error from sync function'));

/**
 * processRight contains right to process Left monad of sync result.
 *
 * @param result
 */
const processRight = (result: Observable<ResponseData>): Promise<LambdaResponse> => {
    return result.toPromise().then((r: ResponseData) => {
        return new LambdaResponse(httpStatus.OK, 'upload successful', r);
    }).catch(err => {
        return new LambdaResponse(httpStatus.INTERNAL_SERVER_ERROR, 'Error occur, unable to upload', err);
    })
};

/**
 * lambdaFunc is the entry point function for user lookup functionality.
 *
 * @param envs
 * @param logger
 * @param body
 */
export const lambdaFunc = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, body: string) => {
    return async (): Promise<LambdaResponse> => {
        const key = sprintf("%s_users.json", moment().format("YYYY-MM-DD-HH:mm:ss"));
        const {s3, tw} = getClientsFromEnvs(envs);
        const syncResult = sync(logger, tw, {Bucket: envs.get("S3_BUCKET_NAME") as string, Key: key}, s3)(body);
        const extractedResult: any = S.either(fp.identity)(fp.identity)(syncResult);

        // TODO: suppose to use S.either and processLeft + processRight to compose the return value
        // but it keep error out, because promise type can not be recognized, need to fix it.
        if (S.isLeft(syncResult)) {
            // @ts-ignore
            return processLeft(extractedResult);
        }

        return await processRight(extractedResult);
    }
};
