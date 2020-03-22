import {Logger} from "winston";
import {APIGatewayEvent} from "aws-lambda";
import * as httpStatus from "http-status-codes";
import {ErrResponse} from "./ErrResponse";
import {AbstractResponse} from "./AbstractResponse";
import {AbstractErrResponse} from "./AbstractErrResponse";

export type response = AbstractResponse | AbstractErrResponse;

// tslint:disable-next-line:max-line-length
export type lambdaFuncAsync = () => Promise<response>;

// tslint:disable-next-line:max-line-length
export type lambdaFuncSync = () => response;

export const lambdaNotFoundFunc = (logger: Logger, event: APIGatewayEvent) => {
    return () => {
        logger.warn('unable to find lambda function', event);
        return new ErrResponse("Can not find matching function to execute", httpStatus.BAD_REQUEST, event)
    }
};
