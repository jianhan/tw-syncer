import { IsIn, IsNotEmpty, IsString } from "class-validator";

// @ts-ignore
import { enumValues, Environment } from "jianhan-fp-lib";

/**
 * Environment variables.
 */
export class Envs {

    /**
     * NODE_ENV is node js development env variable. 
     *
     * @type {string}
     * @memberof Envs
     */
    @IsIn(enumValues(Environment), { message: `NODE_ENV environment variable must be in ${enumValues(Environment)}` })
    @IsNotEmpty({ message: `NODE_ENV environment variable must not be empty` })
    public NODE_ENV?: string;

    /**
     * SERVICE_NAME is current service name.
     *
     * @type {string}
     * @memberof Envs
     */
    @IsNotEmpty({ message: `SERVICE_NAME environment variable must not be empty` })
    @IsString({ message: `SERVICE_NAME environment variable be string` })
    public SERVICE_NAME?: string;

    /**
     * CONSUMER_API_KEY is twitter consumer api key.
     *
     * @type {string}
     * @memberof Envs
     */
    @IsNotEmpty({ message: `CONSUMER_API_KEY environment variable must not be empty` })
    @IsString({ message: `CONSUMER_API_KEY environment variable be string` })
    public CONSUMER_API_KEY?: string;

    /**
     * CONSUMER_API_SECRET_KEY is twitter consumer api key secret.
     *
     * @type {string}
     * @memberof Envs
     */
    @IsNotEmpty({ message: `CONSUMER_API_SECRET_KEY environment variable must not be empty` })
    @IsString({ message: `CONSUMER_API_SECRET_KEY environment variable be string` })
    public CONSUMER_API_SECRET_KEY?: string;

    /**
     * ACCESS_TOKEN is twitter api access token.
     *
     * @type {string}
     * @memberof Envs
     */
    @IsNotEmpty({ message: `ACCESS_TOKEN environment variable must not be empty` })
    @IsString({ message: `ACCESS_TOKEN environment variable be string` })
    public ACCESS_TOKEN?: string;

    /**
     * ACCESS_SECRET is twitter access key secret.
     *
     * @type {string}
     * @memberof Envs
     */
    @IsNotEmpty({ message: `ACCESS_SECRET environment variable must not be empty` })
    @IsString({ message: `ACCESS_SECRET environment variable be string` })
    public ACCESS_SECRET?: string;

    /**
     * S3_ACCESS_KEY_ID is aws s3 access key id.
     *
     * @type {string}
     * @memberof Envs
     */
    @IsNotEmpty({ message: `S3_ACCESS_KEY_ID environment variable must not be empty` })
    @IsString({ message: `S3_ACCESS_KEY_ID environment variable be string` })
    public S3_ACCESS_KEY_ID?: string;

    /**
     * S3_SECRET_ACCESS_KEY is aws s3 secret access key.
     *
     * @type {string}
     * @memberof Envs
     */
    @IsNotEmpty({ message: `S3_SECRET_ACCESS_KEY environment variable must not be empty` })
    @IsString({ message: `S3_SECRET_ACCESS_KEY environment variable be string` })
    public S3_SECRET_ACCESS_KEY?: string;

    /**
     * S3_BUCKET_NAME is s3 bucket name.
     *
     * @type {string}
     * @memberof Envs
     */
    @IsNotEmpty({ message: `S3_BUCKET_NAME environment variable must not be empty` })
    @IsString({ message: `S3_BUCKET_NAME environment variable be string` })
    public S3_BUCKET_NAME?: string;

}
