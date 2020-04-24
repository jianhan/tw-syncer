import * as immutable from "immutable";
import {Environment} from "jianhan-fp-lib";
import {Logger} from "winston";
import {LambdaResponse} from "../../structures/LambdaResponse";
import {getClientsFromEnvs} from "../../clients";
import {toParameters} from "./Parameters";
import {sync} from "./sync";

export const lambdaFunc = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, body: { [key: string]: any }) => {
    return async (): Promise<LambdaResponse> => {
        const {s3, tw} = getClientsFromEnvs(envs);
        return sync(envs, s3, tw, logger, toParameters(body)).toPromise();
    }
};
