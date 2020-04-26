import {Parameters} from "./Parameters";
import {from} from "rxjs";
import _ from "lodash";
import fp from "lodash/fp"
import Twitter = require("twitter");

/**
 * sortTweets sorts array of tweets by id.
 */
export const sortTweets = fp.orderBy(['id'])(['desc']);

/**
 * filterTweets filter any tweets do not have id attribute.
 */
export const filterTweets = fp.filter(fp.has('id'));

/**
 * uniqueTweets remove duplicate tweets from array by id.
 */
export const uniqueTweets = fp.uniqBy('id');

/**
 * cleanTweets pipe filter , sort and unique.
 */
export const cleanTweets = fp.pipe([filterTweets, sortTweets, uniqueTweets]);

/**
 * latestTweetId find the latest tweet id from array.
 */
export const latestTweetId = fp.pipe([
    sortTweets,
    fp.head,
    fp.prop('id')
]);

/**
 * getLatestTimeline retrieves the latest tweets by an user.
 *
 * @param client
 */
export const getLatestTimeline = (client: Twitter) => (params: Parameters) => (currentTweets: any[]) => {
    const sinceId = currentTweets.length === 0 ? 1 : latestTweetId(currentTweets);
    return from(client.get("statuses/user_timeline", Object.assign(params, {since_id: sinceId})).then(responseTweets => {
        return !_.isArray(responseTweets) || _.size(responseTweets) === 0 ? sortTweets(currentTweets) : mergeTimeline(responseTweets)(currentTweets);
    }))
};

/**
 * parseIdString parse string of id to array from twitter response data.
 *
 * @param response
 */
const parseIdString = (response: Twitter.ResponseData): Twitter.ResponseData => _.map(response, (r => {
    if (_.get(r, 'id', false)) {
        return r;
    }

    r.id = parseInt(r.id, 10);
    return r;
}));

/**
 * mergeTimeline merges newly retrieved data from twitter into existing timeline, and sort them.
 *
 * @param response
 */
export const mergeTimeline = (response: Twitter.ResponseData) => fp.pipe([
    mergeResponses(response),
    filterTweets,
    uniqueTweets,
    parseIdString,
    sortTweets,
]);

/**
 * mergeResponses merges two responseData.
 *
 * @param first
 */
export const mergeResponses = (first: Twitter.ResponseData) => (second: Twitter.ResponseData) => _.concat(first, second);
