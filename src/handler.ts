import { APIGatewayEvent } from "aws-lambda";
import { constants } from "http2";
import _ from "lodash";
import { Environment, LogLevel, getEnvs, createLogger } from "jianhan-fp-lib";
import { Envs } from "./Envs";
import moment = require("moment");
import { getClientsFromEnvs } from "./clients";
import { sync } from "./users/lookup/sync";
const sprintf = require("sprintf");

export const handler = async (event: APIGatewayEvent): Promise<any> => {
    try {
        const envs = await getEnvs(process.env, Envs);
        const logger = createLogger(envs.get("NODE_ENV") as Environment, envs.get("SERVICE_NAME") as string, LogLevel.DEBUG);
        const key = sprintf("%s_users.json", moment().format("YYYY-MM-DD-HH:mm:ss"))
        const { s3, tw } = getClientsFromEnvs(envs)
        const ob = sync(logger, tw, { Bucket: envs.get("S3_BUCKET_NAME") as string, Key: key }, s3)(event.body);
    } catch (err) {
        return {
            statusCode: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
            err,
        };
    }
};
