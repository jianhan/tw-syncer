import Twitter = require("twitter");
import { AccessTokenOptions } from "twitter";
import S3 = require("aws-sdk/clients/s3");
import { ClientConfiguration } from "aws-sdk/clients/s3";
import { Environment } from "jianhan-fp-lib";
import * as immutable from "immutable";

export const getTwitterClient = (options: AccessTokenOptions): Twitter => new Twitter(options);

export const getS3Client = (configs: ClientConfiguration) => new S3(configs);

export const getClientsFromEnvs = (envs: immutable.Map<string, string | Environment | undefined>) => {
    const s3 = getS3Client({
        accessKeyId: envs.get("S3_ACCESS_KEY_ID"),
        secretAccessKey: envs.get("S3_SECRET_ACCESS_KEY"),
    });

    const tw = getTwitterClient({
        consumer_key: envs.get("CONSUMER_API_KEY") as string,
        consumer_secret: envs.get("CONSUMER_API_SECRET_KEY") as string,
        access_token_key: envs.get("ACCESS_TOKEN") as string,
        access_token_secret: envs.get("ACCESS_SECRET") as string,
    });

    return { s3, tw };
}