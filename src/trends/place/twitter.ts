import {Parameters} from "../../tweets/timeline/Parameters";
import {from} from "rxjs";
import Twitter = require("twitter");

/**
 * getTrendsForPlace retrieves trends place via twitter client.
 *
 * @param client
 */
export const getTrendsForPlace = (client: Twitter) => (params: Parameters) => from(client.get("trends/place", params));