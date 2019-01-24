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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tasks_1 = require("./config/tasks");
var app_1 = require("./config/app");
function handlePullRequestChange(context) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, CHECKNAME, tasksToRun, pullRequest, issue, repo, sha, checkInfo, results, _i, tasksToRun_1, task, t, ex_1, failedTasks, warningTasks, successTasks, checkResult, summary, _a, failedTasks_1, result, _b, warningTasks_1, result, _c, successTasks_1, result, resolutions, comments, _d, failedTasks_2, result, _e, warningTasks_2, result, issue_comments, comment, body;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, context.config(app_1.AppConfig.configfile, tasks_1.TaskConfig)];
                case 1:
                    cfg = _f.sent();
                    CHECKNAME = app_1.AppConfig.checkname;
                    tasksToRun = Object.keys(cfg);
                    pullRequest = context.payload.pull_request;
                    issue = context.issue();
                    // if there is no pull request or the state is not open, no reason to continue
                    if (!pullRequest || pullRequest.state !== "open")
                        return [2 /*return*/];
                    repo = context.repo();
                    sha = context.payload.pull_request.head.sha;
                    checkInfo = {
                        owner: repo.owner,
                        repo: repo.repo,
                        name: CHECKNAME,
                        head_sha: sha
                    };
                    // In progress feedback
                    return [4 /*yield*/, context.github.checks.create(__assign({}, checkInfo, { status: "in_progress", output: {
                                title: "Processing " + tasksToRun.length + " checks",
                                summary: ''
                            } }))];
                case 2:
                    // In progress feedback
                    _f.sent();
                    results = new Array();
                    _i = 0, tasksToRun_1 = tasksToRun;
                    _f.label = 3;
                case 3:
                    if (!(_i < tasksToRun_1.length)) return [3 /*break*/, 10];
                    task = tasksToRun_1[_i];
                    _f.label = 4;
                case 4:
                    _f.trys.push([4, 8, , 9]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("./tasks/" + task)); })];
                case 5:
                    t = new ((_f.sent()).default)();
                    if (!(t !== null)) return [3 /*break*/, 7];
                    return [4 /*yield*/, t.run(context, cfg[task])];
                case 6:
                    _f.sent();
                    results.push(t);
                    _f.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    ex_1 = _f.sent();
                    console.log(ex_1);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    failedTasks = results.filter(function (x) { return x.summary().Failure.length > 0; });
                    warningTasks = results.filter(function (x) { return x.summary().Warning.length > 0 && x.summary().Failure.length == 0; });
                    successTasks = results.filter(function (x) { return x.summary().Warning.length == 0 && x.summary().Failure.length == 0; });
                    checkResult = __assign({}, checkInfo, { status: "completed", conclusion: (failedTasks.length == 0) ? "success" : "action_required", completed_at: new Date().toISOString(), output: {
                            title: "Found " + failedTasks.length + " problems,  " + warningTasks.length + " warnings",
                            summary: '',
                            text: ''
                        } });
                    if (!(warningTasks.length + failedTasks.length > 0)) return [3 /*break*/, 18];
                    summary = [];
                    for (_a = 0, failedTasks_1 = failedTasks; _a < failedTasks_1.length; _a++) {
                        result = failedTasks_1[_a];
                        summary.push("\u274C " + result.name);
                    }
                    for (_b = 0, warningTasks_1 = warningTasks; _b < warningTasks_1.length; _b++) {
                        result = warningTasks_1[_b];
                        summary.push("\u26A0\uFE0F " + result.name);
                    }
                    for (_c = 0, successTasks_1 = successTasks; _c < successTasks_1.length; _c++) {
                        result = successTasks_1[_c];
                        summary.push("\u2705 " + result.name);
                    }
                    summary.push("");
                    summary.push("Details on how to resolve provided below");
                    resolutions = [];
                    comments = [];
                    for (_d = 0, failedTasks_2 = failedTasks; _d < failedTasks_2.length; _d++) {
                        result = failedTasks_2[_d];
                        resolutions.push(result.render());
                        if (result.postAsComment) {
                            comments.push(result.render());
                        }
                    }
                    for (_e = 0, warningTasks_2 = warningTasks; _e < warningTasks_2.length; _e++) {
                        result = warningTasks_2[_e];
                        resolutions.push(result.render());
                        if (result.postAsComment) {
                            comments.push(result.render());
                        }
                    }
                    checkResult.output.summary = summary.join('\n');
                    checkResult.output.text = resolutions.join('\n');
                    return [4 /*yield*/, context.github.issues.listComments(issue)];
                case 11:
                    issue_comments = _f.sent();
                    comment = issue_comments.data.find(function (comment) { return comment.user.login === app_1.AppConfig.appname + "[bot]"; });
                    if (!(comments.length > 0)) return [3 /*break*/, 16];
                    body = comments.join('\n');
                    if (!comment) return [3 /*break*/, 13];
                    return [4 /*yield*/, context.github.issues.updateComment(__assign({}, issue, { comment_id: comment.id, body: body }))];
                case 12:
                    _f.sent();
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, context.github.issues.createComment(__assign({}, issue, { body: body }))];
                case 14:
                    _f.sent();
                    _f.label = 15;
                case 15: return [3 /*break*/, 18];
                case 16:
                    if (!comment) return [3 /*break*/, 18];
                    // this likely won't work... 
                    return [4 /*yield*/, context.github.issues.deleteComment(__assign({}, issue, { comment_id: comment.id }))];
                case 17:
                    // this likely won't work... 
                    _f.sent();
                    _f.label = 18;
                case 18: return [2 /*return*/, context.github.checks.create(checkResult)];
            }
        });
    });
}
module.exports = handlePullRequestChange;
//# sourceMappingURL=pull-request-change.js.map