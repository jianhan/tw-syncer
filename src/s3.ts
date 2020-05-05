import AWS from "aws-sdk";
import S3, {PutObjectRequest} from "aws-sdk/clients/s3";
import {from} from "rxjs";

/**
 * getClient returns a new instance of AWS.S3 client.
 *
 * @param accessKeyId
 * @param secretAccessKey
 */
export const getClient = (accessKeyId: string, secretAccessKey: string): AWS.S3 => new AWS.S3({accessKeyId, secretAccessKey});

/**
 * upload creates a new observable for uploading timeline file to s3.
 *
 * @param s3
 */
export const upload = (s3: S3) => (putObjectRequest: PutObjectRequest) => from(s3.upload(putObjectRequest).promise());
