import {sync} from "./sync";
import {getEnvs} from "jianhan-fp-lib";
import {Envs} from "../../Envs";
import {getClient} from "./s3";
import {getTwitterClient} from "../../clients";
import {envsMap} from "../../structures/envs";
import {toParameters} from "./Parameters";
import {default as winston, Logger} from "winston";
import Twitter = require("twitter");

jest.setTimeout(10000);

let s3Client: AWS.S3;
let envs: envsMap;
let twitterClient: Twitter;
const logger: Logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

beforeEach(async () => {
    envs = await getEnvs(process.env, Envs);
    s3Client = getClient(envs.get('S3_ACCESS_KEY_ID') as string, envs.get('S3_SECRET_ACCESS_KEY') as string);
    twitterClient = getTwitterClient({
        consumer_key: envs.get("CONSUMER_API_KEY") as string,
        consumer_secret: envs.get("CONSUMER_API_SECRET_KEY") as string,
        access_token_key: envs.get("ACCESS_TOKEN") as string,
        access_token_secret: envs.get("ACCESS_SECRET") as string,
    });
});

describe("sync function", () => {
    it("should sync", async () => {
        const params = toParameters({screen_name: "realDonaldTrump"});
        const result = await sync(envs, params, s3Client, twitterClient, logger).toPromise();
        expect(result).toHaveProperty('ETag');
        expect(result).toHaveProperty('Location');
        expect(result).toHaveProperty('Key');
    })
});
