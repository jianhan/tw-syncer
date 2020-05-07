import {IsISO31661Alpha2, IsNotEmpty, IsPositive} from "class-validator";
import {Parameters} from "./Parameters";
import _ from "lodash";
import {validateAndThrowSync} from "../../operations";

/**
 * WhereOnEarthLocation is where on earth location object.
 */
export class WhereOnEarthLocation {

    /**
     * woeid is where on earth unique identifier.
     */
    @IsPositive()
    woeid: number;

    /**
     * name is the name of the location.
     */
    @IsNotEmpty()
    name: string;

    /**
     * countryCode is ISO 31661 alpha2 country code.
     */
    @IsISO31661Alpha2()
    @IsNotEmpty()
    countryCode: string;

    /**
     * constructor
     *
     * @param woeid
     * @param name
     * @param countryCode
     */
    constructor(woeid: number, name: string, countryCode: string) {
        this.woeid = woeid;
        this.name = name;
        this.countryCode = countryCode;
    }
}

/**
 * toWhereOnEarthLocations parse buffer into array of WhereOnEarthLocation.
 *
 * @param fileContent
 */
export const toWhereOnEarthLocations = (fileContent: Buffer): WhereOnEarthLocation[] => JSON.parse(fileContent.toString());

/**
 * filterLocationsByParameters filter array of locations by input parameters object.
 *
 * @param parameters
 */
export const filterLocationsByParameters = (parameters: Parameters) => (locations: WhereOnEarthLocation[]): WhereOnEarthLocation[] => {
    validateAndThrowSync(parameters);
    const condition = parameters.countryCodes.length === 0
        ? (location: WhereOnEarthLocation) => location.woeid === 1
        : (location: WhereOnEarthLocation) => _.includes(parameters.countryCodes, location.countryCode);

    return locations.filter(condition)
};
