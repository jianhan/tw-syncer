import S3 from "aws-sdk/clients/s3";
import {fileKey} from "../../operations";
import path from "path";
import Twitter = require("twitter");

/**
 * uploadRequest generates upload request for uploading available trends to s3.
 *
 * @param nodeEnv
 * @param serviceName
 * @param bucket
 */
export const uploadRequest = (nodeEnv: string, serviceName: string, bucket: string) => (body: Twitter.ResponseData): S3.Types.PutObjectRequest => ({
    Bucket: bucket,
    Key: fileKey(nodeEnv, serviceName, path.join('trends', 'available'), "trends.json"),
    Body: JSON.stringify(body)
});
