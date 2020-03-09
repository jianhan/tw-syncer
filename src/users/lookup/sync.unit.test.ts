import { sync } from "./sync";

describe("test sync func", () => {
    const validJSON = (): string => `{
        "screen_name": ["test1", "test1", "test2"],
        "user_id": [1, 2, 3],
        "include_entities": true,
        "tweet_mode": false
    }`;
    it("test", () => {
        console.log(sync(validJSON()));
    })
});