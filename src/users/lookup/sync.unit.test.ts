import { sync } from './sync';
import { Logger } from 'winston';
import Twitter = require('twitter');
import winston = require('winston');
import { getTwitterClient, getS3Client } from '../../clients';
import { S3 } from 'aws-sdk';
import { ValidationError } from 'class-validator';
import { Observable } from "rxjs"

// tslint:disable-next-line: max-line-length
const genJSON = (obj: { [key: string]: any } = { screen_name: ['test'], user_id: [1], include_entities: true, tweet_mode: false }): string => JSON.stringify(obj);

let logger: Logger;
let tw: Twitter;
let s3: S3;
let runWithJSON: any;

beforeEach(() => {
    logger = winston.createLogger({
        transports: [new winston.transports.Console()]
    });
    tw = getTwitterClient({ access_token_key: 'test', access_token_secret: 'test', consumer_key: 'test', consumer_secret: 'test' });
    s3 = getS3Client({});
    runWithJSON = (json: string) => sync(logger, tw, { Bucket: 'test', Key: 'test' }, s3)(json)
});

describe("sync function", () => {
    it("should handle invalid json parse error", () => {
        const result = runWithJSON("invalid json");
        expect(result).toBeInstanceOf(Error);
        expect(result.name).toBe('SyntaxError');
    });

    it("should validate screen_name parameter to be invalid when it is not presented", () => {
        const result = runWithJSON(genJSON({}));
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
        result.forEach((e: any) => expect(e).toBeInstanceOf(ValidationError))
        expect(result[0].property).toBe('screen_name');
    });

    it("should validate screen_name parameter to be invalid when it is empty array", () => {
        const result = runWithJSON(genJSON({ screen_name: [] }));
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
        result.forEach((e: any) => expect(e).toBeInstanceOf(ValidationError))
        expect(result[0].property).toBe('screen_name');
    });

    it("should validate screen_name parameter to be invalid when it exceed max size", () => {
        const wordsExceeded = Array.from(new Array(101), (val, index) => "some string " + index + val);
        const resultExceeded = runWithJSON(genJSON({ screen_name: wordsExceeded }));
        expect(resultExceeded).toBeInstanceOf(Array);
        expect(resultExceeded).toHaveLength(1);
        resultExceeded.forEach((e: any) => expect(e).toBeInstanceOf(ValidationError))
        expect(resultExceeded[0].property).toBe('screen_name');

        const wordsMaxValid = Array.from(new Array(100), (val, index) => "some string " + index + val);
        const resultMaxValid = runWithJSON(genJSON({ screen_name: wordsMaxValid }));
        expect(resultMaxValid).toBeInstanceOf(Observable);
    });

    it("should validate screen_name parameter to be invalid when it contains none string value", () => {
        const wordsExceeded = Array.from(new Array(101), (val, index) => "some string " + index + val);
        const resultExceeded = runWithJSON(genJSON({ screen_name: wordsExceeded }));
        expect(resultExceeded).toBeInstanceOf(Array);
        expect(resultExceeded).toHaveLength(1);
        resultExceeded.forEach((e: any) => expect(e).toBeInstanceOf(ValidationError))
        expect(resultExceeded[0].property).toBe('screen_name');

        const wordsMaxValid = Array.from(new Array(100), (val, index) => "some string " + index + val);
        const resultMaxValid = runWithJSON(genJSON({ screen_name: wordsMaxValid }));
        expect(resultMaxValid).toBeInstanceOf(Observable);
    });

});