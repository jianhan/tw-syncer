import { Environment, getEnvs, createLogger, LogLevel } from "jianhan-fp-lib";
import { Logger } from "winston";
import { Envs } from "../../Envs";
import * as immutable from 'immutable'
import moment = require("moment");
import { getClientsFromEnvs } from "../../clients";
import { sync } from "./sync";
import { Observable } from 'rxjs';
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
    it("should sync user", async () => {
        const key = sprintf("%s_users.json", moment().format("YYYY-MM-DD-HH:mm:ss"))
        const { s3, tw } = getClientsFromEnvs(envs)

        const result = sync(logger, tw, { Bucket: envs.get("S3_BUCKET_NAME") as string, Key: key }, s3)(validJSON());

        if (result instanceof Observable) {
            try {
                const p = await result.toPromise();
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log(result)
        }
    });
});