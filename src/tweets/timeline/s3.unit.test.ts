import {fetchRequest, getClient} from "./s3";
import AWS from "aws-sdk";
import {toParameters} from "./Parameters";
import {fileKey} from "../../operations";

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
