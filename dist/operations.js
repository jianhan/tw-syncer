"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LambdaResponse_1 = require("./structures/LambdaResponse");
exports.findLambdaFunc = (cases, defaultCase, key) => {
    if (cases.hasOwnProperty(key)) {
        return cases[key];
    }
    else {
        return defaultCase;
    }
};
exports.newResponseFunc = (status, message, details) => new LambdaResponse_1.LambdaResponse(status, message, details);
