import AWS from "aws-sdk";
import S3, {GetObjectOutput, PutObjectRequest} from "aws-sdk/clients/s3";
import {from, of} from "rxjs";
import {Parameters} from "./Parameters";
import {envsMap} from "../../structures/envs";
import {flatMap} from "rxjs/operators";
import {fromTweets, Timeline} from "./Timeline";
import {Logger} from "winston";
import {fileKey} from "../../operations";
import Twitter = require("twitter");

export const getClient = (accessKeyId: string, secretAccessKey: string): AWS.S3 => new AWS.S3({accessKeyId, secretAccessKey});

export const fetchRequest = (envs: envsMap) => (params: Parameters): S3.Types.GetObjectRequest => ({
    Bucket: envs.get('S3_BUCKET_NAME') as string,
    Key: fileKey(envs, params.screen_name as string, 'timeline')
});

export const fetch = (s3: AWS.S3) => (logger: Logger) => (params: S3.Types.GetObjectRequest) => from(s3.getObject(params).promise().catch(e => {
    logger.warn("error occur when fetching files from s3", {params, e});
    return {Body: ""}
}));

export const generateTimelineWithSinceId = (objectOutput: S3.Types.GetObjectOutput) => of(objectOutput).pipe(
    flatMap((o: GetObjectOutput) => {
        try {
            return of(fromTweets(JSON.parse(o.Body as string)))
        } catch (e) {
            return of(Timeline.of());
        }
    })
);

export const uploadRequest = (envs: envsMap) => (params: Parameters) => (body: Twitter.ResponseData): S3.Types.PutObjectRequest => ({
    Bucket: envs.get('S3_BUCKET_NAME') as string,
    Key: fileKey(envs, params.screen_name as string, 'timeline'),
    Body: JSON.stringify(body)
});

export const upload = (s3: S3) => (putObjectRequest: PutObjectRequest) => from(s3.upload(putObjectRequest).promise());
