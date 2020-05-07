import * as immutable from "immutable";
import {Environment} from "jianhan-fp-lib";
import {Logger} from "winston";
import {toParameters} from "./Parameters";
import {bindNodeCallback, of} from "rxjs";
import {flatMap, map, toArray} from "rxjs/operators";
import {lambdaRes} from "../../operations";
import {getClientsFromEnvs} from "../../clients";
import fs from "fs";
import {filterLocationsByParameters, toWhereOnEarthLocations} from "./WhereOnEarthLocation";
import {fetchTrends} from "./fetch";
import {uploadPlaceRequest} from "./upload";
import moment from "moment";
import {upload} from "../../s3";
import * as httpStatus from "http-status-codes";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;
import {LambdaResponse} from "../../structures/LambdaResponse";

const trendsAvailableFilePath = './trends_available.json';

export const lambdaFunc = (envs: immutable.Map<string, string | Environment | undefined>, logger: Logger, params: { [key: string]: any }) => {
    return async (): Promise<LambdaResponse> => {
        const parameters = toParameters(params);
        const {s3, tw} = getClientsFromEnvs(envs);

        return bindNodeCallback(fs.readFile)(trendsAvailableFilePath).pipe(
            map(toWhereOnEarthLocations),
            map(filterLocationsByParameters(parameters)),
            flatMap(fetchTrends(logger, tw)),
            map(
                uploadPlaceRequest(
                    envs.get("NODE_ENV") as string,
                    envs.get("SERVICE_NAME") as string,
                    envs.get("S3_BUCKET_NAME") as string,
                    moment()
                )
            ),
            flatMap(upload(s3)),
            toArray(),
            flatMap((sendData: SendData[]) => of(lambdaRes(httpStatus.OK, "successful", sendData))),
        ).toPromise();
    }
};
