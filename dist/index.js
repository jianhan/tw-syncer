"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus = __importStar(require("http-status-codes"));
const jianhan_fp_lib_1 = require("jianhan-fp-lib");
const Envs_1 = require("./Envs");
const lambdaFunc_1 = require("./users/lookup/lambdaFunc");
const lambdaFunc_2 = require("./tweets/timeline/lambdaFunc");
const lambdaFuncs_1 = require("./structures/lambdaFuncs");
const operations_1 = require("./operations");
const LambdaResponse_1 = require("./structures/LambdaResponse");
exports.handler = async (event) => {
    // run lambda function
    try {
        // resolve dependencies such as envs, logger, etc..
        const envs = await jianhan_fp_lib_1.getEnvs(process.env, Envs_1.Envs);
        const logger = jianhan_fp_lib_1.createLogger(envs.get("NODE_ENV"), envs.get("SERVICE_NAME"), jianhan_fp_lib_1.LogLevel.DEBUG);
        // lambda function lookup map, key is path to lambda, value is the actual lambda function
        const lambdaFuncMap = {
            'users/lookup': lambdaFunc_1.lambdaFunc(envs, logger, event.body),
            // TODO: fix the event.body parameter type
            'tweets/timeline': lambdaFunc_2.lambdaFunc(envs, logger, event.body)
        };
        const func = operations_1.findLambdaFunc(lambdaFuncMap, lambdaFuncs_1.lambdaNotFoundFunc(logger, event), event.path);
        return await func();
    }
    catch (err) {
        return new LambdaResponse_1.LambdaResponse(httpStatus.INTERNAL_SERVER_ERROR, "error occur while invoking lambda", err);
    }
};
