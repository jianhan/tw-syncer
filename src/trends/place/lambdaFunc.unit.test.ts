import {Parameters} from "./Parameters";
import {lambdaFunc} from "./lambdaFunc";
import {default as winston, Logger} from "winston";
import * as immutable from "immutable";
import {validateSync} from "class-validator";
import Twitter from "twitter";
import {mocked} from "ts-jest/utils";
import {S3} from "aws-sdk";
import {getClientsFromEnvs} from "../../clients";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";

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

const envs = immutable.Map({NODE_ENV: 'development', SERVICE_NAME: 'test service'});

const trends = [{id: 1, name: 'test'}];

const uploadResponseData = {ETag: 'test', Location: 'test-location', Bucket: 'test-bucket', Key: 'test-key'};

beforeEach(() => {
    const manageUploadResponse: ManagedUpload = {
        abort: jest.fn(),
        promise: () => Promise.resolve(uploadResponseData),
        send: jest.fn(),
        on: jest.fn()
    };
    jest.spyOn(s3Client, "upload").mockImplementation(() => manageUploadResponse);
    jest.spyOn(twitterClient, "get").mockImplementation(() => Promise.resolve(trends));
    mocked(getClientsFromEnvs).mockImplementation(() => ({s3: s3Client, tw: twitterClient}));
    // mocked(uploadRequest).mockReturnValue((body: Twitter.ResponseData) => ({Bucket: "test", Body: JSON.stringify(body), Key: "test"}));
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("lambdaFunc function", () => {

    it("should throw error when parameter validation failed", async () => {
        const expectedMessage = validateSync(new Parameters()).toString();
        try {
            await lambdaFunc(envs, logger, {})()
        } catch (e) {
            expect(e.message).toBe(expectedMessage);
        }
    });

    it("should throw error when getTrendsForPlace failed", async () => {
        const err = new Error('twitter error');
        jest.spyOn(twitterClient, "get").mockImplementation(() => Promise.reject(err));
        try {
            await lambdaFunc(envs, logger, {id: 1})();
        } catch (e) {
            expect(e).toBe(err);
        }
    });

    it("should throw error when upload reject", async () => {
        const err = new Error('upload error');
        const manageUploadErr: ManagedUpload = {
            abort: jest.fn(),
            promise: () => Promise.reject(err),
            send: jest.fn(),
            on: jest.fn()
        };
        jest.spyOn(s3Client, "upload").mockImplementation(() => manageUploadErr);
        try {
            await lambdaFunc(envs, logger, {id: 1})();
        } catch (e) {
            expect(e).toBe(err);
        }
    });

    it("should process sync and return valid response", async () => {
        const response = await lambdaFunc(envs, logger, {id: 1})();
        expect(response.getStatus()).toBe(200);
        expect(response.getDetails()).toBe(uploadResponseData);
    });

});
