"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clients_1 = require("../../clients");
const sync_1 = require("./sync");
const httpStatus = __importStar(require("http-status-codes"));
const sanctuary_1 = __importDefault(require("sanctuary"));
const LambdaResponse_1 = require("../../structures/LambdaResponse");
const fp_1 = __importDefault(require("lodash/fp"));
const operations_1 = require("../../operations");
/**
 * isLambdaResponse checks if an give variable is an instance of LambdaResponse.
 *
 * @param obj
 */
const isLambdaResponse = (obj) => obj instanceof LambdaResponse_1.LambdaResponse;
/**
 * processLeft contains logic to process Left monad of sync result.
 */
const processLeft = sanctuary_1.default.ifElse(isLambdaResponse)(fp_1.default.identity)(sanctuary_1.default.curry3(operations_1.lambdaRes)(httpStatus.INTERNAL_SERVER_ERROR)('Unable to process error from sync function'));
/**
 * processRight contains right to process Left monad of sync result.
 *
 * @param result
 */
const processRight = (result) => {
    return result.toPromise().then((r) => {
        return new LambdaResponse_1.LambdaResponse(httpStatus.OK, 'upload successful', r);
    }).catch(err => {
        return new LambdaResponse_1.LambdaResponse(httpStatus.INTERNAL_SERVER_ERROR, 'Error occur, unable to upload', err);
    });
};
/**
 * lambdaFunc is the entry point function for user lookup functionality.
 *
 * @param envs
 * @param logger
 * @param body
 */
exports.lambdaFunc = (envs, logger, body) => {
    return async () => {
        const key = operations_1.fileKey(envs.get("NODE_ENV"), envs.get("SERVICE_NAME"), 'users', 'lookup');
        const { s3, tw } = clients_1.getClientsFromEnvs(envs);
        const syncResult = sync_1.sync(logger, tw, { Bucket: envs.get("S3_BUCKET_NAME"), Key: key }, s3)(body);
        const extractedResult = sanctuary_1.default.either(fp_1.default.identity)(fp_1.default.identity)(syncResult);
        // TODO: suppose to use S.either and processLeft + processRight to compose the return value
        // but it keep error out, because promise type can not be recognized, need to fix it.
        if (sanctuary_1.default.isLeft(syncResult)) {
            // @ts-ignore
            return processLeft(extractedResult);
        }
        return await processRight(extractedResult);
    };
};
