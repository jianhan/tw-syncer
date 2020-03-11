import S from "sanctuary"
import fp from "lodash/fp"
import { from, Observable } from 'rxjs';

describe("test sync func", () => {
    const validJSON = (): string => `{
        "screen_name": ["test1", "test1", "test2"],
        "user_id": [1, 2, 3],
        "include_entities": true,
        "tweet_mode": false
    }`;

    const fetch = () => {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve("Success!")
            }, 250)
        }).then(x => x)
    }

    it("test2", async () => {
        // const r = from(fetch()).subscribe(
        //     x => x,
        //     err => err,
        //     () => console.log('complete')
        // );

        const r = await from(fetch()).toPromise();
        console.log(r)
    });

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

        const l = S.Left("left");

        const r = S.Right("right");
        console.log(S.fromEither(1)(l))
    })
});