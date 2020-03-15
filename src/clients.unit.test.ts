import { getTwitterClient, getS3Client } from "./clients";
import Twitter = require("twitter");
import { S3 } from "aws-sdk";

describe('getTwitterClient function', () => {
    it('should return tw client', () => {
        const client = getTwitterClient({ access_token_key: 'test', access_token_secret: 'test', consumer_key: 'test', consumer_secret: 'test' });
        expect(client).toBeInstanceOf(Twitter);
    });
});

describe('getS3Client function', () => {
    it('should return s3 client', () => {
        const client = getS3Client({});
        expect(client).toBeInstanceOf(S3);
    });
});