import {uploadRequest} from "./upload";

// tslint:disable-next-line:no-var-requires
const sprintf = require('sprintf');

describe("uploadRequest function", () => {
    it("should generate valid request for s3 upload", () => {
        const bucket = "test-bucket";
        const env = "development";
        const service = "test-service";
        const body = {test: 'test'};
        const result = uploadRequest("development", "test-service", "test-bucket")({test: 'test'})
        expect(result).toEqual({Bucket: bucket, Key: sprintf('%s/%s/trends/available/trends.json', env, service), Body: JSON.stringify(body)})
    });
});
