import {ValidationErrsResponse} from "./ValidationErrsResponse";
import {LambdaResponse} from "./LambdaResponse";
import * as httpStatus from "http-status-codes";
import {ValidationError} from "class-validator";
import {mocked} from "ts-jest/utils";

jest.mock('class-validator');

afterEach(() => {
    jest.clearAllMocks();
});

describe("test ValidationErrsResponse", () => {

    it("should have type of LambdaResponse", () => {
        const err = new ValidationErrsResponse("err message", []);
        expect(err).toBeInstanceOf(LambdaResponse);
    });

    it("should have bad request status code", () => {
        const err = new ValidationErrsResponse("err message", []);
        expect(err.getStatus()).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should generate details contains all validation errors", () => {
        const validationErrors = [1, 2, 3].map((arrV: number) => {
            const ve: ValidationError = new ValidationError();
            mocked(ve.toString).mockImplementation(() => 'error ' + arrV);
            return ve;
        });
        const errResp = new ValidationErrsResponse("err message", validationErrors);
        expect(errResp.getDetails()).toHaveLength(3);
        expect(errResp.getMessage()).toEqual('error 1 , error 2 , error 3');
    })
});
