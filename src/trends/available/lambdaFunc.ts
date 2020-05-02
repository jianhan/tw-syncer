import * as immutable from "immutable";
import {Environment, LogLevel} from "jianhan-fp-lib";
import {Logger} from "winston";
import {from, of} from "rxjs";
import {LambdaResponse} from "../../structures/LambdaResponse";
import {getClientsFromEnvs} from "../../clients";
import {fileKey, lambdaRes, log} from "../../operations";
import {flatMap, map, tap} from "rxjs/operators";
import {upload} from "../../s3";
import S3 from "aws-sdk/clients/s3";
import path from "path";
import * as httpStatus from "http-status-codes";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import Twitter = require("twitter");
import SendData = ManagedUpload.SendData;

const fetchTrends = (tw: Twitter) => from(tw.get("trends/available", {}));

const uploadRequest = (nodeEnv: string, serviceName: string, bucket: string) => (body: Twitter.ResponseData): S3.Types.PutObjectRequest => ({
    Bucket: bucket,
    Key: fileKey(nodeEnv, serviceName, path.join('trends', 'available'), "trends.json"),
    Body: JSON.stringify(body)
});

export const lambdaFunc = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger) => {
    return async (): Promise<LambdaResponse> => {
        const {s3, tw} = getClientsFromEnvs(envs);
        const logInfo = log(logger)(LogLevel.INFO);
        return fetchTrends(tw).pipe(
            map(uploadRequest(envs.get("NODE_ENV") as string, envs.get("SERVICE_NAME") as string, envs.get("S3_BUCKET_NAME") as string)),
            tap(logInfo("after uploadRequest")),
            flatMap(upload(s3)),
            flatMap((sendData: SendData) => of(lambdaRes(httpStatus.OK, "successful", sendData))),
        ).toPromise();
    };
};

