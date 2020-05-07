import {Trend} from "./Trend";
import {Location} from "./Location";

export interface Place {
    trends: Trend[];
    as_of: Date;
    created_at: Date;
    locations: Location[];
}
