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
/**
 * Parameters represents twitter api parameters when fetching users, it will be used
 * for validations to ensure input parameters all valid before API call.
 *
 * @export
 * @class Parameters
 */
class Parameters {
    constructor() {
        /**
         * screen_name is screen_name parameter.
         *
         * @type string[]
         * @memberof Parameters
         */
        this.screen_name = [];
        /**
         * user_id is user_id parameter.
         *
         * @type number[]
         * @memberof Parameters
         */
        this.user_id = [];
        /**
         * include_entities is include_entities parameter.
         *
         * @type boolean
         * @memberof Parameters
         */
        this.include_entities = false;
        /**
         * tweet_mode is tweet_mode parameter
         *
         * @type boolean
         * @memberof Parameters
         */
        this.tweet_mode = false;
    }
}
__decorate([
    class_validator_1.IsArray(),
    class_validator_1.ArrayMaxSize(100),
    class_validator_1.ArrayMinSize(1),
    class_validator_1.ArrayUnique(),
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], Parameters.prototype, "screen_name", void 0);
__decorate([
    class_validator_1.IsArray(),
    class_validator_1.ArrayMaxSize(100),
    class_validator_1.ArrayUnique(),
    class_validator_1.IsNumber({}, { each: true }),
    __metadata("design:type", Array)
], Parameters.prototype, "user_id", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], Parameters.prototype, "include_entities", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], Parameters.prototype, "tweet_mode", void 0);
exports.default = Parameters;
