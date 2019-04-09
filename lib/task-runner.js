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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TaskRunner = /** @class */ (function () {
    function TaskRunner(params) {
        this.appconfig = params.appconfig;
        this.taskconfig = params.taskconfig;
        this.repo = params.repo;
        this.tasks = Object.entries(this.taskconfig).filter(function (x) { return x[1].enabled; });
        this.organization = params.organization;
    }
    TaskRunner.prototype.loadRunners = function () {
        return __awaiter(this, void 0, void 0, function () {
            var runners, _i, _a, task, taskname, tConfig, params, t, ex_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        runners = new Array();
                        _i = 0, _a = this.tasks;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        task = _a[_i];
                        taskname = task[0];
                        tConfig = task[1];
                        params = {
                            appconfig: this.appconfig,
                            config: tConfig,
                            repo: this.repo,
                            organization: this.organization
                        };
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(params.appconfig.tasksdirectory + taskname)); })];
                    case 3:
                        t = new ((_b.sent()).default)(params);
                        if (t !== null) {
                            runners.push(t);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        ex_1 = _b.sent();
                        console.log(ex_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, runners];
                }
            });
        });
    };
    TaskRunner.prototype.run = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var results, runners, _i, runners_1, runner, ex_2, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = new Array();
                        return [4 /*yield*/, this.loadRunners()];
                    case 1:
                        runners = _a.sent();
                        _i = 0, runners_1 = runners;
                        _a.label = 2;
                    case 2:
                        if (!(_i < runners_1.length)) return [3 /*break*/, 7];
                        runner = runners_1[_i];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, runner.run(context)];
                    case 4:
                        _a.sent();
                        results.push(runner);
                        return [3 /*break*/, 6];
                    case 5:
                        ex_2 = _a.sent();
                        console.log(ex_2);
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7:
                        result = {
                            Failure: results.filter(function (x) { return x.summary().Failure.length > 0; }),
                            Warning: results.filter(function (x) { return x.summary().Warning.length > 0 && x.summary().Failure.length == 0; }),
                            Success: results.filter(function (x) { return x.summary().Warning.length == 0 && x.summary().Failure.length == 0; })
                        };
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return TaskRunner;
}());
exports.TaskRunner = TaskRunner;
//# sourceMappingURL=task-runner.js.map