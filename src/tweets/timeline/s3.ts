import AWS from "aws-sdk";
import S3, {GetObjectOutput, PutObjectRequest} from "aws-sdk/clients/s3";
import {from, of} from "rxjs";
import {Parameters} from "./Parameters";
import {flatMap} from "rxjs/operators";
import {Logger} from "winston";
import {fileKey} from "../../operations";
import Twitter = require("twitter");

/**
 * getClient returns a new instance of AWS.S3 client.
 *
 * @param accessKeyId
 * @param secretAccessKey
 */
export const getClient = (accessKeyId: string, secretAccessKey: string): AWS.S3 => new AWS.S3({accessKeyId, secretAccessKey});

/**
 * fetchRequest generates request for fetching timeline file from s3 bucket.
 *
 * @param nodeEnv
 * @param serviceName
 * @param bucketName
 */
export const fetchRequest = (nodeEnv: string, serviceName: string, bucketName: string) => (params: Parameters): S3.Types.GetObjectRequest => ({
    Bucket: bucketName,
    Key: fileKey(nodeEnv, serviceName, params.screen_name as string, 'timeline')
});

/**
 * fetch creates a new observable from getting new object from s3 promise.
 *
 * @param s3
 */
export const fetch = (s3: AWS.S3) => (logger: Logger) => (params: S3.Types.GetObjectRequest) => from(s3.getObject(params).promise().catch(e => {
    logger.warn("error occur when fetching files from s3", {params, e});
    return {Body: ""}
}));

/**
 * parseResponseBody parses response body from json string to js array.
 *
 * @param objectOutput
 */
export const parseResponseBody = (objectOutput: S3.Types.GetObjectOutput) => of(objectOutput).pipe(
    flatMap((o: GetObjectOutput) => {
        try {
            return of(JSON.parse(o.Body as string))
        } catch (e) {
            return of([]);
        }
    })
);

/**
 * uploadRequest generates upload request for uploading new timeline file to s3.
 *
 * @param nodeEnv
 * @param serviceName
 * @param bucket
 */
// tslint:disable-next-line:max-line-length
export const uploadRequest = (nodeEnv: string, serviceName: string, bucket: string) => (params: Parameters) => (body: Twitter.ResponseData): S3.Types.PutObjectRequest => ({
    Bucket: bucket,
    Key: fileKey(nodeEnv, serviceName, params.screen_name as string, 'timeline'),
    Body: JSON.stringify(body)
});

/**
 * upload creates a new observable for uploading timeline file to s3.
 *
 * @param s3
 */
export const upload = (s3: S3) => (putObjectRequest: PutObjectRequest) => from(s3.upload(putObjectRequest).promise());
