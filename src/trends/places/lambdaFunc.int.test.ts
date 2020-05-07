import {envsMap} from "../../structures/envs";
import {default as winston, Logger} from "winston";
import {getEnvs} from "jianhan-fp-lib";
import {Envs} from "../../Envs";
import {lambdaFunc} from "./lambdaFunc";

jest.setTimeout(10000);

let envs: envsMap;

const logger: Logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

beforeEach(async () => {
    envs = await getEnvs(process.env, Envs);
});

describe("lambdaFunc", async () => {

    it("should fetch place trends and upload to s3", async () => {
        await lambdaFunc(envs, logger,{countryCodes: ["AU"]})();
    });

});
