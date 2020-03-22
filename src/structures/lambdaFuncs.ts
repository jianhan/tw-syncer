import * as immutable from "immutable";
import {Environment} from "jianhan-fp-lib";
import {Logger} from "winston";
import {APIGatewayEvent} from "aws-lambda";
import * as httpStatus from "http-status-codes";
import {ErrResponse} from "./ErrResponse";
import {AbstractResponse} from "./AbstractResponse";
import {AbstractErrResponse} from "./AbstractErrResponse";

export type response = AbstractResponse | AbstractErrResponse;

// tslint:disable-next-line:max-line-length
export type lambdaFuncAsync = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent) => Promise<response>;

// tslint:disable-next-line:max-line-length
export type lambdaFuncSync = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent) => response;

// tslint:disable-next-line:max-line-length
export const lambdaFuncNotFound = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent): response => {
    logger.warn('unable to find lambda function', event, envs);
    return new ErrResponse("Can not find matching function to execute", httpStatus.BAD_REQUEST, event)
};
