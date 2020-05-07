import jsc from "jsverify";
import {validateSync} from "class-validator";
import {Parameters} from "./Parameters";

describe("Parameters class", () => {

    it("should validate the class when invalid country code supplied", () => {
        const assertions = jsc.forall("array nestring", (ss: string[]) => {
            const p = new Parameters();
            p.countryCodes = ss;
            return p.countryCodes.length === 0 ? true : validateSync(p).length > 0;
        });

        jsc.assert(assertions);
    });

    it("should pass validation when valid country code supplied", () => {
        const p = new Parameters();
        p.countryCodes = ["AU", "US", "GB"];
        const errs = validateSync(p);
        expect(errs).toHaveLength(0);
    })

});
