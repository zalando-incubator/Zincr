"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var github_1 = require("probot/lib/github");
function getOctokit(host, token) {
    var octokit = github_1.GitHubAPI({
        baseUrl: "https://" + host + "/api/v3",
        logger: {
            debug: function () { },
            info: function () { },
            warn: console.warn,
            error: console.error
        },
    });
    octokit.authenticate({ type: 'token', token: token });
    return octokit;
}
exports.getOctokit = getOctokit;
//# sourceMappingURL=octokit.js.map