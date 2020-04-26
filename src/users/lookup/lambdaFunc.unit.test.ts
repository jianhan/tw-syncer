import S from "sanctuary";
import {sync} from "./sync";
import {mocked} from "ts-jest/utils";
import * as winston from "winston";
import {Logger} from "winston";
import Twitter from "twitter";
import {S3} from "aws-sdk";
import * as httpStatus from "http-status-codes";
import {lambdaFunc} from "./lambdaFunc";
import {getClientsFromEnvs} from "../../clients";
import * as immutable from "immutable";
import {LambdaResponse} from "../../structures/LambdaResponse";
import {from} from 'rxjs';

jest.setTimeout(10000);

// jest.mock('APIGatewayEvent');
jest.mock('./sync');
jest.mock('../../clients');

const logger: Logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

const twitterClient: jest.Mocked<Twitter> = new Twitter({
    access_token_key: 'test',
    access_token_secret: 'test',
    consumer_key: 'test',
    consumer_secret: 'test'
}) as any;

const s3Client: jest.Mocked<S3> = new S3({}) as any;

afterEach(() => {
    jest.clearAllMocks();
});

describe("lambdaFunc test", () => {

    it('should return Response contains err message when sync func returns Left monad', async () => {
        const errResp = new LambdaResponse(httpStatus.BAD_REQUEST, 'unable to parse JSON', 'test');
        mocked(getClientsFromEnvs).mockImplementation(() => ({s3: s3Client, tw: twitterClient}));
        mocked(sync).mockImplementation(() => () => S.Left(errResp));
        const func = lambdaFunc(immutable.Map({NODE_ENV: "development", SERVICE_NAME: "tw-syncer"}), logger, 'test');
        const result = await func();

        expect(result.getMessage()).toEqual(errResp.getMessage())
    });

    it('should return Response contains successful message when sync func returns Right monad', async () => {
        const uploadSuccessfulResponse = {test: 'test'};
        const ob = from(Promise.resolve(uploadSuccessfulResponse));
        mocked(getClientsFromEnvs).mockImplementation(() => ({s3: s3Client, tw: twitterClient}));
        mocked(sync).mockImplementation(() => () => S.Right(ob));
        const func = lambdaFunc(immutable.Map({NODE_ENV: "development", SERVICE_NAME: "tw-syncer"}), logger, 'test');
        const result = await func();

        expect(result).toEqual(new LambdaResponse(httpStatus.OK, 'upload successful', uploadSuccessfulResponse));
    });

});
