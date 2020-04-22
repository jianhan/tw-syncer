import {Timeline} from "./Timeline";
import {Parameters} from "./Parameters";
import {from} from "rxjs";
import _ from "lodash";
import fp from "lodash/fp"
import Twitter = require("twitter");

export const sortTweets = fp.orderBy(['id'])(['desc']);

export const filterTweets = fp.filter(fp.has('id'));

export const uniqueTweets = fp.uniqBy('id');

export const getLatestTimeline = (client: Twitter) => (params: Parameters) => (timeline: Timeline) => {
    return from(client.get("statuses/user_timeline", Object.assign(params, {since_id: timeline.sinceId})).then(response => {
        if (!_.isArray(response) || _.size(response) === 0) {
            return _.orderBy(timeline.tweets, ['id'], ['desc']);
        }

        return mergeTimeline(response)(timeline.tweets);
    }))
};

const parseIdString = (response: Twitter.ResponseData): Twitter.ResponseData => _.map(response, (r => {
    if (_.get(r, 'id', false)) {
        return r;
    }

    r.id = parseInt(r.id, 10);
    return r;
}));

export const mergeTimeline = (response: Twitter.ResponseData) => fp.pipe([
    mergeTweets(response),
    filterTweets,
    uniqueTweets,
    parseIdString,
    sortTweets,
]);

export const mergeTweets = (first: Twitter.ResponseData) => (second: Twitter.ResponseData) => _.concat(first, second);
