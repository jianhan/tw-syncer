import {APIGatewayEvent} from "aws-lambda";
import * as httpStatus from "http-status-codes";
import S from "sanctuary"
import {ErrResponse} from "../../structures/ErrResponse";
import {response} from "../../structures/lambdaFuncs";
import {AbstractErrResponse} from "../../structures/AbstractErrResponse";

export const lambdaFunc = (syncFunc: (s: string|null) => any, event: APIGatewayEvent) => {
    return async (): Promise<response> => {
        try {
            const syncResult = syncFunc(event.body);

            // error occur
            if (S.isLeft(syncResult)) {
                if (syncResult instanceof AbstractErrResponse) {
                    return syncResult;
                }

                return new ErrResponse('Unable to process error from sync function', httpStatus.INTERNAL_SERVER_ERROR, syncResult);
            }

            // all good, composition can reach the last step, which means monad return Right
            return await syncResult.toPromise();
        } catch (err) {
            return new ErrResponse('Error occur', httpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
