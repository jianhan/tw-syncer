import Twitter from "twitter";
import {fromTweets} from "./Timeline";
import _ from "lodash";

describe("fromTweets function", () => {

    const generateTweets = (count: number): Twitter.ResponseData => [...Array(count).keys()].map(n => ({id: n + 1, name: "test" + (n + 1)}));

    it("should return sorted desc tweets with correct sinceId value", () => {
        const tweets = generateTweets(10);
        const timeline = fromTweets(tweets as []);
        expect(timeline.tweets).toEqual(_.orderBy(tweets, ['id'], ['desc']));
        expect(timeline.sinceId).toEqual(10)
    })
})
