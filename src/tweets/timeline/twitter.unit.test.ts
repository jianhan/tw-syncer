import {mergeTimeline} from "./twitter";
import jsc from "jsverify";
import _ from "lodash";
describe("mergeTimeline function", () => {
    it("should merge timeline arrays", () => {
        const numArr2ObjArr = (numArr1: number[]): {[key: number]: any} => numArr1.map((num: number) => ({id: num, name: "test" + num}));
        jsc.assert(
            jsc.forall(
                "array nat", "array nat",
                ((numArr1: number[], numArr2: number[]) => {
                    const merged = mergeTimeline(numArr2ObjArr(numArr1))(numArr2ObjArr(numArr2));
                    const mergedIds = merged.tweets.map((t:any) => t.id);
                    return _.difference(mergedIds, _.uniq(_.concat(numArr1, numArr2))).length === 0
                })
            )
        );
    })
});
