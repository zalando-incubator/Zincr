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
//import requestPromise = require("request-promise");
// Patters for issue and url checks
var ISSUE_PATTERN = /(?:\w[\w-.]+\/\w[\w-.]+|\B)#[1-9]\d*\b/;
var URL_PATTERN = /\bhttps?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
var SpecificationTask = /** @class */ (function (_super) {
    __extends(SpecificationTask, _super);
    function SpecificationTask(params) {
        var _this = _super.call(this, params) || this;
        _this.name = "Specification";
        _this.description = "All pull requests must follow certain rules for content length and form";
        _this.resolution = "Please ensure the follow issues are resolved:";
        return _this;
    }
    SpecificationTask.prototype.run = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var pr, isLongEnough, containsPattern;
            return __generator(this, function (_a) {
                pr = context.payload.pull_request;
                isLongEnough = function (str, requiredLength) { return (str || '').length > requiredLength; };
                containsPattern = function (pattern, str) { return pattern.test(str); };
                // Check template
                // Get template - compare to body
                if (this.config.template) {
                    //const url = `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/master/.github/PULL_REQUEST_TEMPLATE.md`;
                    //const template = await requestPromise(url, { resolveWithFullResponse: true });
                }
                // Check title
                // check min length
                if (this.config.title) {
                    if (this.config.title && this.config.title["minimum-length"] && this.config.title["minimum-length"].enabled !== false) {
                        this.result.push({
                            label: "Pull Request Title must be atleast " + this.config.title["minimum-length"].length + " characters",
                            result: isLongEnough(pr.title, this.config.title["minimum-length"].length) ? "success" /* Success */ : "failure" /* Failure */
                        });
                    }
                }
                // Check body
                // check for issue pattern or url pattern
                if (this.config.body) {
                    if (this.config.body && this.config.body["minimum-length"] && this.config.body["minimum-length"].enabled !== false) {
                        this.result.push({
                            label: "Pull Request body must be atleast " + this.config.body["minimum-length"].length + " characters",
                            result: isLongEnough(pr.body, this.config.body["minimum-length"].length) ? "success" /* Success */ : "failure" /* Failure */
                        });
                    }
                    if (this.config.body["contains-issue-number"]) {
                        this.result.push({
                            label: "Pull Request body must contain issue number",
                            result: ISSUE_PATTERN.test(pr.body) ? "success" /* Success */ : "failure" /* Failure */
                        });
                    }
                    if (this.config.body["contains-url"]) {
                        this.result.push({
                            label: "Pull Request body must contain url",
                            result: containsPattern(URL_PATTERN, pr.body) ? "success" /* Success */ : "failure" /* Failure */
                        });
                    }
                }
                return [2 /*return*/, true];
            });
        });
    };
    return SpecificationTask;
}(base_1.BaseTask));
exports.default = SpecificationTask;
//# sourceMappingURL=specification.js.map