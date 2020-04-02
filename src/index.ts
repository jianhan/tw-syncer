import * as httpStatus from "http-status-codes";
import {Environment, LogLevel, getEnvs, createLogger} from "jianhan-fp-lib";
import {Envs} from "./Envs";
import {lambdaFunc as userLookupLambdaFunc} from "./users/lookup/lambdaFunc";
import {lambdaFunc, lambdaNotFoundFunc} from "./structures/lambdaFuncs";
import {findLambdaFunc} from "./operations";
import {APIGatewayEvent} from "aws-lambda";
import {LambdaResponse} from "./structures/LambdaResponse";

export const index = async (event: APIGatewayEvent): Promise<any> => {
    // run lambda function
    try {
        // resolve dependencies such as envs, logger, etc..
        const envs = await getEnvs(process.env, Envs);
        const logger = createLogger(envs.get("NODE_ENV") as Environment, envs.get("SERVICE_NAME") as string, LogLevel.DEBUG);

        // lambda function lookup map, key is path to lambda, value is the actual lambda function
        const lambdaFuncMap: { [key: string]: lambdaFunc } = {
            'users/lookup': userLookupLambdaFunc(envs, logger, event.body as string)
        };

        const func = findLambdaFunc(lambdaFuncMap, lambdaNotFoundFunc(logger, event), event.path);
        return await func();
    } catch (err) {
        return new LambdaResponse(httpStatus.INTERNAL_SERVER_ERROR, "error occur while invoking lambda", err)
    }
};
