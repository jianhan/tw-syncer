export class LambdaResponse {

    protected readonly status: number;

    protected readonly details: any;

    protected readonly message: string;

    constructor(status: number, message: string, details?: any) {
        this.status = status;
        this.message = message;
        this.details = details;
    }

    getStatus(): number {
        return this.status;
    }

    getDetails(): any {
        return this.details;
    }

    getMessage(): string {
        return this.message;
    }
}
