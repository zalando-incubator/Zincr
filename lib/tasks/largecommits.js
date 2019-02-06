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
var LargeCommits = /** @class */ (function (_super) {
    __extends(LargeCommits, _super);
    function LargeCommits(appconfig, config, repo) {
        var _this = _super.call(this, appconfig, config, repo) || this;
        _this.unique = function (value, index, self) {
            return self.indexOf(value) === index;
        };
        _this.name = "Large Commits";
        _this.description = "Checks commits for large additions to detect if code have been copied from an external source.";
        _this.resolution = "";
        _this.postAsComment = true;
        return _this;
    }
    LargeCommits.prototype.run = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var commits, allFiles, _i, allFiles_1, file;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCommits(context)];
                    case 1:
                        commits = _a.sent();
                        allFiles = commits
                            .map(function (x) { return x.files; });
                        allFiles = [].concat.apply([], allFiles);
                        allFiles = allFiles.filter(function (file) { return file.additions > _this.config.maxLines || file.changes > _this.config.maxLines; });
                        for (_i = 0, allFiles_1 = allFiles; _i < allFiles_1.length; _i++) {
                            file = allFiles_1[_i];
                            this.result.push({
                                label: "[" + file.filename + "](/" + this.repo.owner + "/" + this.repo.repo + "/pull/" + context.payload.pull_request.number + "/commits/" + file.sha + ") had +" + this.config.maxLines + " lines of code changed in a single commit",
                                result: "warning" /* Warning */,
                                description: "Please review this commit to determine the source of this change"
                            });
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    LargeCommits.prototype.getCommits = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var response, commitReq, commitData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.github.pullRequests.listCommits({
                            owner: context.payload.repository.owner.login,
                            repo: context.payload.repository.name,
                            number: context.payload.pull_request.number
                        })];
                    case 1:
                        response = _a.sent();
                        commitReq = response.data.map(function (commit) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, context.github.repos.getCommit({ sha: commit.sha, repo: context.payload.repository.name, owner: context.payload.repository.owner.login })];
                                    case 1: return [2 /*return*/, (_a.sent()).data];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(commitReq)];
                    case 2:
                        commitData = _a.sent();
                        return [2 /*return*/, commitData];
                }
            });
        });
    };
    LargeCommits.prototype.getOrgMembershipStatus = function (org, login, context) {
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
    return LargeCommits;
}(base_1.BaseTask));
exports.default = LargeCommits;
//# sourceMappingURL=largecommits.js.map