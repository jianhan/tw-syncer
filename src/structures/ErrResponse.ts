import * as httpStatus from "http-status-codes";
import {SimpleResponse} from "./SimpleResponses";

/**
 * ErrResponse is a response wrapper for any error that might occur, so that it can
 * be returned directly, no more conversion/transformations needed after composition.
 */
export class ErrResponse extends Error implements SimpleResponse {

    /**
     * statusCode is status code for response.
     */
    private readonly statusCode: number;

    /**
     * inputVal is any input value that might cause current error to occur.
     */
    private readonly inputVal: any;

    /**
     *  constructor
     *
     * @param message
     * @param statusCode
     * @param inputVal
     */
    constructor(message: string, statusCode: number = httpStatus.BAD_REQUEST, inputVal?: any) {
        super(message);
        this.statusCode = statusCode;
        this.inputVal = inputVal;
        Object.setPrototypeOf(this, ErrResponse.prototype);
    }

    /**
     * details contains information related to error.
     */
    details(): any {
        return {
            inputVal: this.inputVal,
            statusCode: this.statusCode,
            message: this.message
        }
    }

    /**
     * getMessage returns string representation of response error.
     */
    getMessage(): string {
        return this.message;
    }

    /**
     * getStatus is status code of response error.
     */
    getStatus(): number {
        return this.statusCode;
    }
}
