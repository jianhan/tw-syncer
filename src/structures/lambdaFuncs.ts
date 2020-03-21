import * as immutable from "immutable";
import {Environment} from "jianhan-fp-lib";
import {Logger} from "winston";
import {APIGatewayEvent} from "aws-lambda";
import {simpleResponse} from "./SimpleResponses";
import * as httpStatus from "http-status-codes";

// tslint:disable-next-line:max-line-length
export type lambdaFuncAsync = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent) => Promise<simpleResponse>;

// tslint:disable-next-line:max-line-length
export type lambdaFuncSync = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent) => simpleResponse;

// tslint:disable-next-line:max-line-length
export const lambdaFuncNotFound = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent): simpleResponse => {
    logger.warn('unable to find lambda function', event, envs);
    return {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Can not find matching function to execute",
        details: event
    };
};

