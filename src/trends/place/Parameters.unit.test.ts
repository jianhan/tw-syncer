import {Parameters} from "./Parameters";
import {validateSync} from "class-validator";

describe("Parameters class", () => {

    it("should be failed validation when id is empty", () => {
        const err = validateSync(new Parameters());
        expect(err).toHaveLength(1);
        expect(err[0].property).toBe('id');
    });

});
