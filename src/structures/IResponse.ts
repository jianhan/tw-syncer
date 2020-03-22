/**
 * IResponse defines simple lambda response object.
 */
export interface IResponse {

    /**
     * getStatus returns status code.
     */
    getStatus(): number;

    /**
     * getMessage returns message.
     */
    getMessage(): string;

    /**
     * getDetails returns any details attached to response.
     */
    getDetails(): any;

}
