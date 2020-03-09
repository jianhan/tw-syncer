import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

export default class Parameters {

    @IsArray()
    @ArrayMaxSize(100)
    @ArrayMinSize(1)
    @ArrayUnique()
    @IsString({ each: true })
    public screen_name: string[] = [];

    @IsArray()
    @ArrayMaxSize(100)
    @ArrayUnique()
    @IsNumber({}, { each: true })
    public user_id: number[] = [];

    @IsBoolean()
    public include_entities: boolean = false;

    @IsBoolean()
    public tweet_mode: boolean = false;

}
