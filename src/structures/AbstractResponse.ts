import {IResponse} from "./IResponse";

export abstract class AbstractResponse implements IResponse {

    protected readonly status: number;

    protected message: string;

    protected constructor(message: string, status: number) {
        this.status = status;
        this.message = message;
    }

    getStatus(): number {
        return this.status;
    }

    getMessage(): string {
        return this.message;
    }

    abstract getDetails(): any;
}
