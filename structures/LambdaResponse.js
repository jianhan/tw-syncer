"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * LambdaResponse defines a structure for lambda response.
 */
class LambdaResponse {
    constructor(status, message, details) {
        this.status = status;
        this.message = message;
        this.details = details;
    }
    getStatus() {
        return this.status;
    }
    getDetails() {
        return this.details;
    }
    getMessage() {
        return this.message;
    }
}
exports.LambdaResponse = LambdaResponse;
