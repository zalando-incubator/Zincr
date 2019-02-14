"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var base_1 = require("./base");
var FourEyePrincipleTask = /** @class */ (function (_super) {
    __extends(FourEyePrincipleTask, _super);
    function FourEyePrincipleTask(appconfig, config, repo) {
        var _this = _super.call(this, appconfig, config, repo) || this;
        _this.unique = function (value, index, self) {
            return self.indexOf(value) === index;
        };
        _this.name = "Approvals";
        _this.description = "All proposed changes must be reviewed by project maintainers before they can be merged";
        _this.resolution = "Not enough people have approved this pull request - please ensure that atleast XXX users who have not contributed to this pull request approve the changes.";
        _this.postAsComment = true;
        return _this;
    }
    FourEyePrincipleTask.prototype.run = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var author, isOrgMember, approvals, desc, coAuthors, reviews;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        author = context.payload.pull_request.user.login;
                        return [4 /*yield*/, this.getOrgMembershipStatus(this.repo.owner, author, context)];
                    case 1:
                        isOrgMember = _a.sent();
                        approvals = 0;
                        desc = "";
                        return [4 /*yield*/, this.getCommitAuthors(context, author)];
                    case 2:
                        coAuthors = _a.sent();
                        return [4 /*yield*/, this.getReviews(context, coAuthors, "approved")];
                    case 3:
                        reviews = _a.sent();
                        // get current approvals
                        approvals = reviews.approvals.length;
                        if (isOrgMember && this.config.includeAuthor) {
                            approvals++;
                        }
                        if (approvals >= this.config.minimum) {
                            return [2 /*return*/, true];
                        }
                        if (reviews.contributing.length > 0) {
                            desc = "The reviews from " + reviews.contributing.map(function (x) { return "@" + x; }).join(", ") + " are excluded as the pull request contains changes from those users";
                        }
                        this.result.push({
                            label: approvals + " approvals of " + this.config.minimum + " required " + (this.config.includeAuthor ? "(Including author of this pull request)" : ""),
                            result: (approvals >= this.config.minimum) ? "success" /* Success */ : "failure" /* Failure */,
                            description: desc
                        });
                        this.resolution = this.resolution.replace('XXX', this.config.minimum.toString());
                        return [2 /*return*/, true];
                }
            });
        });
    };
    FourEyePrincipleTask.prototype.getCommitAuthors = function (context, pr_author) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.github.pullRequests.listCommits({
                            owner: context.payload.repository.owner.login,
                            repo: context.payload.repository.name,
                            number: context.payload.pull_request.number
                        })];
                    case 1:
                        response = _a.sent();
                        // get all contributin userds - except where the contribution is made via the suggestion feature, as this is reviwed
                        // by the original author before including - so co-authored commits can be exluded
                        return [2 /*return*/, response.data
                                .filter(function (commit) { return commit.commit.message.indexOf("Co-Authored-By: " + pr_author) < 0; })
                                .map(function (commit) { return commit.author.login; })
                                .filter(this.unique)];
                }
            });
        });
    };
    FourEyePrincipleTask.prototype.getReviews = function (context, coauthors, state) {
        return __awaiter(this, void 0, void 0, function () {
            var response, reviews, contributingReviews, non_contributingReviews, _i, contributingReviews_1, review;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.github.pullRequests.listReviews({
                            owner: context.payload.repository.owner.login,
                            repo: context.payload.repository.name,
                            number: context.payload.pull_request.number
                        })];
                    case 1:
                        response = _a.sent();
                        reviews = response.data
                            .filter(function (x) { return x.state.toLowerCase() === state; });
                        contributingReviews = reviews.filter(function (review) { return coauthors.indexOf(review.user.login) >= 0; });
                        non_contributingReviews = reviews.filter(function (review) { return coauthors.indexOf(review.user.login) < 0; });
                        _i = 0, contributingReviews_1 = contributingReviews;
                        _a.label = 2;
                    case 2:
                        if (!(_i < contributingReviews_1.length)) return [3 /*break*/, 5];
                        review = contributingReviews_1[_i];
                        return [4 /*yield*/, context.github.pullRequests.dismissReview({
                                owner: context.payload.repository.owner.login,
                                repo: context.payload.repository.name,
                                number: context.payload.pull_request.number,
                                review_id: review.id,
                                message: "@" + review.user.login + " is contributing to this pull request and can therefore not review the proposed changes"
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, {
                            contributing: contributingReviews.map(function (x) { return x.user.login; }).filter(this.unique),
                            approvals: non_contributingReviews.map(function (x) { return x.user.login; }).filter(this.unique)
                        }];
                }
            });
        });
    };
    FourEyePrincipleTask.prototype.getOrgMembershipStatus = function (org, login, context) {
        return __awaiter(this, void 0, void 0, function () {
            var isOrgMember, isMemberOfRepositoryOrganisation, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isOrgMember = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, context.github.orgs.getMembership({
                                org: org,
                                username: login
                            })];
                    case 2:
                        isMemberOfRepositoryOrganisation = _a.sent();
                        if (isMemberOfRepositoryOrganisation.data &&
                            isMemberOfRepositoryOrganisation.data.state === "active") {
                            isOrgMember = true;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        ex_1 = _a.sent();
                        // if the request fails, the member is not found.. 
                        isOrgMember = false;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, isOrgMember];
                }
            });
        });
    };
    return FourEyePrincipleTask;
}(base_1.BaseTask));
exports.default = FourEyePrincipleTask;
//# sourceMappingURL=approvals.js.map