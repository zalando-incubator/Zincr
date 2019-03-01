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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var lookup_1 = __importDefault(require("../license/lookup"));
var LicenseTask = /** @class */ (function (_super) {
    __extends(LicenseTask, _super);
    function LicenseTask(appconfig, config, repo, organization) {
        var _this = _super.call(this, appconfig, config, repo, organization) || this;
        _this.name = "Dependency Licensing";
        _this.description = "All dependencies specified in package manager files must be reviewed, banned dependency licenses will block the merge, all new dependencies introduced in this pull request will give a warning, but not block the merge";
        _this.resolution = "Please ensure that only dependencies with licenses compatible with the license of this project is included in the pull request.";
        _this.postAsComment = true;
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
    LicenseTask.prototype.run = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var pullRequest, lookup, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pullRequest = context.payload.pull_request;
                        lookup = new lookup_1.default(this.config, context);
                        _a = this;
                        return [4 /*yield*/, lookup.run(this.repo, pullRequest.base.ref, pullRequest)];
                    case 1:
                        _a.result = _b.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return LicenseTask;
}(base_1.BaseTask));
exports.default = LicenseTask;
//# sourceMappingURL=license.js.map