import AWS from "aws-sdk";
import S3, {GetObjectOutput, PutObjectRequest} from "aws-sdk/clients/s3";
import {from, of} from "rxjs";
import {Parameters} from "./Parameters";
import {flatMap} from "rxjs/operators";
import {Logger} from "winston";
import {fileKey} from "../../operations";
import Twitter = require("twitter");

export const getClient = (accessKeyId: string, secretAccessKey: string): AWS.S3 => new AWS.S3({accessKeyId, secretAccessKey});

export const fetchRequest = (nodeEnv: string, serviceName: string, bucketName: string) => (params: Parameters): S3.Types.GetObjectRequest => ({
    Bucket: bucketName,
    Key: fileKey(nodeEnv, serviceName, params.screen_name as string, 'timeline')
});

export const fetch = (s3: AWS.S3) => (logger: Logger) => (params: S3.Types.GetObjectRequest) => from(s3.getObject(params).promise().catch(e => {
    logger.warn("error occur when fetching files from s3", {params, e});
    return {Body: ""}
}));

export const parseResponseBody = (objectOutput: S3.Types.GetObjectOutput) => of(objectOutput).pipe(
    flatMap((o: GetObjectOutput) => {
        try {
            return of(JSON.parse(o.Body as string))
        } catch (e) {
            return of([]);
        }
    })
);

// tslint:disable-next-line:max-line-length
export const uploadRequest = (nodeEnv: string, serviceName: string, bucket: string) => (params: Parameters) => (body: Twitter.ResponseData): S3.Types.PutObjectRequest => ({
    Bucket: bucket,
    Key: fileKey(nodeEnv, serviceName, params.screen_name as string, 'timeline'),
    Body: JSON.stringify(body)
});

export const upload = (s3: S3) => (putObjectRequest: PutObjectRequest) => from(s3.upload(putObjectRequest).promise());
