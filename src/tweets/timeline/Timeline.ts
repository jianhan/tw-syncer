import fp from "lodash/fp";
import {sortTweets} from "./twitter";

export class Timeline {
    tweets: any[] = [];
    sinceId: number = 1;

    private constructor({tweets = [], sinceId = 1} = {}) {
        this.tweets = tweets;
        this.sinceId = sinceId;
    }

    static of({tweets = [], sinceId = 1} = {}): Timeline {
        return new Timeline({tweets: sortTweets(tweets) as [], sinceId})
    }
}

export const fromTweets = (tweets = []): Timeline => Timeline.of({tweets, sinceId: latestTweetId(tweets)});

export const latestTweetId = fp.pipe([
    sortTweets,
    fp.head,
    fp.curry(fp.prop)('id')
]);
