"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Twitter = require("twitter");
const S3 = require("aws-sdk/clients/s3");
/**
 * getTwitterClient function to get twitter client, used for compositions.
 *
 * @param options
 */
exports.getTwitterClient = (options) => new Twitter(options);
/**
 * getS3Client function to get s3 client, used for function compositions.
 *
 * @param configs
 */
exports.getS3Client = (configs) => new S3(configs);
/**
 * getClientsFromEnvs is a simple method returns 2 clients by environment.
 * Notice: this function assume to be composed right after valid envs, thus it
 * did not do any validations, etc..
 *
 * @param envs
 */
exports.getClientsFromEnvs = (envs) => {
    const s3 = exports.getS3Client({
        accessKeyId: envs.get("S3_ACCESS_KEY_ID"),
        secretAccessKey: envs.get("S3_SECRET_ACCESS_KEY"),
    });
    const tw = exports.getTwitterClient({
        consumer_key: envs.get("CONSUMER_API_KEY"),
        consumer_secret: envs.get("CONSUMER_API_SECRET_KEY"),
        access_token_key: envs.get("ACCESS_TOKEN"),
        access_token_secret: envs.get("ACCESS_SECRET"),
    });
    return { s3, tw };
};
