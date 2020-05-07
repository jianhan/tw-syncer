import {IsISO31661Alpha2} from "class-validator";

/**
 * Parameters represents parameters which will be passed for
 * lambda invocation.
 */
export class Parameters {

    /**
     * countryCodes defines a list of countries for trends to be
     * fetched.
     */
    @IsISO31661Alpha2({
        each: true
    })
    countryCodes: string[] = [];

}

/**
 * take an key value pair and construct parameter out of it.
 *
 * @param body
 */
export const toParameters = (body: { [key: string]: any }): Parameters => Object.assign(new Parameters(), body);
