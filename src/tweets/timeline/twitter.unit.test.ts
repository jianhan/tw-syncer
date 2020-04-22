import {getLatestTimeline, mergeTimeline, sortTweets} from "./twitter";
import jsc from "jsverify";
import _ from "lodash";
import Twitter from "twitter";
import {Parameters} from "./Parameters";
import {fromTweets} from "./Timeline";

const generateTweets = (count: number): Twitter.ResponseData => [...Array(count).keys()].map(n => ({id: n + 1, name: "test" + (n + 1)}));

const twitterClient: jest.Mocked<Twitter> = new Twitter({
    access_token_key: 'test',
    access_token_secret: 'test',
    consumer_key: 'test',
    consumer_secret: 'test'
}) as any;

describe("mergeTimeline function", () => {

    it("should merge timeline arrays", () => {
        const numArr2ObjArr = (numArr1: number[]): { [key: number]: any } => numArr1.map((num: number) => ({id: num, name: "test" + num}));
        jsc.assert(
            jsc.forall(
                "array nat", "array nat",
                ((numArr1: number[], numArr2: number[]) => {
                    const merged = mergeTimeline(numArr2ObjArr(numArr1))(numArr2ObjArr(numArr2));
                    const mergedIds = merged.map((t: any) => t.id);
                    return _.difference(mergedIds, _.uniq(_.concat(numArr1, numArr2))).length === 0
                })
            )
        );
    });

    it("should ignore object without id property and sort", () => {
        const arr1 = [{id: 11, name: "test11"}, {id: 12, name: "test12"}, {id: 1, name: "test1"}];
        const arr2 = [{name: "test", age: 12}, {id: 1, name: "test1"}];
        expect(mergeTimeline(arr1)(arr2)).toEqual([{id: 12, name: "test12"}, {id: 11, name: "test11"}, {id: 1, name: "test1"}])
    })

});

describe("getLatestTimeline function", () => {

    it("should return merged and sorted tweets", async () => {
        const twitterResponseData: Twitter.ResponseData = generateTweets(10);
        const existingTwitterTimeline = fromTweets(generateTweets(20) as []);
        jest.spyOn(twitterClient, "get").mockImplementation(() => Promise.resolve(twitterResponseData));
        const result = await getLatestTimeline(twitterClient, new Parameters(), existingTwitterTimeline).toPromise();
        expect(result).toEqual(sortTweets(existingTwitterTimeline.tweets))
    });

    it("should return sorted tweets when response is empty", async () => {
        const existingTwitterTimeline = fromTweets(generateTweets(20) as []);
        jest.spyOn(twitterClient, "get").mockImplementation(() => Promise.resolve([]));
        const result = await getLatestTimeline(twitterClient, new Parameters(), existingTwitterTimeline).toPromise();
        expect(result).toEqual(_.orderBy(existingTwitterTimeline.tweets, ['id'], ['desc']))
    })
});
