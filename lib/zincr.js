"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var task_runner_1 = require("./task-runner");
var Zincr = /** @class */ (function () {
    function Zincr(appconfig, taskconfig, repo, organization) {
        this.appconfig = appconfig;
        this.taskconfig = taskconfig;
        this.repo = repo;
        this.organization = organization;
        this.runner = new task_runner_1.TaskRunner(this.appconfig, this.taskconfig, this.repo, this.organization);
    }
    Zincr.prototype.onChange = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var CHECKNAME, pullRequest, event, issue, sha, _plural, checkInfo, result, checkResult, summary, _i, _a, r, _b, _c, r, _d, _e, r, resolutions, comments, _f, _g, r, _h, _j, r, _k, _l, r, issue_comments, comment, body;
            var _this = this;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        CHECKNAME = this.appconfig.checkname;
                        pullRequest = context.payload.pull_request;
                        event = context.event;
                        issue = context.issue();
                        sha = context.payload.pull_request.head.sha;
                        _plural = function (plural, singular, count) {
                            if (count === 1) {
                                return singular;
                            }
                            else {
                                return plural;
                            }
                        };
                        // if there is no pull request or the state is not open, no reason to continue
                        if (!pullRequest || pullRequest.state !== "open")
                            return [2 /*return*/];
                        // no need to rerun checks when a review is requested..
                        if (event == "pull_request" &&
                            context.payload.action === "review_requested")
                            return [2 /*return*/];
                        // if this a dimissal of a review, we already handling this elsewhere.
                        if (event === "pull_request_review" &&
                            context.payload.action === "dismissed")
                            return [2 /*return*/];
                        checkInfo = {
                            owner: this.repo.owner,
                            repo: this.repo.repo,
                            name: CHECKNAME,
                            head_sha: sha
                        };
                        // In progress feedback
                        return [4 /*yield*/, context.github.checks.create(__assign({}, checkInfo, { status: "in_progress", output: {
                                    title: "Processing " + this.runner.tasks.length + " " + _plural("checks", "check", this.runner.tasks.length),
                                    summary: ""
                                } }))];
                    case 1:
                        // In progress feedback
                        _m.sent();
                        return [4 /*yield*/, this.runner.run(context)];
                    case 2:
                        result = _m.sent();
                        checkResult = __assign({}, checkInfo, { status: "completed", conclusion: result.Failure.length == 0 ? "success" : "action_required", completed_at: new Date().toISOString(), output: {
                                title: "Found " + result.Failure.length + " " + _plural("problems", "problem", result.Failure.length) + ",  " + result.Warning.length + " " + _plural("warnings", "warning", result.Failure.length),
                                summary: "",
                                text: ""
                            } });
                        summary = [];
                        for (_i = 0, _a = result.Failure; _i < _a.length; _i++) {
                            r = _a[_i];
                            summary.push("    " + "\u274C" /* Failure */ + " " + r.name);
                        }
                        for (_b = 0, _c = result.Warning; _b < _c.length; _b++) {
                            r = _c[_b];
                            summary.push("    " + "\u26A0\uFE0F" /* Warning */ + " " + r.name);
                        }
                        for (_d = 0, _e = result.Success; _d < _e.length; _d++) {
                            r = _e[_d];
                            summary.push("    " + "\u2705" /* Success */ + " " + r.name);
                        }
                        if (result.Warning.length + result.Failure.length > 0) {
                            summary.push("");
                            summary.push("Details on how to resolve are provided below");
                            summary.push("");
                            summary.push("----");
                            summary.push("");
                        }
                        resolutions = [];
                        comments = [];
                        comments.push("## \uD83E\uDD16 " + this.appconfig.appname + " found " + result.Failure.length + " " + _plural("problems", "problem", result.Failure.length) + " ,  " + result.Warning.length + " " + _plural("warnings", "warning", result.Warning.length));
                        comments.push(summary.join("\n"));
                        comments.push("");
                        for (_f = 0, _g = result.Failure; _f < _g.length; _f++) {
                            r = _g[_f];
                            resolutions.push(r.render());
                            comments.push(r.render());
                        }
                        for (_h = 0, _j = result.Warning; _h < _j.length; _h++) {
                            r = _j[_h];
                            resolutions.push(r.render());
                            comments.push(r.render());
                        }
                        for (_k = 0, _l = result.Success; _k < _l.length; _k++) {
                            r = _l[_k];
                            resolutions.push(r.render());
                        }
                        checkResult.output.summary = summary.join("\n");
                        checkResult.output.text = resolutions.join("\n");
                        return [4 /*yield*/, context.github.issues.listComments(issue)];
                    case 3:
                        issue_comments = _m.sent();
                        comment = issue_comments.data.find(function (comment) { return comment.user.login === _this.appconfig.appname + "[bot]"; });
                        body = comments.join("\n");
                        if (!comment) return [3 /*break*/, 5];
                        return [4 /*yield*/, context.github.issues.updateComment(__assign({}, issue, { comment_id: comment.id, body: body }))];
                    case 4:
                        _m.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, context.github.issues.createComment(__assign({}, issue, { body: body }))];
                    case 6:
                        _m.sent();
                        _m.label = 7;
                    case 7: return [4 /*yield*/, context.github.checks.create(checkResult)];
                    case 8:
                        _m.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Zincr.prototype.setStatusPass = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var sha, checkInfo;
            return __generator(this, function (_a) {
                sha = context.payload.pull_request.head.sha;
                checkInfo = {
                    owner: this.repo.owner,
                    repo: this.repo.repo,
                    name: this.appconfig.checkname,
                    head_sha: sha
                };
                return [2 /*return*/, context.github.checks.create(__assign({}, checkInfo, { status: "completed", conclusion: 'success', completed_at: new Date().toISOString(), output: {
                            title: this.appconfig.checkname,
                            summary: 'Check was manually approved.'
                        } }))];
            });
        });
    };
    return Zincr;
}());
exports.Zincr = Zincr;
//# sourceMappingURL=zincr.js.map