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
var base_1 = require("./base");
//import requestPromise = require("request-promise");
var license_lookup_1 = require("license-lookup");
var LicenseTask = /** @class */ (function (_super) {
    __extends(LicenseTask, _super);
    function LicenseTask() {
        var _this = _super.call(this) || this;
        _this.name = "Dependency Licenses";
        _this.description = "Checks commits for new dependencies and which licenses apply to these";
        _this.resolution = "Please check the rules of play docs [here](rulesofplay.com)";
        return _this;
    }
    LicenseTask.prototype.checkComments = function (context, pull) {
        return __awaiter(this, void 0, void 0, function () {
            var comments, comment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.github.issues.listComments(pull)];
                    case 1:
                        comments = _a.sent();
                        comment = comments.data.find(function (comment) { return comment.user.login === process.env.APP_NAME + "[bot]"; });
                        return [2 /*return*/, comment];
                }
            });
        });
    };
    LicenseTask.prototype.run = function (context, config) {
        return __awaiter(this, void 0, void 0, function () {
            var pr, repo, pr_contents, pr_files, ll, matches, _i, matches_1, match, base, head, base_content, head_content, base_deps, head_deps, baseDepsKeys, new_deps, new_deps_lookup, _a, new_deps_lookup_1, dd;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pr = context.payload.pull_request;
                        repo = context.repo();
                        return [4 /*yield*/, context.github.pullRequests.listFiles(__assign({}, repo, { number: pr.number }))];
                    case 1:
                        pr_contents = _b.sent();
                        pr_files = pr_contents.data.map(function (x) { return x.filename; });
                        ll = new license_lookup_1.LicenseLookup();
                        matches = ll.matchFilesToManager(pr_files);
                        if (matches.length == 0) {
                            return [2 /*return*/, true];
                        }
                        _i = 0, matches_1 = matches;
                        _b.label = 2;
                    case 2:
                        if (!(_i < matches_1.length)) return [3 /*break*/, 9];
                        match = matches_1[_i];
                        return [4 /*yield*/, context.github.repos.getContents(__assign({}, repo, { path: match.file }))];
                    case 3:
                        base = _b.sent();
                        return [4 /*yield*/, context.github.repos.getContents({ repo: pr.head.repo.name, owner: pr.head.repo.owner.login, path: match.file, ref: pr.head.ref })];
                    case 4:
                        head = _b.sent();
                        base_content = Buffer.from(base.data.content, 'base64').toString();
                        head_content = Buffer.from(head.data.content, 'base64').toString();
                        return [4 /*yield*/, match.manager.detect(base_content)];
                    case 5:
                        base_deps = _b.sent();
                        return [4 /*yield*/, match.manager.detect(head_content)];
                    case 6:
                        head_deps = _b.sent();
                        baseDepsKeys = base_deps.map(function (x) { return x.name; });
                        new_deps = head_deps.filter(function (x) { return baseDepsKeys.indexOf(x.name) < 0; });
                        return [4 /*yield*/, match.manager.lookup(new_deps)];
                    case 7:
                        new_deps_lookup = _b.sent();
                        for (_a = 0, new_deps_lookup_1 = new_deps_lookup; _a < new_deps_lookup_1.length; _a++) {
                            dd = new_deps_lookup_1[_a];
                            this.result.push({
                                label: dd.name + " is a new dependency, licensed under: " + dd.license,
                                success: false
                            });
                        }
                        this.resolution = JSON.stringify(new_deps_lookup);
                        _b.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 2];
                    case 9: return [2 /*return*/, true];
                }
            });
        });
    };
    return LicenseTask;
}(base_1.BaseTask));
exports.default = LicenseTask;
//# sourceMappingURL=license.js.map