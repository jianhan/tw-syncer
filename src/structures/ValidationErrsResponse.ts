import {ValidationError} from "class-validator";
import * as httpStatus from "http-status-codes";
import {AbstractErrResponse} from "./AbstractErrResponse";
import {IResponse} from "./IResponse";

/**
 * ValidationErrsResponse is a thin wrapper for validation errors from class-validator package.
 * The reason is when doing composition, if any validation errors occur then it can be used
 * as return value directly, do not have to convert validation errors array into a response anymore.
 */
export class ValidationErrsResponse extends AbstractErrResponse implements IResponse {

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
        super(message, httpStatus.BAD_REQUEST);
        this.validationErrors = validationErrors;
    }

    /**
     * details contains array of validation errors.
     */
    getDetails(): any {
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

}
