import {default as winston, Logger} from "winston";
import Twitter from "twitter";
import {getClientsFromEnvs} from "../../clients";
import {S3} from "aws-sdk";
import {mocked} from "ts-jest/utils";
import {fetchTrends} from "./fetch";
import {toArray} from "rxjs/operators";

jest.mock("twitter");
jest.mock('../../clients');

const logger: Logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

const s3Client: jest.Mocked<S3> = new S3({}) as any;

const twitterClient: jest.Mocked<Twitter> = new Twitter({
    access_token_key: 'test',
    access_token_secret: 'test',
    consumer_key: 'test',
    consumer_secret: 'test'
}) as any;

beforeEach(() => {
    jest.spyOn(twitterClient, "get").mockImplementation(() => Promise.resolve([]));
    mocked(getClientsFromEnvs).mockImplementation(() => ({s3: s3Client, tw: twitterClient}));
});

describe("fetchTrends function", () => {

    it("should return empty observable when error occur", async () => {
        const locations = [
            {woeid: 123, countryCode: 'AU', name: 'Brisbane'},
            {woeid: 456, countryCode: 'AU', name: 'Sydney'},
            {woeid: 789, countryCode: 'AU', name: "Melbourne"}
        ];

        // @ts-ignore
        jest.spyOn(twitterClient, "get").mockImplementation((path, params) => {
            // @ts-ignore
            if (params.id === 123 || params.id === 456) {
                // @ts-ignore
                return Promise.resolve([{name: params.id}]);
            }

            return Promise.reject(new Error("error"));

        });
        const t = await fetchTrends(logger, twitterClient)(locations).pipe(toArray()).toPromise();
        expect(t).toEqual([[{name: 123}], [{name: 456}]]);
    });

});
