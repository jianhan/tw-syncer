import { Environment, getEnvs, createLogger, LogLevel } from "jianhan-fp-lib";
import { Logger } from "winston";
import { Envs } from "../../Envs";
import * as immutable from 'immutable'
import moment = require("moment");
import { getS3Client, getTwitterClient } from "../../clients";
import { sync } from "./sync";
const sprintf = require("sprintf");

let envs: immutable.Map<string, string | Environment | undefined>;
let logger: Logger;

const validJSON = (): string => `{
        "screen_name": ["chenqiushi404"],
        "user_id": [],
        "include_entities": true,
        "tweet_mode": false
    }`;

beforeEach(async () => {
    envs = await getEnvs(process.env, Envs);
    logger = createLogger(envs.get("NODE_ENV") as Environment, envs.get("SERVICE_NAME") as string, LogLevel.DEBUG);
});

describe("sync function", () => {
    it("should sync user", () => {
        const key = sprintf("%s_users.json", moment().format("YYYY-MM-DD-HH:mm:ss"))
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

        const r = sync(logger, tw, { Bucket: envs.get("S3_BUCKET_NAME") as string, Key: key }, s3)
        console.log(r(validJSON()));
    });
});