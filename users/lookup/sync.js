"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sanctuary_1 = __importDefault(require("sanctuary"));
const class_validator_1 = require("class-validator");
const lodash_1 = __importDefault(require("lodash"));
const Parameters_1 = __importDefault(require("./Parameters"));
const immutable = __importStar(require("immutable"));
const operations_1 = require("jianhan-fp-lib/dist/operations");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const fp_1 = __importDefault(require("lodash/fp"));
const httpStatus = __importStar(require("http-status-codes"));
const LambdaResponse_1 = require("../../structures/LambdaResponse");
/**
 * convertToParameters converts POJO to parameter.
 */
const convertToParameters = sanctuary_1.default.curry2(Object.assign)(new Parameters_1.default());
/**
 * validateParameters validates parameters, if it is invalid then return left monad contains errors,
 * otherwise return right with immutable map.
 *
 * @param parameters
 */
const validateParameters = (parameters) => {
    const errors = class_validator_1.validateSync(parameters);
    if (errors.length > 0) {
        return sanctuary_1.default.Left(new LambdaResponse_1.LambdaResponse(httpStatus.BAD_REQUEST, 'Invalid parameter(s)', errors));
    }
    return sanctuary_1.default.Right(immutable.fromJS(Object.assign({}, parameters)));
};
/**
 * sensitizeScreenName sensitize screen_name parameter by trimming, removing empty and removing duplicates
 * from the list.
 */
const sensitizeScreenName = sanctuary_1.default.pipe([operations_1.listTrim, operations_1.listRemoveEmpty, operations_1.listUnique]);
/**
 * filterNumber removes any number that is less or equals to 0.
 *
 * @param list
 */
const filterNumber = (list) => list.filterNot(x => x <= 0);
/**
 * sensitizeUserId sensitizes user_id parameter by removing duplicates and remove any number is
 * less or equals to 0.
 */
const sensitizeUserId = sanctuary_1.default.pipe([operations_1.listUnique, filterNumber]);
/**
 * sensitizeAndUpdate sensitizes elements in immutable map by key, and then update
 * the immutable map by returning a new one.
 */
const sensitizeAndUpdate = (key, sensitizer, map) => {
    if (map.has(key)) {
        return map.set(key, sensitizer(map.get(key)));
    }
    return map;
};
/**
 * toFetchParameters converts parameters to POJO as fetching parameter via twitter api.
 *
 * @param map
 */
const toFetchParameters = (map) => {
    return {
        screen_name: lodash_1.default.join(map.get('screen_name').toArray(), ","),
        user_id: lodash_1.default.join(map.get('user_id').toArray(), ","),
        include_entities: operations_1.bool2Str(map.get('include_entities')),
        tweet_mode: operations_1.bool2Str(map.get('tweet_mode')),
    };
};
/**
 * transformProperties performs transformation of immutable map, so that screen_name parameters can be converted
 * from array to comma separated string, likewise to user_id.
 */
const transformProperties = sanctuary_1.default.pipe([
    sanctuary_1.default.curry3(sensitizeAndUpdate)('screen_name')(sensitizeScreenName),
    sanctuary_1.default.curry3(sensitizeAndUpdate)('user_id')(sensitizeUserId),
]);
/**
 * fetch performs API call to lookup users and returns an observable.
 *
 * @param tw
 * @param params
 */
const fetch = (tw, params) => rxjs_1.from(tw.get("users/lookup", params));
/**
 * upload performs upload API call via AWS s3 sdk to upload fetched data to s3.
 *
 * @param putObjectRequest
 * @param s3
 * @param o
 */
const upload = (putObjectRequest, s3, o) => {
    return o.pipe(operators_1.flatMap(p => rxjs_1.from(s3.upload(Object.assign({}, putObjectRequest, { Body: JSON.stringify(p) })).promise())));
};
/**
 * sync is entry point for synchronizes users, it compose all the process in a functional way.
 *
 * @param logger
 * @param tw
 * @param putObjectRequest
 * @param s3
 */
exports.sync = (logger, tw, putObjectRequest, s3) => {
    return sanctuary_1.default.pipe([
        fp_1.default.tap(logger.info),
        convertToParameters,
        validateParameters,
        sanctuary_1.default.map(transformProperties),
        fp_1.default.tap(logger.info),
        sanctuary_1.default.map(toFetchParameters),
        sanctuary_1.default.map(sanctuary_1.default.curry2(fetch)(tw)),
        fp_1.default.tap(logger.info),
        sanctuary_1.default.map(sanctuary_1.default.curry3(upload)(putObjectRequest)(s3)),
    ]);
};
