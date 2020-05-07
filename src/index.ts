import {createLogger, Environment, getEnvs, LogLevel} from "jianhan-fp-lib";
import {Envs} from "./Envs";
import {lambdaFunc as usersLookupLambdaFunc} from "./users/lookup/lambdaFunc";
import {lambdaFunc as tweetsTimelineFunc} from "./tweets/timeline/lambdaFunc";
import {lambdaFunc as trendsAvailableTimelineFunc} from "./trends/available/lambdaFunc";
import {lambdaFunc as trendsPlaceFunc} from "./trends/place/lambdaFunc";
import {lambdaFunc as trendsPlacesFunc} from "./trends/places/lambdaFunc";
import {lambdaFunc, lambdaNotFoundFunc} from "./structures/lambdaFuncs";
import {findLambdaFunc} from "./operations";
import {APIGatewayEvent} from "aws-lambda";
import {LambdaResponse} from "./structures/LambdaResponse";
import httpStatus from "http-status-codes";

export const handler = async (event: APIGatewayEvent): Promise<any> => {
    // run lambda function
    try {
        // resolve dependencies such as envs, logger, etc..
        const envs = await getEnvs(process.env, Envs);
        const logger = createLogger(envs.get("NODE_ENV") as Environment, envs.get("SERVICE_NAME") as string, LogLevel.DEBUG);

        // lambda function lookup map, key is path to lambda, value is the actual lambda function
        const lambdaFuncMap: { [key: string]: lambdaFunc } = {
            'users/lookup': usersLookupLambdaFunc(envs, logger, event.body as string),
            'tweets/timeline': tweetsTimelineFunc(envs, logger, event.body as any),
            'trends/available': trendsAvailableTimelineFunc(envs, logger),
            'trends/place': trendsPlaceFunc(envs, logger, event.body as any),
            'trends/places': trendsPlacesFunc(envs, logger, event.body as any),
        };

        const func = findLambdaFunc(lambdaFuncMap, lambdaNotFoundFunc(logger, event), event.path);
        return await func();
    } catch (err) {
        return new LambdaResponse(httpStatus.INTERNAL_SERVER_ERROR, "error occur while invoking lambda", err)
    }
};
