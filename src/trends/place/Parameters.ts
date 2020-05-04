import {IsArray, IsNotEmpty, IsNumber} from "class-validator";

/**
 * Parameters represents twitter api parameters when fetching trends place, it will be used
 * for validations to ensure input parameters all valid before API call.
 *
 * @export
 * @class Parameters
 */
export class Parameters {

    /**
     * id is the Yahoo! Where On Earth ID of the location to return trending information for.
     * Global information is available by using 1 as the WOEID .
     */
    @IsNumber()
    @IsNotEmpty()
    public id?: number;

    /**
     * exclude is an optional parameter,
     * Setting this equal to hashtags will remove all hashtags from the trends list.
     */
    @IsArray()
    public exclude: string[] = [];
}

/**
 * take an key value pair and construct parameter out of it.
 *
 * @param body
 */
export const toParameters = (body: { [key: string]: any }): Parameters => Object.assign(new Parameters(), body);

