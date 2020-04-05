"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus = __importStar(require("http-status-codes"));
const LambdaResponse_1 = require("./LambdaResponse");
/**
 * ValidationErrsResponse is a thin wrapper for validation errors from class-validator package.
 * The reason is when doing composition, if any validation errors occur then it can be used
 * as return value directly, do not have to convert validation errors array into a response anymore.
 */
class ValidationErrsResponse extends LambdaResponse_1.LambdaResponse {
    /**
     * constructor
     *
     * @param message
     * @param details
     */
    constructor(message, details) {
        super(httpStatus.BAD_REQUEST, message, details);
        this.details = details;
    }
    /**
     * getMessage is string representation of validation errors.
     */
    getMessage() {
        return this.details.reduce((accumulated, current) => {
            accumulated.push(current.toString());
            return accumulated;
        }, []).join(" , ");
    }
}
exports.ValidationErrsResponse = ValidationErrsResponse;
