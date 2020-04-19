import * as immutable from "immutable";
import {Environment} from "jianhan-fp-lib";

export type envsMap = immutable.Map<string, string | Environment | undefined>;
