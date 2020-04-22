import {handler} from "./index";
import {APIGatewayEvent} from "aws-lambda";
import {LambdaResponse} from "./structures/LambdaResponse";
import * as httpStatus from "http-status-codes";

const validJSON = () => ({
    screen_name: ["chenqiushi404"],
    user_id: [],
    include_entities: true,
    tweet_mode: false
});

describe("handler function", () => {

    it("should execute user lookup sync lambda function", async () => {
        // @ts-ignore
        const event: APIGatewayEvent = {path: 'users/lookup', body: validJSON()};
        const result = await handler(event);
        expect(result).toBeInstanceOf(LambdaResponse);
        expect(result.status).toBe(httpStatus.OK);
        expect(result).toHaveProperty("details");
        ["ETag", "ServerSideEncryption", "VersionId", "Location", "key", "Key", "Bucket"].forEach((v: string) => {
            expect(result.details).toHaveProperty(v);
        });
    });

    it("should execute lambdaNotFound function when lambda function can not be found by path", async () => {
        // @ts-ignore
        const event: APIGatewayEvent = {path: 'users/invalidPath', body: validJSON()};
        const result = await handler(event);
        expect(result).toBeInstanceOf(LambdaResponse);
        expect(result.status).toBe(httpStatus.BAD_REQUEST);
        expect(result.message).toBe("Can not find matching function to execute");
    })

});
