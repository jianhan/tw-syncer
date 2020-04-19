import fp from "lodash/fp";

export class Timeline {
    tweets: any[] = [];
    sinceId: number = 1;

    constructor({tweets = [], sinceId = 1} = {}) {
        this.tweets = tweets;
        this.sinceId = sinceId;
    }
}

export const fromTweets = (tweets = []): Timeline => (new Timeline({tweets, sinceId: latestTweetId(tweets)}));

export const latestTweetId = fp.pipe([
    fp.curryRight(fp.orderBy)(['desc'])('id'),
    fp.head,
    fp.curry(fp.prop)('id')
]);
