"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = {
    internal: {
        numberOfReviews: 1,
        success: "",
        error: "This pull request must be reviewed by atleast 1 maintainer, as it was submitted by a member of the organisation"
    },
    external: {
        numberOfReviews: 2,
        success: "This pull request by an external author can be safely merged, as it has been approved by 2 members of the organisation",
        error: "This pull request must be reviewed by atleast 2 maintainers, as it was submitted by a person from outside the organisation"
    }
};
exports.Config = Config;
//# sourceMappingURL=config.js.map