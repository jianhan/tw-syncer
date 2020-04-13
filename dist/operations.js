"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LambdaResponse_1 = require("./structures/LambdaResponse");
const fp_1 = __importDefault(require("lodash/fp"));
exports.findLambdaFunc = (cases, defaultCase, key) => {
    if (cases.hasOwnProperty(key)) {
        return cases[key];
    }
    else {
        return defaultCase;
    }
};
exports.newResponseFunc = (status, message, details) => new LambdaResponse_1.LambdaResponse(status, message, details);
exports.pojoToObj = (obj) => fp_1.default.curry(Object.assign)(obj);
