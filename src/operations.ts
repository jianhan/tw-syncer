import {lambdaFunc} from "./structures/lambdaFuncs";
import {LambdaResponse} from "./structures/LambdaResponse";
import {ValidationError} from "class-validator";
import _ from "lodash";
import {envsMap} from "./structures/envs";
import path from "path";
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

export const lambdaRes = (status: number, message: string, details?: any) => new LambdaResponse(status, message, details);

export const isNullOrUndefined = (x: any): boolean => _.isNull(x) || _.isUndefined(x);

export const validationErrorsToStr = (validationErrors: ValidationError[]) => _.reduce(
    validationErrors,
    (accumulated: string[], current: ValidationError) => {
        accumulated.push(current.toString());
        return accumulated;
    }, []).join(",");

export const basePath = (envs: envsMap): string => path.join(envs.get("NODE_ENV") as string, envs.get("SERVICE_NAME") as string);

export const fileName = (first: string, second: string): string => sprintf("%s_%s.json", first, second);

export const fileKey = (envs: envsMap, first: string, second: string) => path.join(basePath(envs), fileName(first, second));
