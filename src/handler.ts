import {APIGatewayEvent} from "aws-lambda";
import {constants} from "http2";
import {Environment, LogLevel, getEnvs, createLogger} from "jianhan-fp-lib";
import {Envs} from "./Envs";
import {lambdaFunc} from "./users/lookup/lambdaFunc";
import {lambdaFuncAsync, lambdaFuncNotFound, lambdaFuncSync} from "./structures/lambdaFuncs";
import {findLambdaFunc} from "./operations";

const lambdaFuncMap: { [key: string]: lambdaFuncAsync | lambdaFuncSync } = {
    'users/lookup': lambdaFunc
};

export const handler = async (event: APIGatewayEvent): Promise<any> => {
    try {
        event.path
        event.body
        const func = findLambdaFunc(lambdaFuncMap, lambdaFuncNotFound, event.path);
        const envs = await getEnvs(process.env, Envs);
        const logger = createLogger(envs.get("NODE_ENV") as Environment, envs.get("SERVICE_NAME") as string, LogLevel.DEBUG);
        return await func(envs, logger, event);
    } catch (err) {
        return {
            statusCode: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            err,
        };
    }
};
