import { sync } from "./sync";
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { from } from 'rxjs';

describe("test sync func", () => {
    const validJSON = (): string => `{
        "screen_name": ["test1", "test1", "test2"],
        "user_id": [1, 2, 3],
        "include_entities": true,
        "tweet_mode": false
    }`;
    it("test", () => {
        // RxJS v6+

        //emit error
        const source = throwError('This is an error!');
        //gracefully handle error, returning observable with error message
        const example = source.pipe(catchError(val => of(`I caught: ${val}`)));
        //output: 'I caught: This is an error'
        const subscribe = example.subscribe(val => console.log(val));

        const observable = from([1, 2, 3]);
        observable.subscribe({
            next: x => console.log('got value ' + x),
            error: err => console.error('something wrong occurred: ' + err),
            complete: () => console.log('done'),
        });
        console.log(subscribe.closed)
    })
});