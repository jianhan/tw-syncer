import {fetchRequest, getClient, fetch} from "./s3";
import AWS from "aws-sdk";
import {toParameters} from "./Parameters";
import {fileKey} from "../../operations";
import { Logger } from "winston";
import * as winston from "winston";

const s3Client: AWS.S3 = new AWS.S3({accessKeyId: "test", secretAccessKey: "test"});
const logger: Logger = winston.createLogger({
    transports: [new winston.transports.Console()]
}) as any;


afterEach(() => {
    jest.restoreAllMocks();
});

describe("getClient function", () => {

    it("should get client", () => {
        const key = "key";
        const secret = "secret";
        const client = getClient(key, secret);
        expect(client).toBeInstanceOf(AWS.S3);
        expect(client.config.accessKeyId).toEqual(key);
        expect(client.config.secretAccessKey).toEqual(secret);
    })

});

describe("fetchRequest function", () => {

    it("should generate valid GetObjectRequest", () => {
        const bucket = "test-bucket";
        const nodeEnv = "development";
        const serviceName = "test-service";
        const r = fetchRequest(nodeEnv, serviceName, bucket)(toParameters({screen_name: "test"}));
        expect(r.Bucket).toEqual(bucket);
        expect(r.Key).toEqual(fileKey(nodeEnv, serviceName, "test", 'timeline'));
    })

});

describe("fetch function", () => {

    it("should return empty body when promise reject", async () => {
        // @ts-ignore
        jest.spyOn(s3Client, "getObject").mockImplementation(() => ({promise: () => Promise.reject(new Error("test error"))}));
        const spy = jest.spyOn(logger, "warn");

        // @ts-ignore
        const result = await fetch(s3Client)(logger)({}).toPromise();
        expect(spy).toBeCalledTimes(1);

        expect(result).toEqual({Body: ""});
    });
});
