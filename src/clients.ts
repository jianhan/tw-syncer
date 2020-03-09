import Twitter = require("twitter");
import { AccessTokenOptions } from "twitter";
import S3 = require("aws-sdk/clients/s3");
import { ClientConfiguration } from "aws-sdk/clients/s3";

export const getTwitterClient = (options: AccessTokenOptions): Twitter => new Twitter(options);
export const getS3Client = (configs: ClientConfiguration) => new S3(configs);

