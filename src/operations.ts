import {lambdaFuncAsync, lambdaFuncSync} from "./structures/lambdaFuncs";

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
