import {of} from "rxjs";
import fp from "lodash/fp";
import {Parameters, validateParameters} from "./Parameters"
import {catchError, flatMap, map} from "rxjs/operators";
import {envsMap} from "../../structures/envs";
import {fetch, fetchRequest, generateTimelineWithSinceId, upload, uploadRequest} from "./s3";
import {getLatestTimeline} from "./twitter";
import Twitter = require("twitter");
import {Logger} from "winston";

export const sync = (envs: envsMap, parameters: Parameters, s3: AWS.S3, twitter: Twitter, logger: Logger) => of(parameters).pipe(
    flatMap(validateParameters),
    map(fp.curry(fetchRequest)(envs)),
    flatMap(fp.curry(fetch)(s3)(logger)),
    flatMap(generateTimelineWithSinceId),
    flatMap(fp.curry(getLatestTimeline)(twitter)(parameters)),
    map(fp.curry(uploadRequest)(envs)(parameters)),
    flatMap(fp.curry(upload)(s3)),
    catchError(err => of(err))
);
