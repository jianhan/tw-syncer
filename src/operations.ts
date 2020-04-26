import {lambdaFunc} from "./structures/lambdaFuncs";
import {LambdaResponse} from "./structures/LambdaResponse";
import {ValidationError} from "class-validator";
import _ from "lodash";
import path from "path";
import {Logger} from "winston";
import {LogLevel} from "jianhan-fp-lib";
// tslint:disable-next-line: no-var-requires
const sprintf = require("sprintf");

export const findLambdaFunc = (
    cases: { [p: string]: lambdaFunc },
    defaultCase: lambdaFunc,
    key: string): lambdaFunc => {
    if (cases.hasOwnProperty(key)) {
        return cases[key]
    } else {
        return defaultCase
    }
};

export const lambdaRes = (status: number, message: string, details?: any): LambdaResponse => new LambdaResponse(status, message, details);

export const isNullOrUndefined = (x: any): boolean => _.isNull(x) || _.isUndefined(x);

export const validationErrorsToStr = (validationErrors: ValidationError[]) => _.reduce(
    validationErrors,
    (accumulated: string[], current: ValidationError) => {
        accumulated.push(current.toString());
        return accumulated;
    }, []).join(",");

export const basePath = (nodeEnv: string, serviceName: string): string => path.join(nodeEnv, serviceName);

export const fileName = (first: string, second: string): string => sprintf("%s_%s.json", first, second);

// tslint:disable-next-line:max-line-length
export const fileKey = (nodeEnv: string, serviceName: string, first: string, second: string) => path.join(basePath(nodeEnv, serviceName), fileName(first, second));

export const pickAttributes = (attributes: string[]) => (arr: any[]) => arr.map(item => _.pick(item, attributes));

export const log = (logger: Logger) => (level: LogLevel) => (message: string) => (meta: any) => logger.log(level, message, meta);
