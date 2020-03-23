import {Environment} from "jianhan-fp-lib";
import {Logger} from "winston";
import {getClientsFromEnvs} from "../../clients";
import {sync} from "./sync";
import * as httpStatus from "http-status-codes";
import * as immutable from "immutable";
import S from "sanctuary"
import moment = require("moment");
import {LambdaResponse} from "../../structures/LambdaResponse";
import fp from "lodash/fp";
// tslint:disable-next-line:no-var-requires
const sprintf = require("sprintf");

export const lambdaFunc = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, body: string) => {
    return async (): Promise<LambdaResponse> => {
        try {
            const key = sprintf("%s_users.json", moment().format("YYYY-MM-DD-HH:mm:ss"));
            const {s3, tw} = getClientsFromEnvs(envs);
            const syncFunc = sync(logger, tw, {Bucket: envs.get("S3_BUCKET_NAME") as string, Key: key}, s3);
            const syncResult = syncFunc(body);

            // extract value from Left or Right monad
            const extractedResult: any = S.either(fp.identity)(fp.identity)(syncResult);

            // error occur
            if (S.isLeft(syncResult)) {
                if (extractedResult instanceof LambdaResponse) {
                    return extractedResult;
                }

                return new LambdaResponse(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to process error from sync function', syncResult);
            }

            // all good, composition can reach the last step, which means monad return Right
            return await extractedResult.toPromise();
        } catch (err) {
            return new LambdaResponse(httpStatus.INTERNAL_SERVER_ERROR, 'Error occur', body);
        }
    }
};
