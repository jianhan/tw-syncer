import {of} from "rxjs";
import _ from "lodash";
import {Parameters, validateParameters} from "./Parameters"
import {catchError, flatMap, map} from "rxjs/operators";
import {envsMap} from "../../structures/envs";
import {fetch, fetchRequest, generateTimelineWithSinceId, upload, uploadRequest} from "./s3";
import {getLatestTimeline} from "./twitter";
import Twitter = require("twitter");

export const sync = (envs: envsMap, parameters: Parameters, s3: AWS.S3, twitter: Twitter) => of(parameters).pipe(
    flatMap(validateParameters),
    map(_.curry(fetchRequest)(envs)),
    flatMap(_.curry(fetch)(s3)),
    flatMap(generateTimelineWithSinceId),
    flatMap(_.curry(getLatestTimeline)(twitter)(parameters)),
    map(_.curry(uploadRequest)(envs)(parameters)),
    flatMap(_.curry(upload)(s3)),
    catchError(err => of(err))
);
