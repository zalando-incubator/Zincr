"use strict";
module.exports = function (app) {
    // Your code here
    app.log("Yay, the app was loaded!");
    var handlePullRequest = require("./pull-request-change");
    app.on([
        "pull_request"
    ], handlePullRequest);
};
//# sourceMappingURL=index.js.map