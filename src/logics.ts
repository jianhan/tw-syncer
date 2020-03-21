import _ from "lodash";
import S from "sanctuary";
import fp from "lodash/fp";

export type predicateToString = (a: any) => string;

export const switchCase = (cases: { [key: string]: predicateToString }, defaultCase: predicateToString) => {
    return S.ifElse(S.curry2(_.has)(cases))(S.curry2(_.get)(cases))(fp.identity(defaultCase))
};
