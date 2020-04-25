import {of} from "rxjs";
import {Parameters, validateParameters} from "./Parameters"
import {catchError, flatMap, map} from "rxjs/operators";
import {envsMap} from "../../structures/envs";
import {fetch, fetchRequest, upload, uploadRequest, parseResponseBody} from "./s3";
import {cleanTweets, getLatestTimeline} from "./twitter";
import Twitter = require("twitter");
import {Logger} from "winston";

export const sync = (envs: envsMap, s3: AWS.S3, twitter: Twitter, logger: Logger, parameters: Parameters) => of(parameters).pipe(
    flatMap(validateParameters),
    map(fetchRequest(envs.get("NODE_ENV") as string, envs.get("SERVICE_NAME") as string, envs.get("S3_BUCKET_NAME") as string)),
    flatMap(fetch(s3)(logger)),
    flatMap(parseResponseBody),
    map(cleanTweets),
    flatMap(getLatestTimeline(twitter)(parameters)),
    map(uploadRequest(envs.get("NODE_ENV") as string, envs.get("SERVICE_NAME") as string, envs.get("S3_BUCKET_NAME") as string)(parameters)),
    flatMap(upload(s3)),
    catchError(err => of(err))
);
