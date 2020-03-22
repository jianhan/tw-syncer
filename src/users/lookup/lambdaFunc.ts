import {Environment} from "jianhan-fp-lib";
import {APIGatewayEvent} from "aws-lambda";
import {Logger} from "winston";
import {getClientsFromEnvs} from "../../clients";
import {sync} from "./sync";
import * as httpStatus from "http-status-codes";
import * as immutable from "immutable";
import S from "sanctuary"
import {ErrResponse} from "../../structures/ErrResponse";
import {response} from "../../structures/lambdaFuncs";
import {AbstractErrResponse} from "../../structures/AbstractErrResponse";
import moment = require("moment");
// tslint:disable-next-line:no-var-requires
const sprintf = require("sprintf");

/**
 * lambdaFunc is entry point for handler to invoke.
 *
 * @param envs
 * @param logger
 * @param event
 */
// tslint:disable-next-line:max-line-length
// export const lambdaFunc = async (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent): Promise<response> => {
//     try {
//         const key = sprintf("%s_users.json", moment().format("YYYY-MM-DD-HH:mm:ss"));
//         const {s3, tw} = getClientsFromEnvs(envs);
//         const syncResult = sync(logger, tw, {Bucket: envs.get("S3_BUCKET_NAME") as string, Key: key}, s3)(event.body);
//
//         // error occur
//         if (S.isLeft(syncResult)) {
//             if (syncResult instanceof AbstractErrResponse) {
//                 return syncResult;
//             }
//
//             return new ErrResponse('Unable to process error from sync function', httpStatus.INTERNAL_SERVER_ERROR, syncResult);
//         }
//
//         // all good, composition can reach the last step, which means monad return Right
//         return await syncResult.toPromise();
//     } catch (err) {
//         return new ErrResponse('Error occur', httpStatus.INTERNAL_SERVER_ERROR);
//     }
// };

export const lambdaFunc = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent) => {
    return async (): Promise<response> => {
        try {
            const key = sprintf("%s_users.json", moment().format("YYYY-MM-DD-HH:mm:ss"));
            const {s3, tw} = getClientsFromEnvs(envs);
            const syncResult = sync(logger, tw, {Bucket: envs.get("S3_BUCKET_NAME") as string, Key: key}, s3)(event.body);

            // error occur
            if (S.isLeft(syncResult)) {
                if (syncResult instanceof AbstractErrResponse) {
                    return syncResult;
                }

                return new ErrResponse('Unable to process error from sync function', httpStatus.INTERNAL_SERVER_ERROR, syncResult);
            }

            // all good, composition can reach the last step, which means monad return Right
            return await syncResult.toPromise();
        } catch (err) {
            return new ErrResponse('Error occur', httpStatus.INTERNAL_SERVER_ERROR);
        }
    }

};
