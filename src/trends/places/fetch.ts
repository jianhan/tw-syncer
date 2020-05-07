import {WhereOnEarthLocation} from "./WhereOnEarthLocation";
import {EMPTY, from} from "rxjs";
import {catchError, mergeMap} from "rxjs/operators";
import {Logger} from "winston";
import Twitter = require("twitter");

/**
 * fetchTrendByLocation retrieves trend place by an given array of location.
 *
 * @param logger
 * @param tw
 */
export const fetchTrendByLocation = (logger: Logger, tw: Twitter) => (location: WhereOnEarthLocation) => {
    return from(tw.get("trends/place", {id: location.woeid})).pipe(
        catchError(err => {
            logger.error("error occur while fetchTrendByLocation", err);
            return EMPTY;
        })
    );
};

/**
 * fetchTrends fetch location trends by locations via twitter api.
 *
 * @param logger
 * @param tw
 */
export const fetchTrends = (logger: Logger, tw: Twitter) => (locations: WhereOnEarthLocation[]) => from(locations).pipe(
    mergeMap(fetchTrendByLocation(logger, tw)),
);
