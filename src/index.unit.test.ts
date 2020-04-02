import {createLogger, getEnvs} from "jianhan-fp-lib";
import {mocked} from "ts-jest/utils";
import {index} from "./index";
import {findLambdaFunc} from "./operations";
import * as httpStatus from "http-status-codes";
import {LambdaResponse} from "./structures/LambdaResponse";
import * as immutable from "immutable";
import * as winston from "winston";

jest.mock("jianhan-fp-lib");
jest.mock("./operations");

afterEach(() => {
    jest.clearAllMocks();
});

describe("test handler func", () => {

    it("should return internal server error when environment variables not valid", async () => {
        const errMsg = "invalid envs";
        mocked(getEnvs).mockImplementation(() => Promise.reject(errMsg));
        // @ts-ignore
        const result = await index({});
        expect(result).toEqual(new LambdaResponse(httpStatus.INTERNAL_SERVER_ERROR, "error occur while invoking lambda", errMsg));
    });

    it("should return response with internal server error when lambda func reject", async () => {
        const envs = immutable.Map({NODE_ENV: 'development', SERVICE_NAME: 'test service'});
        mocked(getEnvs).mockImplementation(() => Promise.resolve(envs));
        mocked(createLogger).mockImplementation( () => winston.createLogger({transports: [new winston.transports.Console()]}));
        const errMsg = "error occur";
        mocked(findLambdaFunc).mockImplementation(() => () => Promise.reject(errMsg));
        const event = {body: 'test'};
        // @ts-ignore
        const result = await index(event);
        expect(result.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
        expect(result.message).toBe("error occur while invoking lambda");
        expect(result.details).toBe(errMsg);
    })

});
