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
const LambdaResponse_1 = require("./LambdaResponse");
/**
 * lambdaNotFoundFunc a default function to generate response when lambda function
 * was not found.
 *
 * @param logger
 * @param event
 */
exports.lambdaNotFoundFunc = (logger, event) => {
    return () => {
        logger.warn('unable to find lambda function', event);
        return new LambdaResponse_1.LambdaResponse(httpStatus.BAD_REQUEST, "Can not find matching function to execute", event);
    };
};
