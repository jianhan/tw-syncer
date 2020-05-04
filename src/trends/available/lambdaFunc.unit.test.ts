import {lambdaFunc} from "./lambdaFunc";
import {default as winston, Logger} from "winston";
import Twitter from "twitter";
import {S3} from "aws-sdk";
import {mocked} from "ts-jest/utils";
import {getClientsFromEnvs} from "../../clients";
import * as immutable from "immutable";
import {uploadRequest} from "./upload";
import {upload} from "../../s3";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import {PutObjectRequest} from "aws-sdk/clients/s3";
import {from} from "rxjs";
import SendData = ManagedUpload.SendData;

jest.setTimeout(10000);

jest.mock('../../clients');
jest.mock('twitter');
jest.mock('./upload');
jest.mock('../../s3');

const logger: Logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

const envs = immutable.Map({NODE_ENV: 'development', SERVICE_NAME: 'test service'});

const twitterClient: jest.Mocked<Twitter> = new Twitter({
    access_token_key: 'test',
    access_token_secret: 'test',
    consumer_key: 'test',
    consumer_secret: 'test'
}) as any;

const s3Client: jest.Mocked<S3> = new S3({}) as any;

const trendsAvailableRespData: Twitter.ResponseData = [{
    "name": "Worldwide",
    "placeType": {"code": 19, "name": "Supername"},
    "url": "http://where.yahooapis.com/v2/place/1",
    "parentid": 0,
    "country": "",
    "woeid": 1,
    "countryCode": null
}];
const sendData: SendData = {
    Location: "test-location",
    ETag: "test-etag",
    Bucket: "test-bucket",
    Key: "test-key",
};

beforeEach(() => {
    jest.spyOn(twitterClient, "get").mockImplementation(() => Promise.resolve(trendsAvailableRespData));
    // @ts-ignore
    mocked(upload).mockImplementation((s3: S3) => (putObjectRequest: PutObjectRequest) => from(Promise.resolve(sendData)));
    mocked(getClientsFromEnvs).mockImplementation(() => ({s3: s3Client, tw: twitterClient}));
    mocked(uploadRequest).mockReturnValue((body: Twitter.ResponseData) => ({Bucket: "test", Body: JSON.stringify(body), Key: "test"}));
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("lambdaFunc function", () => {

    it("should throw error when fetchTrends reject/failed", async () => {
        const err = new Error("error");
        mocked(twitterClient.get).mockImplementation(() => Promise.reject(err));
        try {
            await lambdaFunc(envs, logger)
        } catch (e) {
            expect(e).toEqual(err);
        }
    });

    it("should generate correct uploadRequest based on returning value from fetchTrends", async () => {
        const result = await lambdaFunc(envs, logger)();
        expect(uploadRequest).toBeCalledTimes(1);
        expect(upload).toBeCalledTimes(1);
        expect(upload).toBeCalledWith(s3Client);
        expect(result.getStatus()).toBe(200);
        expect(result.getDetails()).toBe(sendData);
    });

});
