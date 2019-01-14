"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
    function FourEyePrincipleTask() {
        var _this = _super.call(this) || this;
        _this.name = "Four eye principle";
        _this.description = "Ensures that all contributions are reviewed by 2 Zalando employees";
        _this.resolution = "Please ensure that XXX current employees have reviewed and approved this pull request";
        return _this;
    }
    FourEyePrincipleTask.prototype.run = function (context, config) {
        return __awaiter(this, void 0, void 0, function () {
            var repo, author, isOrgMember, approvals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repo = context.repo();
                        author = context.payload.pull_request.head.user.login;
                        return [4 /*yield*/, this.getOrgMembershipStatus(repo.owner, author, context)];
                    case 1:
                        isOrgMember = _a.sent();
                        return [4 /*yield*/, this.getReviewsWithState(context, "approved")];
                    case 2:
                        approvals = _a.sent();
                        if (approvals >= config.internal.numberOfReviews && approvals >= config.external.numberOfReviews) {
                            return [2 /*return*/, true];
                        }
                        if (isOrgMember) {
                            this.result.push({
                                label: approvals + " approvals out of " + config.internal.numberOfReviews + " required",
                                success: (approvals >= config.internal.numberOfReviews)
                            });
                            this.resolution = this.resolution.replace('XXX', config.internal.numberOfReviews);
                        }
                        else {
                            this.result.push({
                                label: approvals + " approvals out of " + config.external.numberOfReviews + " required",
                                success: (approvals >= config.external.numberOfReviews)
                            });
                            this.resolution = this.resolution.replace('XXX', config.external.numberOfReviews);
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    FourEyePrincipleTask.prototype.getReviewsWithState = function (context, state) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.github.pullRequests.listReviews({
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
//# sourceMappingURL=foureyeprinciple.js.map