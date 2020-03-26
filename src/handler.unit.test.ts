import {createLogger, getEnvs} from "jianhan-fp-lib";
import {mocked} from "ts-jest/utils";
import {handler} from "./handler";
import * as httpStatus from "http-status-codes";
import {LambdaResponse} from "./structures/LambdaResponse";
import * as immutable from "immutable";
import * as winston from "winston";

jest.mock("jianhan-fp-lib");

afterEach(() => {
    jest.clearAllMocks();
});

describe("test handler func", () => {

    it("should return internal server error when environment variables not valid", async () => {
        const errMsg = "invalid envs";
        mocked(getEnvs).mockImplementation(() => Promise.reject(errMsg));
        // @ts-ignore
        const result = await handler({});
        expect(result).toEqual(new LambdaResponse(httpStatus.INTERNAL_SERVER_ERROR, "error occur while invoking lambda", errMsg));
    });

    it("should run lambdaNotFoundFunc when no matching lambda func was found", async () => {
        const envs = immutable.Map({NODE_ENV: 'development', SERVICE_NAME: 'test service'});
        mocked(getEnvs).mockImplementation(() => Promise.resolve(envs));
        mocked(createLogger).mockImplementation( () => winston.createLogger({transports: [new winston.transports.Console()]}));

        const event = {body: 'test'};
        // @ts-ignore
        const result = await handler(event);
        expect(result).toEqual(new LambdaResponse(httpStatus.BAD_REQUEST, "Can not find matching function to execute", event));
    });

    it("should return response with internal server error when lambda func reject", () => {

    })

});
