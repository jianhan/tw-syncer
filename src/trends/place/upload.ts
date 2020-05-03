import moment from "moment";
import {Parameters} from "./Parameters";
import S3 from "aws-sdk/clients/s3";
import {dateToPath, fileKey} from "../../operations";
import path from "path";
import Twitter = require("twitter");
// tslint:disable-next-line: no-var-requires
const sprintf = require("sprintf");

// tslint:disable-next-line:max-line-length
export const uploadRequest = (nodeEnv: string, serviceName: string, bucket: string, date: moment.Moment, params: Parameters) => (body: Twitter.ResponseData): S3.Types.PutObjectRequest => ({
    Bucket: bucket,
    Key: fileKey(nodeEnv, serviceName, path.join('trends', 'place', dateToPath(date)), sprintf("%s.json", params.id)),
    Body: JSON.stringify(body)
});
