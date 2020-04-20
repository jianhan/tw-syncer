import {Timeline} from "./Timeline";
import {Parameters} from "./Parameters";
import {from} from "rxjs";
import _ from "lodash";
import fp from "lodash/fp"
import Twitter = require("twitter");

export const getLatestTimeline = (client: Twitter, params: Parameters, timeline: Timeline) => {
    return from(client.get("statuses/user_timeline", Object.assign(params, {since_id: timeline.sinceId})).then(response => {
        if (!_.isArray(response) || _.size(response) === 0) {
            return timeline.tweets;
        }
        return mergeTimeline(response)(timeline.tweets);
    }))
};

export const mergeTimeline = (response: Twitter.ResponseData) => fp.pipe([
    fp.curry(mergeTweets)(response),
    fp.curryRight(_.uniqBy)((t: any) => t.id)
]);

export const mergeTweets = (first: Twitter.ResponseData, second: Twitter.ResponseData) => _.concat(first, second);
