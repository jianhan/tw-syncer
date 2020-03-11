import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

/**
 * Parameters represents twitter api parameters when fetching users, it will be used
 * for validations to ensure input parameters all valid before API call.
 *
 * @export
 * @class Parameters
 */
export default class Parameters {

    /**
     * screen_name is screen_name parameter.
     *
     * @type string[]
     * @memberof Parameters
     */
    @IsArray()
    @ArrayMaxSize(100)
    @ArrayMinSize(1)
    @ArrayUnique()
    @IsString({ each: true })
    // tslint:disable-next-line: variable-name
    public screen_name: string[] = [];

    /**
     * user_id is user_id parameter.
     *
     * @type number[]
     * @memberof Parameters
     */
    @IsArray()
    @ArrayMaxSize(100)
    @ArrayUnique()
    @IsNumber({}, { each: true })
    // tslint:disable-next-line: variable-name
    public user_id: number[] = [];

    /**
     * include_entities is include_entities parameter.
     *
     * @type boolean
     * @memberof Parameters
     */
    @IsBoolean()
    // tslint:disable-next-line: variable-name
    public include_entities: boolean = false;

    /**
     * tweet_mode is tweet_mode parameter
     *
     * @type boolean
     * @memberof Parameters
     */
    @IsBoolean()
    // tslint:disable-next-line: variable-name
    public tweet_mode: boolean = false;
}
