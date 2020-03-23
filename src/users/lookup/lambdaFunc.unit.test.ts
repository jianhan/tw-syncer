import S from "sanctuary";
import {sync} from "./sync";
import {mocked} from "ts-jest";
import {Logger} from "winston";
import Twitter from "twitter";
import {S3} from "aws-sdk";
import * as winston from "winston";
import {ErrResponse} from "../../structures/ErrResponse";
import * as httpStatus from "http-status-codes";
import {lambdaFunc} from "./lambdaFunc";
import {getClientsFromEnvs} from "../../clients";
import * as immutable from "immutable";

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

const s3UploadRequest: any = {Bucket: 'test', Key: 'test'};

afterEach(() => {
    jest.clearAllMocks();
});

describe("lambdaFunc test", () => {

    it('should return AbstractErrResponse when sync func return ErrResponse', async () => {
        const errResp = new ErrResponse('unable to parse JSON', httpStatus.BAD_REQUEST, 'test');
        mocked(getClientsFromEnvs).mockImplementation(() => ({s3: s3Client, tw: twitterClient}));
        mocked(sync).mockImplementation(() => () => S.Left(errResp));
        const func = lambdaFunc(immutable.Map({}), logger, 'test');
        const result = await func();

        expect(result.getMessage()).toEqual(errResp.message)
    });

    it('should return AbstractErrResponse when validations fail', () => {

    });

    it('should return AbstractErrResponse when s3 fetch reject', () => {

    });
});
