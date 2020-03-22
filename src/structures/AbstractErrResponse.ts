import {IResponse} from "./IResponse";

export abstract class AbstractErrResponse extends Error implements IResponse {

    protected readonly status: number;

    protected constructor(message: string, status: number) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, AbstractErrResponse.prototype);
    }

    getMessage(): string {
        return this.message;
    }

    getStatus(): number {
        return this.status;
    }

    abstract getDetails(): any;
}
