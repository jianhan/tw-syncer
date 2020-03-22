import * as httpStatus from "http-status-codes";
import {IResponse} from "./IResponse";
import {AbstractErrResponse} from "./AbstractErrResponse";

/**
 * ErrResponse is a response wrapper for any error that might occur, so that it can
 * be returned directly, no more conversion/transformations needed after composition.
 */
export class ErrResponse extends AbstractErrResponse implements IResponse {

    /**
     * inputVal is any input value that might cause current error to occur.
     */
    private readonly inputVal: any;

    /**
     *  constructor
     *
     * @param message
     * @param status
     * @param inputVal
     */
    constructor(message: string, status: number = httpStatus.BAD_REQUEST, inputVal?: any) {
        super(message, status);
        this.inputVal = inputVal;
        Object.setPrototypeOf(this, ErrResponse.prototype);
    }

    /**
     * getDetails contains information related to error.
     */
    getDetails(): any {
        return {
            inputVal: this.inputVal,
            statusCode: this.status,
            message: this.message
        }
    }
}
