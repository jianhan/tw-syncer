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
describe("lambdaFunc", () => {

    it("should fetch place with trends and sync", async () => {
        const fn = lambdaFunc(envs, logger, {id: 1099805});
        const result = await fn();
        expect(result.getDetails()).toHaveProperty('ETag');
        expect(result.getDetails()).toHaveProperty('Location');
        expect(result.getDetails()).toHaveProperty('Key');
    })
});
