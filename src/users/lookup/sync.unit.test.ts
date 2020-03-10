import S from "sanctuary"

describe("test sync func", () => {
    const validJSON = (): string => `{
        "screen_name": ["test1", "test1", "test2"],
        "user_id": [1, 2, 3],
        "include_entities": true,
        "tweet_mode": false
    }`;
    it("test", async () => {
        const isOne = (n: number) => {
            if (n === 1) {
                return S.Right(1);
            }

            return S.Left(new Error("number is not 1"));
        }

        const multi = (n: number) => {
            console.log("--->", n)
            return n * 2;
        }

        const cp = S.pipe([isOne, S.map(multi)]);

        console.log(cp(1))
    })
});