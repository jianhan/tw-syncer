import {WhereOnEarthLocation} from "./WhereOnEarthLocation";
import {EMPTY, from} from "rxjs";
import {catchError, mergeMap} from "rxjs/operators";
import {Logger} from "winston";
import Twitter = require("twitter");

export const fetchTrendByLocation = (logger: Logger, tw: Twitter) => (location: WhereOnEarthLocation) => {
    return from(tw.get("trends/place", {id: location.weoid})).pipe(
        catchError(err => {
            logger.error("error occur while fetchTrendByLocation", err);
            return EMPTY;
        })
    );
};

export const fetchTrends = (logger: Logger, tw: Twitter) => (locations: WhereOnEarthLocation[]) => from(locations).pipe(
    mergeMap(fetchTrendByLocation(logger, tw)),
);
