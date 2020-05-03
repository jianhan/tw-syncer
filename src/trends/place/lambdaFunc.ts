import * as immutable from "immutable";
import {Environment, LogLevel} from "jianhan-fp-lib";
import {Logger} from "winston";
import {LambdaResponse} from "../../structures/LambdaResponse";
import {getClientsFromEnvs} from "../../clients";
import {dateToPath, fileKey, lambdaRes, log, validateAndThrow} from "../../operations";
import {of} from "rxjs";
import {flatMap, map, tap} from "rxjs/operators";

import {Parameters, toParameters} from "./Parameters";
import {getTrendsForPlace} from "./twitter";
import S3 from "aws-sdk/clients/s3";
import path from "path";
import moment from "moment";
import {upload} from "../../s3";
import * as httpStatus from "http-status-codes";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import Twitter = require("twitter");
import SendData = ManagedUpload.SendData;

// tslint:disable-next-line: no-var-requires
const sprintf = require("sprintf");

// tslint:disable-next-line:max-line-length
const uploadRequest = (nodeEnv: string, serviceName: string, bucket: string, date: moment.Moment, params: Parameters) => (body: Twitter.ResponseData): S3.Types.PutObjectRequest => ({
    Bucket: bucket,
    Key: fileKey(nodeEnv, serviceName, path.join('trends', 'place', dateToPath(date)), sprintf("%s.json", params.id)),
    Body: JSON.stringify(body)
});

export const lambdaFunc = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, params: { [key: string]: any }) => {
    return async (): Promise<LambdaResponse> => {
        const {s3, tw} = getClientsFromEnvs(envs);
        const logInfo = log(logger)(LogLevel.INFO);
        const parameters = toParameters(params);
        const generateUploadRequest = uploadRequest(
            envs.get("NODE_ENV") as string,
            envs.get("SERVICE_NAME") as string,
            envs.get("S3_BUCKET_NAME") as string,
            moment(),
            parameters
        );
        return of(parameters).pipe(
            tap(logInfo("place/lambdaFunc: after toParameter from")),
            // validate parameter or throw error
            flatMap(validateAndThrow),
            tap(logInfo("place/lambdaFunc: after validateAndThrow")),
            // fetching trending topics for a place
            flatMap(getTrendsForPlace(tw)),
            // upload to s3
            // tslint:disable-next-line:max-line-length
            map(generateUploadRequest),
            tap(logInfo("place/lambdaFunc: after uploadRequest")),
            flatMap(upload(s3)),
            flatMap((sendData: SendData) => of(lambdaRes(httpStatus.OK, "successful", sendData))),
        ).toPromise();
    }
};
