"use strict";
module.exports = function (app) {
    // Your code here
    app.log("Yay, the app was loaded!");
    var handlePullRequest = require("./pull-request-change");
    var setStatusPass = require("./set-status-pass");
    app.on([
        "pull_request"
    ], handlePullRequest);
    app.on('check_run.requested_action', setStatusPass);
};
//# sourceMappingURL=index.js.map