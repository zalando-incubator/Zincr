"use strict";
module.exports = function (app) {
    // Your code here
    app.log("Yay, the app was loaded!");
    // For more information on building apps:
    // https://probot.github.io/docs/
    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
    var handlePullRequest = require("./pull-request-change");
    app.on([
        "pull_request"
    ], handlePullRequest);
};
//# sourceMappingURL=index.js.map