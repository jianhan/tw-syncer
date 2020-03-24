import {Environment, getEnvs, createLogger, LogLevel} from "jianhan-fp-lib";
import {Logger} from "winston";
import {Envs} from "../../Envs";
import * as immutable from 'immutable'
import moment = require("moment");
import {getClientsFromEnvs} from "../../clients";
import {sync} from "./sync";
import {Observable} from 'rxjs';
import {lambdaFunc} from "./lambdaFunc";
import * as httpStatus from "http-status-codes";

// tslint:disable-next-line: no-var-requires
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
        const key = sprintf("%s_users.json", moment().format("YYYY-MM-DD-HH:mm:ss"));
        const {s3, tw} = getClientsFromEnvs(envs);

        const result = sync(logger, tw, {Bucket: envs.get("S3_BUCKET_NAME") as string, Key: key}, s3)(validJSON());
        expect(result).toBeInstanceOf(Observable);
        const p = await result.toPromise();
        expect(p).toHaveProperty('ETag');
        expect(p).toHaveProperty('ServerSideEncryption');
        expect(p).toHaveProperty('VersionId');
        expect(p).toHaveProperty('Location');
        expect(p).toHaveProperty('key');
        expect(p).toHaveProperty('Bucket');
        expect(p.Bucket).toBe(envs.get('S3_BUCKET_NAME'));
    });
});

describe("lambda function", () => {
    it("should sync user via lambda function", async () => {
        const event = {
            body: validJSON()
        };
        // @ts-ignore
        const result = await lambdaFunc(envs, logger, event);
        expect(result).toHaveProperty('statusCode');
        expect(result.statusCode).toEqual(httpStatus.OK);
        expect(result).toHaveProperty('message');
        expect(result.message).toEqual("Sync successful");
    });
});
