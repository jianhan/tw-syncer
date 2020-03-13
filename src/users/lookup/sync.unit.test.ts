import { sync, parseJSON } from './sync';
import { Logger } from 'winston';
import Twitter = require('twitter');
import winston = require('winston');
import { getTwitterClient, getS3Client } from '../../clients';
import { S3 } from 'aws-sdk';
import { validateSync, ValidationError } from 'class-validator';
import Parameters from './Parameters';

// tslint:disable-next-line: max-line-length
const genJSON = (obj: { [key: string]: any } = { screen_name: ['test'], user_id: [1], include_entities: true, tweet_mode: false }): string => JSON.stringify(obj);

let logger: Logger;
let tw: Twitter;
let s3: S3;
let createInstance: any;

beforeEach(() => {
    logger = winston.createLogger({
        transports: [new winston.transports.Console()]
    });
    tw = getTwitterClient({ access_token_key: 'test', access_token_secret: 'test', consumer_key: 'test', consumer_secret: 'test' });
    s3 = getS3Client({});
    createInstance = (json: string) => sync(logger, tw, { Bucket: 'test', Key: 'test' }, s3)(json)
});

describe("sync function", () => {
    it("should handle invalid json parse error", () => {
        const result = createInstance("invalid json");
        expect(result).toBeInstanceOf(Error);
        expect(result.name).toBe('SyntaxError');
    });



    it("should validate screen_name parameter when it is empty array", () => {
        const result = createInstance(genJSON({ screen_name: [] }));
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
        result.forEach((e: any) => expect(e).toBeInstanceOf(ValidationError))
        expect(result[0].property).toBe('screen_name');
    });

});