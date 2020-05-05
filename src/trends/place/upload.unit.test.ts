import {uploadRequest} from "./upload";
import {toParameters} from "./Parameters";
import moment = require("moment");
// tslint:disable-next-line:no-var-requires
const sprintf = require("sprintf");

describe("uploadRequest function", () => {

    it("should generate valid upload request", () => {
        const nodeEnv = 'development';
        const serviceName = 'test-service';
        const bucket = 'test-bucket';
        const d = moment();
        const parameters = toParameters({id: 1});
        const twitterResponseData = {name: 'test'};
        const req = uploadRequest(nodeEnv, serviceName, bucket, d, parameters)(twitterResponseData);
        // tslint:disable-next-line:max-line-length
        expect(req.Key).toBe(sprintf('%s/%s/trends/place/%s/%s/%s/%s.json', nodeEnv,serviceName, d.format('Y'), d.format('M'), d.format('D'), parameters.id));
        expect(req.Bucket).toBe(bucket);
        expect(req.Body).toBe(JSON.stringify(twitterResponseData));
    });

});
