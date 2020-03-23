import {Logger} from "winston";
import {APIGatewayEvent} from "aws-lambda";
import * as httpStatus from "http-status-codes";
import {LambdaResponse} from "./LambdaResponse";

// tslint:disable-next-line:max-line-length
export type lambdaFuncAsync = () => Promise<LambdaResponse>;

// tslint:disable-next-line:max-line-length
export type lambdaFuncSync = () => LambdaResponse;

export const lambdaNotFoundFunc = (logger: Logger, event: APIGatewayEvent) => {
    return () => {
        logger.warn('unable to find lambda function', event);
        return new LambdaResponse(httpStatus.BAD_REQUEST, "Can not find matching function to execute", event)
    }
};
