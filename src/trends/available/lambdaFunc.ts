import * as immutable from "immutable";
import {Environment, LogLevel} from "jianhan-fp-lib";
import {Logger} from "winston";
import {of} from "rxjs";
import {LambdaResponse} from "../../structures/LambdaResponse";
import {getClientsFromEnvs} from "../../clients";
import {lambdaRes, log} from "../../operations";
import {flatMap, map, tap} from "rxjs/operators";
import {upload} from "../../s3";
import * as httpStatus from "http-status-codes";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;
import {fetchTrends} from "./fetch";
import {uploadRequest} from "./upload";

/**
 * lambdaFunc is the entry point for fetch and sync, also contains function composition for the
 * entire process.
 *
 * @param envs
 * @param logger
 */
export const lambdaFunc = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger) => {
    return async (): Promise<LambdaResponse> => {
        const {s3, tw} = getClientsFromEnvs(envs);
        const logInfo = log(logger)(LogLevel.INFO);
        return fetchTrends(tw).pipe(
            // generates upload request
            map(uploadRequest(envs.get("NODE_ENV") as string, envs.get("SERVICE_NAME") as string, envs.get("S3_BUCKET_NAME") as string)),
            // log upload request
            tap(logInfo("after uploadRequest")),
            // upload
            flatMap(upload(s3)),
            // converts response to lambdaResponse object
            flatMap((sendData: SendData) => of(lambdaRes(httpStatus.OK, "successful", sendData))),
        ).toPromise();
    };
};

