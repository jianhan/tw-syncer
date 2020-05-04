import {from} from "rxjs";
import Twitter = require("twitter");

/**
 * fetchTrends returns a observable from fetching trending twitter API.
 *
 * @param tw
 */
export const fetchTrends = (tw: Twitter) => from(tw.get("trends/available", {}));
