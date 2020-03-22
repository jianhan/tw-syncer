import {APIGatewayEvent} from "aws-lambda";
import {constants} from "http2";
import {Environment, LogLevel, getEnvs, createLogger} from "jianhan-fp-lib";
import {Envs} from "./Envs";
import {lambdaFunc as userLookupLambdaFunc} from "./users/lookup/lambdaFunc";
import {lambdaFuncAsync, lambdaFuncSync, lambdaNotFoundFunc} from "./structures/lambdaFuncs";
import {findLambdaFunc} from "./operations";
import {sync} from "./users/lookup/sync";
import {getClientsFromEnvs} from "./clients";
import moment = require("moment");
// tslint:disable-next-line:no-var-requires
const sprintf = require("sprintf");

export const handler = async (event: APIGatewayEvent): Promise<any> => {
    // resolve dependencies such as envs, logger, etc..
    const envs = await getEnvs(process.env, Envs);
    const logger = createLogger(envs.get("NODE_ENV") as Environment, envs.get("SERVICE_NAME") as string, LogLevel.DEBUG);

    // user lookup func dependencies
    const {s3, tw} = getClientsFromEnvs(envs);
    const key = sprintf("%s_users.json", moment().format("YYYY-MM-DD-HH:mm:ss"));
    const usersLookupSyncFunc = sync(logger, tw, {Bucket: envs.get("S3_BUCKET_NAME") as string, Key: key}, s3);

    // lambda function lookup map, key is path to lambda, value is the actual lambda function
    const lambdaFuncMap: { [key: string]: lambdaFuncAsync | lambdaFuncSync } = {
        'users/lookup': userLookupLambdaFunc(usersLookupSyncFunc, event)
    };

    // run lambda function
    try {
        const func = findLambdaFunc(lambdaFuncMap, lambdaNotFoundFunc(logger, event), event.path);
        return await func();
    } catch (err) {
        return {
            statusCode: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            err,
        };
    }
};
