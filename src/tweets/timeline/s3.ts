import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import {LambdaResponse} from "../../structures/LambdaResponse";
import S from "sanctuary";
import * as httpStatus from "http-status-codes";
import _ from "lodash";
import {from, Observable} from "rxjs";
import path from "path";
import * as immutable from "immutable";
import {Environment} from "jianhan-fp-lib";
import {map, catchError, defaultIfEmpty, filter} from "rxjs/operators";

import { of } from 'rxjs';
// tslint:disable-next-line: no-var-requires
const sprintf = require("sprintf");

export const getClient = (accessKeyId: string, secretAccessKey: string) => new AWS.S3({accessKeyId, secretAccessKey});

export const sortObjects = (objects: S3.Types.ObjectList): S3.Types.ObjectList => objects.sort((a: S3.Types.Object, b: S3.Types.Object) => (a.LastModified as Date) <= (b.LastModified as Date) ? 1 : -1);

export const getFiles = (s3: AWS.S3, params: S3.Types.ListObjectsRequest)=> from(s3.listObjects(params).promise()).pipe(
    map((response: S3.Types.ListObjectsOutput) => {
        if (_.isNull(response.Contents) || _.isUndefined(response.Contents)) {
            throw new Error("invalid response from s3, empty 'Contents'")
        }

        return response.Contents;
    }),
    filter((contents: S3.Types.ObjectList) => contents.length > 0),
    map((contents: S3.Types.ObjectList) => {
        return contents;
    }),
    map(sortObjects),
    map((contents: S3.Types.ObjectList) => contents[0]),
    map((object: S3.Types.Object) => {
        return object.Key;
    }),
    defaultIfEmpty(0),
    catchError(err => of(err))
);

export const getFilesReq = (envs: immutable.Map<string, string | Environment | undefined>): S3.Types.ListObjectsRequest => ({
    Bucket: envs.get('S3_BUCKET_NAME') as string,
    Prefix: path.join(envs.get('NODE_ENV') as string, envs.get('SERVICE_NAME') as string)
});

// export const getObjRequest = (bucketName: string, obj: S3.Types.Object): S3.Types.GetObjectRequest => ({Bucket: bucketName, Key: obj.Key as string});
//
// export const getObj = (s3: AWS.S3, params: S3.Types.GetObjectRequest): TE.TaskEither<LambdaResponse, S3.Types.GetObjectOutput> => {
//     return TE.tryCatch(
//         () => s3.getObject(params).promise(),
//         reason => new LambdaResponse(httpStatus.INTERNAL_SERVER_ERROR, String(reason), reason)
//     );
// };
//
// export const extractRespContents = (response: S3.Types.ListObjectsOutput): TE.TaskEither<LambdaResponse, S3.Types.ObjectList> => pipe(
//     OP.fromNullable(response.Contents),
//     OP.fold(
//         () => TE.left(new LambdaResponse(httpStatus.INTERNAL_SERVER_ERROR, "Contents is null from S3 response")),
//         l => TE.right(l)
//     )
// );
//
// export const checkObjectListEmpty = (objects: S3.Types.ObjectList): OP.Option<S3.Types.ObjectList> => objects.length === 0 ? OP.none : OP.some(objects)
//
// // export const checkEmpty = (objects: S3.Types.ObjectList) =>
// export const setReqPrefix = (filePath: string, params: S3.Types.ListObjectsRequest): S3.Types.ListObjectsRequest => {
//     return Object.assign(params, {Prefix: filePath})
// };
//
// export const timelineFileName = (screenName: string, sinceId: number = 1): string => sprintf("%s_%d_timeline.json", screenName, sinceId);
//
// // tslint:disable-next-line:max-line-length
// export const filterObjects = (regex: RegExp, objects: S3.Types.ObjectList): S3.Types.ObjectList => objects.filter((object: S3.Types.Object) => regex.test(object.Key as string));
//

//
//
//

