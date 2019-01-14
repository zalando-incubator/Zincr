"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
var config_1 = require("./config");
function handlePullRequestChange(context) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, CHECKNAME, tasksToRun, pullRequest, repo, sha, checkInfo, results, _i, tasksToRun_1, task, t, _a, failedTasks, checkResult, summary, _b, results_1, result, resolutions, _c, failedTasks_1, result, _d, _e, subResult;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, context.config("./zappr.yml", config_1.Config)];
                case 1:
                    cfg = _f.sent();
                    CHECKNAME = "4eyes-bot";
                    tasksToRun = Object.keys(cfg);
                    pullRequest = context.payload.pull_request;
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
                    _a = _f.sent();
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    failedTasks = results.filter(function (x) { return !x.success(); });
                    checkResult = __assign({}, checkInfo, { status: "completed", conclusion: (failedTasks.length == 0) ? "success" : "action_required", completed_at: new Date().toISOString(), output: {
                            title: "All checks have passed",
                            summary: '',
                            text: ''
                        } });
                    if (failedTasks.length > 0) {
                        checkResult.output.title = failedTasks.length + " checks out of " + results.length + " failed";
                        summary = [];
                        summary.push("Details on how to resolve provided below");
                        for (_b = 0, results_1 = results; _b < results_1.length; _b++) {
                            result = results_1[_b];
                            summary.push((result.success() ? '✅' : '❌') + " " + result.name);
                        }
                        resolutions = [];
                        for (_c = 0, failedTasks_1 = failedTasks; _c < failedTasks_1.length; _c++) {
                            result = failedTasks_1[_c];
                            resolutions.push("### Task: " + result.name + " failed");
                            resolutions.push("" + result.description);
                            resolutions.push("#### Resolution");
                            resolutions.push("" + result.resolution);
                            if (result.result) {
                                resolutions.push("#### Details");
                                for (_d = 0, _e = result.result; _d < _e.length; _d++) {
                                    subResult = _e[_d];
                                    resolutions.push((subResult.success ? '✅' : '❌') + " " + subResult.label);
                                }
                            }
                        }
                        checkResult.output.summary = summary.join('\n');
                        checkResult.output.text = resolutions.join('\n');
                    }
                    return [2 /*return*/, context.github.checks.create(checkResult)];
            }
        });
    });
}
module.exports = handlePullRequestChange;
//# sourceMappingURL=pull-request-change.js.map