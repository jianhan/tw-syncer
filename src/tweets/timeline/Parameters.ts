import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, validateSync, ValidationError} from "class-validator";
import {LambdaResponse} from "../../structures/LambdaResponse";
import * as httpStatus from "http-status-codes";
import S from "sanctuary";

/**
 * Parameters represents twitter api parameters when fetching user timeline, it will be used
 * for validations to ensure input parameters all valid before API call.
 *
 * @export
 * @class Parameters
 */
export class Parameters {

    /**
     * screen_name is the screen name of the user for whom to return results.
     */
    @IsString()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public screen_name?: string;

    /**
     * since_id returns results with an ID greater than (that is, more recent than) the specified ID.
     * There are limits to the number of Tweets that can be accessed through the API.
     * If the limit of Tweets has occured since the since_id, the since_id will be forced to the oldest ID available.
     */
    @IsNumber()
    @IsNotEmpty()
    // tslint:disable-next-line:variable-name
    public since_id: number = 1;

    /**
     * count specifies the number of tweets to try and retrieve, up to a maximum of 200 per distinct request.
     * the value of count is best thought of as a limit to the number of tweets to return because suspended or deleted content is
     * removed after the count has been applied we include retweets in the count, even if include_rts is not supplied.
     * it is recommended you always send include_rts=1 when using this api method.
     */
    @IsNumber()
    @Min(1)
    @Max(200)
    // tslint:disable-next-line:variable-name
    public count: number = 50;

    /**
     * max_id returns results with an id less than (that is, older than) or equal to the specified id.
     */
    @IsNumber()
    @Min(1)
    @IsOptional()
    // tslint:disable-next-line:variable-name
    public max_id?: number;

    /**
     * trim_user When set to either true , t or 1 , each Tweet returned in a timeline will include a user
     * object including only the status authors numerical ID. Omit this parameter to receive the complete user object.
     */
    @IsBoolean()
    // tslint:disable-next-line: variable-name
    public trim_user: boolean = true;

    /**
     * exclude_replies will prevent replies from appearing in the returned timeline. Using exclude_replies with the count parameter
     * parameter retrieves that many Tweets before filtering out retweets and replies.
     */
    @IsBoolean()
    // tslint:disable-next-line: variable-name
    public exclude_replies: boolean = true;

    /**
     * include_rts when set to false , the timeline will strip any native retweets (though they will still count
     * toward both the maximal length of the timeline and the slice selected by the count parameter).
     * Note: If you're using the trim_user parameter in conjunction with include_rts, the retweets will still contain a full user object.
     */
    @IsBoolean()
    // tslint:disable-next-line: variable-name
    public include_rts: boolean = false;
}

/**
 * validateParameters validates parameters via class-validator.
 *
 * @param parameters
 */
export const validateParameters = (parameters: Parameters) => {
    const errs: ValidationError[] = validateSync(parameters);
    if (errs.length > 0) {
        return S.Left(new LambdaResponse(httpStatus.BAD_REQUEST, 'Invalid parameter(s)', errs));
    }

    return S.Right(parameters);
};

export const toParameters = (body: { [key: string]: any }): Parameters => Object.assign(new Parameters(), body);

