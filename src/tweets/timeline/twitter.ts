import {Parameters} from "./Parameters";
import {from} from "rxjs";
import _ from "lodash";
import fp from "lodash/fp"
import Twitter = require("twitter");

export const sortTweets = fp.orderBy(['id'])(['desc']);

export const filterTweets = fp.filter(fp.has('id'));

export const uniqueTweets = fp.uniqBy('id');

export const cleanTweets = fp.pipe([filterTweets, sortTweets, uniqueTweets]);

export const latestTweetId = fp.pipe([
    sortTweets,
    fp.head,
    fp.prop('id')
]);

export const getLatestTimeline = (client: Twitter) => (params: Parameters) => (currentTweets: any[]) => {
    const sinceId = currentTweets.length === 0 ? 1 : latestTweetId(currentTweets);
    return from(client.get("statuses/user_timeline", Object.assign(params, {since_id: sinceId})).then(responseTweets => {
        return !_.isArray(responseTweets) || _.size(responseTweets) === 0 ? sortTweets(currentTweets): mergeTimeline(responseTweets)(currentTweets);
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
    mergeResponses(response),
    filterTweets,
    uniqueTweets,
    parseIdString,
    sortTweets,
]);

export const mergeResponses = (first: Twitter.ResponseData) => (second: Twitter.ResponseData) => _.concat(first, second);
