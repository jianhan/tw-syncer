import { Envs } from "./Envs";
import * as faker from 'faker';
import { Environment } from "jianhan-fp-lib";
import { validate, validateSync } from "class-validator";
import jsc from "jsverify";
import _ from "lodash";

describe("test envs", () => {

    const emptyValues: any[] = [undefined, null, ""];

    const validateIsNotEmpty = (key: string) => {
        const envs = generateValidEnvs();
        emptyValues.map(v => {
            _.set(envs, key, v)
            const errors = validateSync(envs)
            expect(errors).toHaveLength(1);
            expect(errors[0].property).toEqual(key);
        });
    }

    const generateValidEnvs = (): Envs => {
        const envs = new Envs;
        envs.ACCESS_SECRET = faker.random.words(10)
        envs.ACCESS_TOKEN = faker.random.words(10)
        envs.CONSUMER_API_KEY = faker.random.words(10)
        envs.CONSUMER_API_SECRET_KEY = faker.random.words(10)
        envs.NODE_ENV = Environment.DEVELOPMENT
        envs.S3_ACCESS_KEY_ID = faker.random.words(10)
        envs.S3_BUCKET_NAME = faker.random.words(10)
        envs.S3_SECRET_ACCESS_KEY = faker.random.words(10)
        envs.SERVICE_NAME = faker.random.words(10)
        return envs;
    }


    it("should be valid when all envs are setup", done => {
        validate(generateValidEnvs()).then(errors => {
            expect(errors).toHaveLength(0);
            done();
        });
    })

    it("should be invalid when NODE_ENV is not a valid value", () => {
        const envs = generateValidEnvs();
        const assertions = jsc.forall("nestring", (s: string) => {
            envs.NODE_ENV = s;
            const errors = validateSync(envs)
            return errors.length === 1 && errors[0].property === 'NODE_ENV'
        });

        jsc.assert(assertions);
    })

    it("should be invalid when any of required variable is not set", () => {
        [
            'NODE_ENV',
            'SERVICE_NAME',
            'CONSUMER_API_KEY',
            'CONSUMER_API_SECRET_KEY',
            'ACCESS_TOKEN',
            'ACCESS_SECRET',
            'S3_ACCESS_KEY_ID',
            'S3_SECRET_ACCESS_KEY',
            'S3_SECRET_ACCESS_KEY',
            'S3_BUCKET_NAME',
        ].map(validateIsNotEmpty);
    })

});