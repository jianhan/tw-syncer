import { sync } from './sync';
import { Logger } from 'winston';
import Twitter = require('twitter');
import winston = require('winston');
import { getTwitterClient, getS3Client } from '../../clients';
import { S3 } from 'aws-sdk';

const validJSON = (): string => `{
        "screen_name": ["test1", "test1", "test2"],
        "user_id": [1, 2, 3],
        "include_entities": true,
        "tweet_mode": false
    }`;

let logger: Logger;
let tw: Twitter;
let s3: S3;

beforeEach(() => {
    logger = winston.createLogger({
        transports: [new winston.transports.Console()]
    });
    tw = getTwitterClient({ access_token_key: 'test', access_token_secret: 'test', consumer_key: 'test', consumer_secret: 'test' });
    s3 = getS3Client({});
});

describe("sync function", () => {
    it("should handle invalid json parse error", () => {
        const result = sync(logger, tw, { Bucket: 'test', Key: 'test' }, s3)("invalid json");
        expect(result).toBeInstanceOf(Error);
        expect(result.name).toBe('SyntaxError');
    });

});