"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
// @ts-ignore
const jianhan_fp_lib_1 = require("jianhan-fp-lib");
/**
 * Environment variables.
 */
class Envs {
}
__decorate([
    class_validator_1.IsIn(jianhan_fp_lib_1.enumValues(jianhan_fp_lib_1.Environment), { message: `NODE_ENV environment variable must be in ${jianhan_fp_lib_1.enumValues(jianhan_fp_lib_1.Environment)}` }),
    class_validator_1.IsNotEmpty({ message: `NODE_ENV environment variable must not be empty` }),
    __metadata("design:type", String)
], Envs.prototype, "NODE_ENV", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: `SERVICE_NAME environment variable must not be empty` }),
    __metadata("design:type", String)
], Envs.prototype, "SERVICE_NAME", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: `CONSUMER_API_KEY environment variable must not be empty` }),
    __metadata("design:type", String)
], Envs.prototype, "CONSUMER_API_KEY", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: `CONSUMER_API_SECRET_KEY environment variable must not be empty` }),
    __metadata("design:type", String)
], Envs.prototype, "CONSUMER_API_SECRET_KEY", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: `ACCESS_TOKEN environment variable must not be empty` }),
    __metadata("design:type", String)
], Envs.prototype, "ACCESS_TOKEN", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: `ACCESS_SECRET environment variable must not be empty` }),
    __metadata("design:type", String)
], Envs.prototype, "ACCESS_SECRET", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: `S3_ACCESS_KEY_ID environment variable must not be empty` }),
    __metadata("design:type", String)
], Envs.prototype, "S3_ACCESS_KEY_ID", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: `S3_SECRET_ACCESS_KEY environment variable must not be empty` }),
    __metadata("design:type", String)
], Envs.prototype, "S3_SECRET_ACCESS_KEY", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: `S3_BUCKET_NAME environment variable must not be empty` }),
    __metadata("design:type", String)
], Envs.prototype, "S3_BUCKET_NAME", void 0);
exports.Envs = Envs;
