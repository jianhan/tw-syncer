import {lambdaFunc} from "./structures/lambdaFuncs";
import {LambdaResponse} from "./structures/LambdaResponse";
import {ValidationError} from "class-validator";
import _ from "lodash";
import path from "path";
import {Logger} from "winston";
import {LogLevel} from "jianhan-fp-lib";
// tslint:disable-next-line: no-var-requires
const sprintf = require("sprintf");

/**
 * findLambdaFunc finds lambda function, it used to eliminates the need
 * for switch statement.
 *
 * @param cases
 * @param defaultCase
 * @param key
 */
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

/**
 * lambdaRes generates lambda response.
 *
 * @param status
 * @param message
 * @param details
 */
export const lambdaRes = (status: number, message: string, details?: any): LambdaResponse => new LambdaResponse(status, message, details);

/**
 * isNullOrUndefined checks an variable is null or undefined.
 *
 * @param x
 */
export const isNullOrUndefined = (x: any): boolean => _.isNull(x) || _.isUndefined(x);

/**
 * validationErrorsToStr generates string representation of array of validation errors.
 *
 * @param validationErrors
 */
export const validationErrorsToStr = (validationErrors: ValidationError[]) => _.reduce(
    validationErrors,
    (accumulated: string[], current: ValidationError) => {
        accumulated.push(current.toString());
        return accumulated;
    }, []).join(",");

/**
 * basePath generates a base path for uploading by node env and service name.
 *
 * @param nodeEnv
 * @param serviceName
 */
export const basePath = (nodeEnv: string, serviceName: string): string => path.join(nodeEnv, serviceName);

/**
 * fileName is a common pattern for generating filename so that all files are following the same pattern..
 *
 * @param first
 * @param second
 */
export const fileName = (first: string, second: string): string => sprintf("%s_%s.json", first, second);

/**
 * fileKey is a generic function which generates a key when uploading file to s3.
 *
 * @param nodeEnv
 * @param serviceName
 * @param first
 * @param second
 */
// tslint:disable-next-line:max-line-length
export const fileKey = (nodeEnv: string, serviceName: string, first: string, second: string) => path.join(basePath(nodeEnv, serviceName), fileName(first, second));

/**
 * pickAttributes picks attributes within an array of objects.
 * k
 * @param attributes
 */
export const pickAttributes = (attributes: string[]) => (arr: any[]) => arr.map(item => _.pick(item, attributes));

/**
 * log is curried version of logging function.
 *
 * @param logger
 */
export const log = (logger: Logger) => (level: LogLevel) => (message: string) => (meta: any) => logger.log(level, message, meta);
