/**
 * SimpleResponse defines simple lambda response object.
 */
export interface SimpleResponse {

    /**
     * getStatus returns status code.
     */
    getStatus(): number;

    /**
     * getMessage returns message.
     */
    getMessage(): string;

    /**
     * details returns any details attached to response.
     */
    details(): any;
}

export type response = {statusCode: number, message: string, details?: any};
