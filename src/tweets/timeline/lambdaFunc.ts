import {Environment} from "jianhan-fp-lib";
import {LambdaResponse} from "../../structures/LambdaResponse";
import * as immutable from "immutable";
import {getClientsFromEnvs} from "../../clients";
import {Logger} from "winston";
import moment = require("moment");
// tslint:disable-next-line:no-var-requires
const sprintf = require("sprintf");

export const lambdaFunc = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, body: { [key: string]: any }) => {
    return async (): Promise<LambdaResponse> => {
        const key = sprintf("%s/%s/%s_users.json", envs.get("NODE_ENV") as string, envs.get("SERVICE_NAME") as string, moment().format("YYYY-MM-DD-HH:mm:ss"));
        const {s3, tw} = getClientsFromEnvs(envs);
    }
};
