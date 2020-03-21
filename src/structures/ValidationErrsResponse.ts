import {ValidationError} from "class-validator";
import * as httpStatus from "http-status-codes";
import {SimpleResponse} from "./SimpleResponses";

/**
 * ValidationErrsResponse is a thin wrapper for validation errors from class-validator package.
 * The reason is when doing composition, if any validation errors occur then it can be used
 * as return value directly, do not have to convert validation errors array into a response anymore.
 */
export class ValidationErrsResponse extends Error implements SimpleResponse {

    /**
     * validationErrors contains array of validation errors.
     */
    private readonly validationErrors: ValidationError[];

    /**
     * constructor
     *
     * @param message
     * @param validationErrors
     */
    constructor(message: string, validationErrors: ValidationError[]) {
        super(message);
        this.validationErrors = validationErrors;
        Object.setPrototypeOf(this, ValidationErrsResponse.prototype);
    }

    /**
     * details contains array of validation errors.
     */
    details(): any {
        return this.validationErrors;
    }

    /**
     * getMessage is string representation of validation errors.
     */
    getMessage(): string {
        return this.validationErrors.reduce((accumulated: string[], current: ValidationError) => {
            accumulated.push(current.toString());
            return accumulated;
        }, []).join(" , ")
    }

    /**
     * getStatus is status code of response error.
     */
    getStatus(): number {
        return httpStatus.BAD_REQUEST;
    }
}
