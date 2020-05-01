import {fetch, fetchRequest, getClient, parseResponseBody, uploadRequest} from "./s3";
import AWS from "aws-sdk";
import {toParameters} from "./Parameters";
import {fileKey} from "../../operations";
import * as winston from "winston";
import {Logger} from "winston";
import path from "path";

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
        expect(r.Key).toEqual(fileKey(nodeEnv, serviceName, path.join("tweets", "timeline"), 'test.json'));
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

describe("parseResponseBody function", () => {

    it("should return empty array when json is not valid", async () => {
        const result = await parseResponseBody({Body: "invalid json"}).toPromise();
        expect(result).toEqual([]);
    });

    it("should return valid json response when body is valid", async () => {
        const result = await parseResponseBody({Body: `[{"id": 1, "name": "test"}]`}).toPromise();
        expect(result).toEqual([{id: 1, name: "test"}]);
    });

});

describe("uploadRequest function", () => {

    it("should generate valid request", () => {
        const param = toParameters({screen_name: "test_screen_name"});
        const body = [{id: 1, name: "test"}];
        const result = uploadRequest("development", "test-service", "test-bucket")(param)(body);
        expect(result.Body).toEqual(JSON.stringify(body));
    });

});
