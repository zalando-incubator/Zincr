"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
function handlePullRequestChange(context) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, pullRequest, approvals, org, repo, isOrgMember, isMemberOfRepositoryOrganisation, ex_1, approved, desc, conclusion, approved, desc, conclusion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context.config(".github/4eys.yml", config_1.Config)];
                case 1:
                    cfg = _a.sent();
                    if (!cfg)
                        return [2 /*return*/];
                    return [4 /*yield*/, getPullRequest(context)];
                case 2:
                    pullRequest = _a.sent();
                    // if there is no pull request or the state is not open, no reason to continue
                    if (!pullRequest || pullRequest.state !== "open")
                        return [2 /*return*/];
                    return [4 /*yield*/, getReviewsWithState(context, "approved")];
                case 3:
                    approvals = _a.sent();
                    //if we already have 4 eyes on this, no reason to continue
                    if (approvals >= 2)
                        return [2 /*return*/];
                    org = pullRequest.base.repo.owner.login;
                    repo = pullRequest.base.repo.name;
                    isOrgMember = false;
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, context.github.orgs.getOrgMembership({
                            org: org,
                            username: pullRequest.user.login
                        })];
                case 5:
                    isMemberOfRepositoryOrganisation = _a.sent();
                    if (isMemberOfRepositoryOrganisation.data &&
                        isMemberOfRepositoryOrganisation.data.state === "active") {
                        isOrgMember = true;
                    }
                    return [3 /*break*/, 7];
                case 6:
                    ex_1 = _a.sent();
                    // if the request fails, the member is not found.. 
                    isOrgMember = false;
                    return [3 /*break*/, 7];
                case 7:
                    // Handle if the PR author is part of the organisation
                    if (isOrgMember) {
                        approved = approvals >= cfg.internal.numberOfReviews;
                        desc = approved ? cfg.internal.success : cfg.internal.error;
                        conclusion = approved ? "completed" : "action_required";
                        return [2 /*return*/, context.github.checks.create({
                                owner: org,
                                repo: repo,
                                name: 'Review of internal pull request',
                                head_sha: pullRequest.head.sha,
                                status: 'completed',
                                conclusion: conclusion,
                                completed_at: new Date().toISOString(),
                                output: {
                                    title: cfg.internal.numberOfReviews + " code review(s) required",
                                    summary: desc
                                }
                            })];
                    }
                    else {
                        approved = approvals >= cfg.internal.numberOfReviews;
                        desc = approved ? cfg.external.success : cfg.external.error;
                        conclusion = approved ? "completed" : "action_required";
                        return [2 /*return*/, context.github.checks.create({
                                owner: org,
                                repo: repo,
                                name: 'Review of external pull request',
                                head_sha: pullRequest.head.sha,
                                status: 'completed',
                                conclusion: conclusion,
                                completed_at: new Date().toISOString(),
                                output: {
                                    title: cfg.external.numberOfReviews + " code review(s) required",
                                    summary: desc
                                }
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getPullRequest(context) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context.github.pullRequests.get({
                        owner: context.payload.repository.owner.login,
                        repo: context.payload.repository.name,
                        number: context.payload.pull_request.number
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    });
}
function getReviewsWithState(context, state) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context.github.pullRequests.getReviews({
                        owner: context.payload.repository.owner.login,
                        repo: context.payload.repository.name,
                        number: context.payload.pull_request.number
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data
                            .map(function (review) { return review.state; })
                            .filter(function (word) { return word.toLowerCase() === state; }).length];
            }
        });
    });
}
module.exports = handlePullRequestChange;
//# sourceMappingURL=pull-request-change.js.map