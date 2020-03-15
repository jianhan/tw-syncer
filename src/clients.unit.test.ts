import { getTwitterClient, getS3Client, getClientsFromEnvs } from "./clients";
import Twitter = require("twitter");
import { S3 } from "aws-sdk";
import * as immutable from "immutable";

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

describe('getClientsFromEnvs function', () => {
    it('should return s3 and tw client', () => {
        const envs = immutable.Map({
            'S3_ACCESS_KEY_ID': 'test',
            'S3_SECRET_ACCESS_KEY': 'test',
            'CONSUMER_API_KEY': 'test',
            'CONSUMER_API_SECRET_KEY': 'test',
            'ACCESS_TOKEN': 'test',
            'ACCESS_SECRET': 'test'
        });
        const { s3, tw } = getClientsFromEnvs(envs);
        expect(tw).toBeInstanceOf(Twitter);
        expect(s3).toBeInstanceOf(S3);
    });
});