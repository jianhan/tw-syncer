import S from "sanctuary"
import {sync} from './sync';
import {Logger} from 'winston';
import Twitter from "twitter";
import winston = require('winston');
import {S3} from 'aws-sdk';
import {ValidationError} from 'class-validator';
import {Observable} from "rxjs"
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import fp from "lodash/fp";
import {LambdaResponse} from "../../structures/LambdaResponse";

const genJSON = (obj: { [key: string]: any } = {
    screen_name: ['test'],
    user_id: [1],
    include_entities: true,
    tweet_mode: true
}): string => JSON.stringify(obj);

const logger: Logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

const tw: jest.Mocked<Twitter> = new Twitter({
    access_token_key: 'test',
    access_token_secret: 'test',
    consumer_key: 'test',
    consumer_secret: 'test'
}) as any;
const s3: jest.Mocked<S3> = new S3({}) as any;
let syncWithJSON: any;
const twGetResponse: any = {test: 'test'};
const s3UploadRequest: any = {Bucket: 'test', Key: 'test'};

beforeEach(() => {
    const s: ManagedUpload = {
        abort: jest.fn(),
        promise: () => Promise.resolve({Location: 'test location', ETag: "test ETag", Bucket: "test Bucket", Key: "test Key"}),
        send: jest.fn(),
        on: jest.fn()
    };
    jest.spyOn(tw, "get").mockImplementation(() => Promise.resolve(twGetResponse));
    jest.spyOn(s3, "upload").mockImplementation(() => s);
    syncWithJSON = (json: string) => {
        const syncResult = sync(logger, tw, s3UploadRequest, s3)(json);
        return S.either(fp.identity)(fp.identity)(syncResult)
    }
});

afterEach(() => {
    jest.clearAllMocks();
});

const validateProperty = (json: string, key: string) => {
    const result = syncWithJSON(json);
    expect(result).toBeInstanceOf(LambdaResponse);
    expect(result.getDetails()).toHaveLength(1);
    // @ts-ignore
    result.getDetails().forEach((e: any) => expect(e).toBeInstanceOf(ValidationError));
    expect(result.getDetails()[0].property).toBe(key);
};

describe("sync function", () => {

    it("should handle invalid json parse error", () => {
        const invalidJSON = "invalid json";
        const result = syncWithJSON(invalidJSON);
        expect(result).toBeInstanceOf(LambdaResponse);
        expect(result.message).toBe('unable to parse JSON');
        expect(result.getDetails().inputVal).toBe(invalidJSON);
    });

    it("should validate screen_name parameter to be invalid when it is not presented", () => {
        validateProperty(genJSON({}), 'screen_name')
    });
    it("should validate screen_name parameter to be invalid when it is not array", () => {
        validateProperty(genJSON({screen_name: false}), 'screen_name')
    });
    it("should validate screen_name parameter to be invalid when it is empty array", () => {
        validateProperty(genJSON({screen_name: []}), 'screen_name')
    });

    it("should validate screen_name parameter to be invalid when it exceed max size", () => {
        const wordsExceeded = Array.from(new Array(101), (val, index) => "some string invalid" + index + val);
        validateProperty(genJSON({screen_name: wordsExceeded}), 'screen_name');

        const wordsMaxValid = Array.from(new Array(100), (val, index) => "some string valid" + index + val);
        const resultMaxValid = syncWithJSON(genJSON({screen_name: wordsMaxValid}));
        expect(resultMaxValid).toBeInstanceOf(Observable);
    });

    it("should validate screen_name parameter to be invalid when it contains none string value", () => {
        validateProperty(genJSON({screen_name: [{test: 'test'}, true]}), 'screen_name')
    });

    it("should validate user_id parameter to be invalid when it exceed max size", () => {
        const idExceeded = Array.from(new Array(101), (_val, index) => index);
        validateProperty(genJSON({screen_name: ['test'], user_id: idExceeded}), 'user_id');

        const idMaxValid = Array.from(new Array(100), (_val, index) => index);
        const resultMaxValid = syncWithJSON(genJSON({screen_name: ['test'], user_id: idMaxValid}));
        expect(resultMaxValid).toBeInstanceOf(Observable);
    });

    it("should validate user_id parameter to be invalid when it contains none boolean value", () => {
        validateProperty(genJSON({screen_name: ['test'], user_id: ['test']}), 'user_id')
    });

    it("should be valid when include_entities and tweet_mode are not set", () => {
        const result = syncWithJSON(genJSON({screen_name: ['test'], user_id: [1]}));
        expect(result).toBeInstanceOf(Observable);
    });

    it("should sensitize screen_name parameter", () => {
        syncWithJSON(genJSON({screen_name: ['test', 'test ', ' need_trim '], user_id: [1], tweet_mode: true, include_entities: true}));
        expect(tw.get).toHaveBeenCalledWith("users/lookup", {
            "include_entities": "true",
            "screen_name": "test,need_trim",
            "tweet_mode": "true",
            "user_id": "1"
        });
    });

    it("should sensitize user_id parameter", () => {
        syncWithJSON(genJSON({screen_name: ['test'], user_id: [1, 0, 2, 3, 5], tweet_mode: true, include_entities: true}));
        expect(tw.get).toHaveBeenCalledWith("users/lookup", {
            "include_entities": "true",
            "screen_name": "test",
            "tweet_mode": "true",
            "user_id": "1,2,3,5"
        });
    });

    it("should have correct parameter passed to upload function", async () => {
        const r = syncWithJSON(genJSON({screen_name: ['test'], user_id: [1, 0, 2, 3, 5]}));
        await r.toPromise();
        expect(s3.upload).toHaveBeenCalledWith(Object.assign({}, s3UploadRequest, {Body: JSON.stringify(twGetResponse)}));
    });

    it("should handle tw fetch reject", async () => {
        const errMsg = 'fetching error';
        jest.spyOn(tw, "get").mockImplementation(() => Promise.reject(new Error(errMsg)));
        const r = syncWithJSON(genJSON({screen_name: ['test'], user_id: [1, 0, 2, 3, 5]}));
        try {
            await r.toPromise();
        } catch (e) {
            expect(e.message).toBe(errMsg)
        }
    });

    it("should handle s3 upload error", async () => {
        const errMsg = 'upload error';
        const manageUploadErr: ManagedUpload = {
            abort: jest.fn(),
            promise: () => Promise.reject(new Error(errMsg)),
            send: jest.fn(),
            on: jest.fn()
        };
        jest.spyOn(s3, "upload").mockImplementation(() => manageUploadErr);
        const r = syncWithJSON(genJSON({screen_name: ['test'], user_id: [1, 0, 2, 3, 5]}));
        try {
            await r.toPromise();
        } catch (e) {
            expect(e.message).toBe(errMsg)
        }
    })
});
