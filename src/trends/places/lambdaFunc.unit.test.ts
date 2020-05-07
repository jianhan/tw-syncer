import {default as winston, Logger} from "winston";
import {S3} from "aws-sdk";
import Twitter from "twitter";
import {lambdaFunc} from "./lambdaFunc";
import * as immutable from "immutable";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import {mocked} from "ts-jest/utils";
import {getClientsFromEnvs} from "../../clients";
import fs from "fs";

jest.mock("twitter");
jest.mock('../../clients');

const twitterClient: jest.Mocked<Twitter> = new Twitter({
    access_token_key: 'test',
    access_token_secret: 'test',
    consumer_key: 'test',
    consumer_secret: 'test'
}) as any;

const s3Client: jest.Mocked<S3> = new S3({}) as any;

const logger: Logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

const envs = immutable.Map({NODE_ENV: 'development', SERVICE_NAME: 'test service', S3_BUCKET_NAME: 'bucket'});

const uploadResponseData = {ETag: 'test', Location: 'test-location', Bucket: 'test-bucket', Key: 'test-key'};

const manageUploadResponse: ManagedUpload = {
    abort: jest.fn(),
    promise: () => Promise.resolve(uploadResponseData),
    send: jest.fn(),
    on: jest.fn()
};

const trends: Twitter.ResponseData = JSON.parse(fs.readFileSync(__dirname + "/__tests__/trends.json").toString());

beforeEach(() => {
    jest.spyOn(s3Client, "upload").mockImplementation(() => manageUploadResponse);
    jest.spyOn(twitterClient, "get").mockImplementation(() => Promise.resolve(trends));
    mocked(getClientsFromEnvs).mockImplementation(() => ({s3: s3Client, tw: twitterClient}));
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("lambdaFunc function", () => {

    it("it should fetch and sync all trends", async () => {
        const r = await lambdaFunc(envs, logger, {countryCodes: ["AU"]})();
        expect(r.getStatus()).toBe(200);
        expect(r.getDetails()).toHaveLength(8);
        r.getDetails().forEach((v: any) => {
            expect(v).toBe(uploadResponseData)
        });
    });

    it("it should catch/handle parameters validation failed", async () => {
        try {
            await lambdaFunc(envs, logger, {countryCodes: ["ABCDEF"]})();
        } catch (e) {
            expect(e.message).toMatch(/(countryCodes)/i);
            expect(e).not.toBeNull();
        }
    });

    it("it should handle some of fetchTrends fails, but successfully process others", async () => {

        // @ts-ignore
        jest.spyOn(twitterClient, "get").mockImplementation((path: string, params: any) => {
            if (params.id === 1098081 || params.id === 1099805 || params.id === 1100661) {
                return Promise.reject("fetching error");
            }
            return Promise.resolve(trends)
        });

        const r = await lambdaFunc(envs, logger, {countryCodes: ["AU"]})();
        expect(r.getDetails()).toHaveLength(5);
    })

});
