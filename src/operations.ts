import {lambdaFuncAsync, lambdaFuncSync} from "./structures/lambdaFuncs";

export const findLambdaFunc = (
    cases: { [key: string]: lambdaFuncAsync | lambdaFuncSync },
    defaultCase: lambdaFuncSync,
    key: string) => {
    if (cases.hasOwnProperty(key)) {
        return cases[key]
    } else {
        return defaultCase
    }
};
