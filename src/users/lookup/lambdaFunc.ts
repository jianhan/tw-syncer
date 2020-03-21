import {Environment} from "jianhan-fp-lib";
import {APIGatewayEvent} from "aws-lambda";
import moment = require("moment");
import {Logger} from "winston";
import {getClientsFromEnvs} from "../../clients";
import {sync} from "./sync";
// tslint:disable-next-line:no-var-requires
const sprintf = require("sprintf");
import * as httpStatus from "http-status-codes";
import * as immutable from "immutable";
import {response} from "../../structures/SimpleResponses";

// tslint:disable-next-line:max-line-length
export const lambdaFunc = async (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, event: APIGatewayEvent): Promise<response> => {
    try {
        const key = sprintf("%s_users.json", moment().format("YYYY-MM-DD-HH:mm:ss"));
        const {s3, tw} = getClientsFromEnvs(envs);
        const ob = sync(logger, tw, {Bucket: envs.get("S3_BUCKET_NAME") as string, Key: key}, s3)(event.body);
        const result = await ob.toPromise();
        return {
            statusCode: httpStatus.OK,
            message: 'Sync successful',
            details: result,
        };
    } catch (err) {
        return {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error occur',
        };
    }
};
