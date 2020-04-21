import fp from "lodash/fp";
import _ from "lodash";

export class Timeline {
    tweets: any[] = [];
    sinceId: number = 1;

    private constructor({tweets = [], sinceId = 1} = {}) {
        this.tweets = tweets;
        this.sinceId = sinceId;
    }

    static of({tweets = [], sinceId = 1} = {}): Timeline {
        return new Timeline({tweets: _.orderBy(tweets, ['id'], ['desc']), sinceId})
    }
}

export const fromTweets = (tweets = []): Timeline => Timeline.of({tweets, sinceId: latestTweetId(tweets)});

export const latestTweetId = fp.pipe([
    fp.curryRight(fp.orderBy)(['id'])(['desc']),
    fp.head,
    fp.curry(fp.prop)('id')
]);
