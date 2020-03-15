import Twitter = require("twitter");
import { AccessTokenOptions } from "twitter";
import S3 = require("aws-sdk/clients/s3");
import { ClientConfiguration } from "aws-sdk/clients/s3";
import { Environment } from "jianhan-fp-lib";
import * as immutable from "immutable";

/**
 * getTwitterClient function to get twitter client, used for compositions.
 *
 * @param options
 */
export const getTwitterClient = (options: AccessTokenOptions): Twitter => new Twitter(options);

/**
 * getS3Client function to get s3 client, used for function compositions.
 *
 * @param configs
 */
export const getS3Client = (configs: ClientConfiguration) => new S3(configs);

/**
 * getClientsFromEnvs is a simple method returns 2 clients by environment.
 * Notice: this function assume to be composed right after valid envs, thus it
 * did not do any validations, etc..
 *
 * @param envs
 */
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