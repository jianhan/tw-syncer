import {Logger, default as winston} from "winston";
import {lambdaNotFoundFunc} from "./lambdaFuncs";
import {LambdaResponse} from "./LambdaResponse";
import * as httpStatus from "http-status-codes";

const logger: Logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

describe("lambdaNotFoundFunc function", () => {

    it("should return response with status BAD REQUEST and log the event", () => {
        const event = {test: 'test'};
        // @ts-ignore
        const response = lambdaNotFoundFunc(logger, event)();
        expect(response).toBeInstanceOf(LambdaResponse);
        expect(response.getMessage()).toEqual("Can not find matching function to execute");
        expect(response.getStatus()).toEqual(httpStatus.BAD_REQUEST);
        expect(response.getDetails()).toEqual(event);
    });
});
