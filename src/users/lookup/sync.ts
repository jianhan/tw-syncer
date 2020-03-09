import S from "sanctuary"
import { validateSync } from "class-validator";
import _ from "lodash";
import Parameters from "./Parameters";
import * as immutable from "immutable"
import { listTrim, listRemoveEmpty, listUnique, bool2Str } from "jianhan-fp-lib/dist/operations";

/**
 *
 * @param parameters
 */
const validate = (parameters: Parameters) => {
    const errors = validateSync(parameters);
    if (errors.length > 0) {
        return S.Left(errors);
    }

    return S.Right(immutable.fromJS(parameters))
}


const sensitizeList = S.pipe([listTrim, listRemoveEmpty, listUnique]);

const sensitizeAndUpdate = (key: string, map: immutable.Map<string, any>) => {
    if (map.has(key)) {
        return map.set(key, sensitizeList(map.get(key)));
    }

    return map;
}

const parametersToObj = (map: immutable.Map<string, any>): { [key: string]: string } => {
    return {
        screen_name: _.join(map.get('screen_name').toArray(), ","),
        user_id: _.join(map.get('user_id').toArray(), ","),
        include_entities: bool2Str(map.get('include_entities')),
        tweet_mode: bool2Str(map.get('tweet_mode')),
    };
}

/**
 *
 */
const transform = S.pipe([S.curry2(sensitizeAndUpdate)('screen_name'), S.curry2(sensitizeAndUpdate)('user_id')]);


export const sync =
    S.pipe([
        S.encase(JSON.parse),
        S.chain(validate),
        S.map(transform),
        S.map(parametersToObj),
        S.map(S.encase(JSON.stringify))
        // fetch
        // upload
    ]);
