import AWS from "aws-sdk";
import S3, {GetObjectOutput, PutObjectRequest} from "aws-sdk/clients/s3";
import {from, of} from "rxjs";
import path from "path";
import {Parameters} from "./Parameters";
import {envsMap} from "../../structures/envs";
import {flatMap} from "rxjs/operators";
import {fromTweets, Timeline} from "./Timeline";
import Twitter = require("twitter");
// tslint:disable-next-line: no-var-requires
const sprintf = require("sprintf");

export const basePath = (envs: envsMap): string => path.join(envs.get("NODE_ENV") as string, envs.get("SERVICE_NAME") as string);

export const fileName = (screenName: string): string => sprintf("%s_timeline.json", screenName);

export const getClient = (accessKeyId: string, secretAccessKey: string): AWS.S3 => new AWS.S3({accessKeyId, secretAccessKey});

export const fileKey = (envs: envsMap, parameters: Parameters) => path.join(basePath(envs), fileName(parameters.screen_name as string));

export const fetchRequest = (envs: envsMap, params: Parameters): S3.Types.GetObjectRequest => ({
    Bucket: envs.get('S3_BUCKET_NAME') as string,
    Key: fileKey(envs, params)
});

export const fetch = (s3: AWS.S3, params: S3.Types.GetObjectRequest) => from(s3.getObject(params).promise());

export const generateTimelineWithSinceId = (objectOutput: S3.Types.GetObjectOutput) => {
    return of(objectOutput).pipe(
        flatMap((o: GetObjectOutput) => {
            try {
                return of(fromTweets(JSON.parse(o.Body as string)))
            } catch (e) {
                return of(new Timeline());
            }
        })
    );
};

export const uploadRequest = (envs: envsMap, params: Parameters, body: Twitter.ResponseData): S3.Types.PutObjectRequest => ({
    Bucket: envs.get('S3_BUCKET_NAME') as string,
    Key: fileKey(envs, params),
    Body: JSON.stringify(body)
});

export const upload = (s3: S3, putObjectRequest: PutObjectRequest) => from(s3.upload(putObjectRequest).promise());
