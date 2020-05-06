import * as immutable from "immutable";
import {Environment, LogLevel} from "jianhan-fp-lib";
import {Logger} from "winston";
import {toParameters} from "./Parameters";
import {bindNodeCallback, of} from "rxjs";
import {flatMap, map, tap} from "rxjs/operators";
import {log, validateAndThrow} from "../../operations";
import {getClientsFromEnvs} from "../../clients";
import fs from "fs";
import {filterLocationsByParameters, toWhereOnEarthLocations} from "./WhereOnEarthLocation";
import {fetchTrends} from "./fetch";

const trendsAvailableFilePath = './trends_available.json';

export const lambdaFunc = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, params: { [key: string]: any }) => {
    // return async (): Promise<LambdaResponse> => {
    return async ()=> {
        const parameters = toParameters(params);
        const logInfo = log(logger)(LogLevel.INFO);
        const {s3, tw} = getClientsFromEnvs(envs);
        return bindNodeCallback(fs.readFile)(trendsAvailableFilePath).pipe(
            tap(logInfo("trends/places/lambdaFunc: start")),
            map(toWhereOnEarthLocations),
            tap(logInfo("trends/places/lambdaFunc: toWhereOnEarthLocations")),
            map(filterLocationsByParameters(parameters)),
            flatMap(fetchTrends(logger, tw)),
            tap(logInfo("trends/places/lambdaFunc: after fetchTrends")),
        );
    }
};
