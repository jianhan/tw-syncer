import S3 from "aws-sdk/clients/s3";
import {dateToPath, fileKey} from "../../operations";
import * as path from "path";
import moment = require("moment");
import Twitter = require("twitter");

// tslint:disable-next-line: no-var-requires
const sprintf = require("sprintf");

// tslint:disable-next-line:max-line-length
export const uploadPlaceRequest = (nodeEnv: string, serviceName: string, bucket: string, date: moment.Moment) => (places: Twitter.ResponseData): S3.Types.PutObjectRequest => {

    if (places.length === 0) {
        throw new Error("empty placeObjects");
    }

    return {
        Bucket: bucket,
        Key: fileKey(
            nodeEnv,
            serviceName,
            path.join('trends', 'place', dateToPath(date)),
            sprintf("%s_%s.json", places[0].locations[0].name, places[0].locations[0].woeid)
        ),
        Body: JSON.stringify(places[0].trends)
    }
};
