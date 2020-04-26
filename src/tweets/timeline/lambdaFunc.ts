import {of} from "rxjs";
import {toParameters, validateParameters} from "./Parameters"
import {flatMap, map, tap} from "rxjs/operators";
import {fetch, fetchRequest, parseResponseBody, upload, uploadRequest} from "./s3";
import {cleanTweets, getLatestTimeline} from "./twitter";
import {Logger} from "winston";
import {lambdaRes, log, pickAttributes} from "../../operations";
import * as httpStatus from "http-status-codes";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import * as immutable from "immutable";
import {Environment, LogLevel} from "jianhan-fp-lib";
import {LambdaResponse} from "../../structures/LambdaResponse";
import {getClientsFromEnvs} from "../../clients";
import SendData = ManagedUpload.SendData;

/**
 * lambdaFunc is the entry point for composition, it will sync user's timeline and upload to s3.
 *
 * @param envs
 * @param logger
 * @param params
 */
export const lambdaFunc = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, params: { [key: string]: any }) => {
    return async (): Promise<LambdaResponse> => {
        const {s3, tw} = getClientsFromEnvs(envs);
        const parameters = toParameters(params);
        const logInfo = log(logger)(LogLevel.INFO);
        const logTweets = (message: string) => (v: any[]) => logInfo(message)(pickAttributes(['id', 'created_at', 'text'])(v));
        // @ts-ignore
        return of(parameters).pipe(
            flatMap(validateParameters),
            tap(logInfo("after validateParameter")),
            map(fetchRequest(envs.get("NODE_ENV") as string, envs.get("SERVICE_NAME") as string, envs.get("S3_BUCKET_NAME") as string)),
            tap(logInfo("after fetchRequest")),
            flatMap(fetch(s3)(logger)),
            flatMap(parseResponseBody),
            tap(logTweets("after fetch")),
            map(cleanTweets),
            tap(logTweets("after cleanTweets")),
            flatMap(getLatestTimeline(tw)(parameters)),
            map(uploadRequest(envs.get("NODE_ENV") as string, envs.get("SERVICE_NAME") as string, envs.get("S3_BUCKET_NAME") as string)(parameters)),
            flatMap(upload(s3)),
            flatMap((sendData: SendData) => of(lambdaRes(httpStatus.OK, "successful", sendData))),
        ).toPromise();
    }
};
