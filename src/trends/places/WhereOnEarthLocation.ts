import {IsISO31661Alpha2, IsNotEmpty, IsPositive} from "class-validator";
import {Parameters} from "./Parameters";
import _ from "lodash";
import {validateAndThrow} from "../../operations";

export class WhereOnEarthLocation {

    /**
     * weoid is where on earth unique identifier.
     */
    @IsPositive()
    weoid: number;

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
     * @param weoid
     * @param name
     * @param countryCode
     */
    constructor(weoid: number, name: string, countryCode: string) {
        this.weoid = weoid;
        this.name = name;
        this.countryCode = countryCode;
    }
}

export const toWhereOnEarthLocations = (fileContent: Buffer): WhereOnEarthLocation[] => JSON.parse(fileContent.toString());

export const extractCountryCodes = (locations: WhereOnEarthLocation[]) => locations.map(l => l.countryCode);

export const filterLocationsByParameters = (parameters: Parameters) => (locations: WhereOnEarthLocation[]): WhereOnEarthLocation[] => {
    validateAndThrow(parameters);
    const condition = parameters.countryCodes.length === 0
        ? (location: WhereOnEarthLocation) => location.weoid === 1
        : (location: WhereOnEarthLocation) => _.includes(extractCountryCodes(locations), location.countryCode);

    return locations.filter(condition)
};
