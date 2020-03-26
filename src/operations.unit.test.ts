import {lambdaFuncAsync, lambdaFuncSync} from "./structures/lambdaFuncs";
import {LambdaResponse} from "./structures/LambdaResponse";
import * as httpStatus from "http-status-codes";
import {findLambdaFunc} from "./operations";
import jsc from "jsverify";

describe('findLambdaFunc', () => {

    it("should find the matching lambda func and default func when not matched", () => {
        const notFoundResponse = new LambdaResponse(httpStatus.NOT_FOUND, 'test not found');
        const okResponse = new LambdaResponse(httpStatus.OK, 'test ok');
        const internalServerErrResponse = new LambdaResponse(httpStatus.INTERNAL_SERVER_ERROR, 'test internal server error');
        const badRequestResponse = new LambdaResponse(httpStatus.BAD_REQUEST, 'test bad request');

        const defaultCase = () => notFoundResponse;
        const funcsMap: { [p: string]: lambdaFuncAsync | lambdaFuncSync } = {
            testFuncOK: () => okResponse,
            testFuncInternalServerErr: () => internalServerErrResponse,
            testFuncBadRequest: () => badRequestResponse,
        };

        expect(findLambdaFunc(funcsMap, defaultCase, 'testFuncOK')()).toBe(okResponse);
        expect(findLambdaFunc(funcsMap, defaultCase, 'testFuncInternalServerErr')()).toBe(internalServerErrResponse);
        expect(findLambdaFunc(funcsMap, defaultCase, 'testFuncBadRequest')()).toBe(badRequestResponse);

        jsc.assert(
            jsc.forall("string", (s: string) => {
                return findLambdaFunc(funcsMap, defaultCase, s)() === notFoundResponse
            })
        );
    });
});
