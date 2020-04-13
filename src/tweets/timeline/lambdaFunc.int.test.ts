import S from "sanctuary";
import {toParameters, validateParameters} from "./Parameters";
import {Environment, getEnvs} from "jianhan-fp-lib";
import {Envs} from "../../Envs";
import {extractRespContents, getClient, getFiles, getFilesReq} from "./s3";
import * as immutable from "immutable";

let s3Client: AWS.S3;
let envs: immutable.Map<string, string | Environment | undefined>;

beforeEach(async () => {
    envs = await getEnvs(process.env, Envs);
    s3Client = getClient(envs.get('S3_ACCESS_KEY_ID') as string, envs.get('S3_SECRET_ACCESS_KEY') as string);
});

describe("index", () => {
    it("should run without errors", () => {
        // const c = S.compose(validateParameters)(toParameters)
        // console.log(c({screen_name: 'test'}))

        const c = S.compose(S.curry2(getFiles)(s3Client))(getFilesReq)
        console.log(c(envs))
    })
});
