import {lambdaFuncAsync, lambdaFuncSync} from "./structures/lambdaFuncs";
import {LambdaResponse} from "./structures/LambdaResponse";

export const findLambdaFunc = (
    cases: { [p: string]: lambdaFuncAsync | lambdaFuncSync },
    defaultCase: lambdaFuncAsync | lambdaFuncSync,
    key: string) => {
    if (cases.hasOwnProperty(key)) {
        return cases[key]
    } else {
        return defaultCase
    }
};

export const newResponseFunc = (status: number, message: string, details?: any) => new LambdaResponse(status, message, details);
