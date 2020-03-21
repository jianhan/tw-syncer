import {ValidationError} from "class-validator";
import * as httpStatus from "http-status-codes";

export interface SimpleResponse {

    getStatus(): number;

    getMessage(): string;

    details(): any;
}

export class ErrResponse extends Error implements SimpleResponse {

    private readonly statusCode: number;

    private readonly inputVal: any;

    constructor(message: string, statusCode: number = httpStatus.BAD_REQUEST, inputVal: any) {
        super(message);
        this.statusCode = statusCode;
        this.inputVal = inputVal;
        Object.setPrototypeOf(this, ErrResponse.prototype);
    }

    details(): any {
        return {
            inputVal: this.inputVal,
            statusCode: this.statusCode,
            message: this.message
        }
    }

    getMessage(): string {
        return this.message;
    }

    getStatus(): number {
        return this.statusCode;
    }
}

export class ValidationErrsResponse extends Error implements SimpleResponse {

    private readonly validationErrors: ValidationError[];

    constructor(message: string, validationErrors: ValidationError[]) {
        super(message);
        this.validationErrors = validationErrors;
        Object.setPrototypeOf(this, ValidationErrsResponse.prototype);
    }

    details(): any {
        return this.validationErrors;
    }

    getMessage(): string {
        return this.validationErrors.reduce((accumulated: string[], current: ValidationError) => {
            accumulated.push(current.toString());
            return accumulated;
        }, []).join(" , ")
    }

    getStatus(): number {
        return httpStatus.BAD_REQUEST;
    }
}
