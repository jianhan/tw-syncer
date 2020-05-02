import {createLogger, getEnvs} from "jianhan-fp-lib";
import {mocked} from "ts-jest/utils";
import {handler} from "./index";
import {findLambdaFunc} from "./operations";
import * as immutable from "immutable";
import * as winston from "winston";

jest.mock("jianhan-fp-lib");
jest.mock("./operations");

afterEach(() => {
    jest.clearAllMocks();
});

describe("test handler func", () => {

    it("should return internal server error when environment variables not valid", async () => {
        const err = new Error("invalid envs");
        mocked(getEnvs).mockImplementation(() => Promise.reject(err));
        try {
            // @ts-ignore
            await handler({});
        } catch (e) {
            expect(e).toBe(err);
        }
    });

    it("should return response with internal server error when lambda func reject", async () => {
        const envs = immutable.Map({NODE_ENV: 'development', SERVICE_NAME: 'test service'});
        mocked(getEnvs).mockImplementation(() => Promise.resolve(envs));
        mocked(createLogger).mockImplementation(() => winston.createLogger({transports: [new winston.transports.Console()]}));
        const err = new Error("error occur");
        mocked(findLambdaFunc).mockImplementation(() => () => Promise.reject(err));
        const event = {body: 'test'};
        try {
            // @ts-ignore
            const result = await handler(event);
        } catch (e) {
            expect(e).toBe(err);
        }
    })
});
