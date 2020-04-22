"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LambdaResponse_1 = require("./structures/LambdaResponse");
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
// tslint:disable-next-line: no-var-requires
const sprintf = require("sprintf");
exports.findLambdaFunc = (cases, defaultCase, key) => {
    if (cases.hasOwnProperty(key)) {
        return cases[key];
    }
    else {
        return defaultCase;
    }
};
exports.lambdaRes = (status, message, details) => new LambdaResponse_1.LambdaResponse(status, message, details);
exports.isNullOrUndefined = (x) => lodash_1.default.isNull(x) || lodash_1.default.isUndefined(x);
exports.validationErrorsToStr = (validationErrors) => lodash_1.default.reduce(validationErrors, (accumulated, current) => {
    accumulated.push(current.toString());
    return accumulated;
}, []).join(",");
exports.basePath = (nodeEnv, serviceName) => path_1.default.join(nodeEnv, serviceName);
exports.fileName = (first, second) => sprintf("%s_%s.json", first, second);
exports.fileKey = (nodeEnv, serviceName, first, second) => path_1.default.join(exports.basePath(nodeEnv, serviceName), exports.fileName(first, second));
