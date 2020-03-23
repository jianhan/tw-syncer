import {ValidationError} from "class-validator";
import * as httpStatus from "http-status-codes";
import {LambdaResponse} from "./LambdaResponse";

/**
 * ValidationErrsResponse is a thin wrapper for validation errors from class-validator package.
 * The reason is when doing composition, if any validation errors occur then it can be used
 * as return value directly, do not have to convert validation errors array into a response anymore.
 */
export class ValidationErrsResponse extends LambdaResponse {

    /**
     * validationErrors contains array of validation errors.
     */
    protected readonly details: ValidationError[];

    /**
     * constructor
     *
     * @param message
     * @param details
     */
    constructor(message: string, details: ValidationError[]) {
        super(httpStatus.BAD_REQUEST,message, details);
        this.details = details;
        Object.setPrototypeOf(this, LambdaResponse.prototype);
    }

    /**
     * getMessage is string representation of validation errors.
     */
    getMessage(): string {
        return this.details.reduce((accumulated: string[], current: ValidationError) => {
            accumulated.push(current.toString());
            return accumulated;
        }, []).join(" , ")
    }

}
