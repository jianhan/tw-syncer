import * as immutable from "immutable";
import {Environment} from "jianhan-fp-lib";
import {Logger} from "winston";
import {APIGatewayEvent} from "aws-lambda";
import {response} from "./SimpleResponses";
import * as httpStatus from "http-status-codes";

// tslint:disable-next-line:max-line-length
export type lambdaFuncAsync = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent) => Promise<response>;

export type lambdaFuncSync = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent) => response;

// tslint:disable-next-line:max-line-length
export const lambdaFuncNotFound = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent): response => {
    logger.warn('unable to find lambda function', event, envs);
    return {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Can not find matching function to execute",
        details: event
    };
};

