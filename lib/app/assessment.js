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
var octokit_1 = require("./octokit");
//@ts-ignore
var YAML = require("json-to-pretty-yaml");
//@ts-ignore
var yamltojs = require("js-yaml");
var ghe_host = process.env.GHE_HOST;
var rr_branch = "rapid-risk";
//const master_branch = "master";
var rr_file = "risks.md";
function ensureBranch(branch) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
function createOrUpdatePr(branch, risks) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // get all PRs from rapid-risk branch
            // create or update PR with correct desription.
            return [2 /*return*/, { data: "meh" }];
        });
    });
}
function getRiskFile(octokit, repo, branch) {
    if (branch === void 0) { branch = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var req, response, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    req = __assign({ path: rr_file }, repo);
                    if (branch !== '') {
                        //@ts-ignore
                        req.ref = branch;
                    }
                    return [4 /*yield*/, octokit.repos.getContents(req)];
                case 1:
                    response = _a.sent();
                    if (response.status === 200) {
                        return [2 /*return*/, response.data];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    ex_1 = _a.sent();
                    console.log(ex_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
;
function updateRiskFile(content, sha, octokit, repo, branch) {
    return __awaiter(this, void 0, void 0, function () {
        var yaml, ex_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    yaml = Buffer.from(YAML.stringify(content)).toString('base64');
                    return [4 /*yield*/, octokit.repos.updateFile(__assign({}, repo, { path: rr_file, sha: sha, content: yaml, message: "updated risk file", branch: branch }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    ex_2 = _a.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
;
function postAssessment(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var octokit, gh_repo, branched_riskFile, pr, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(req.session && ghe_host)) return [3 /*break*/, 11];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    octokit = octokit_1.getOctokit(ghe_host, req.session.token);
                    gh_repo = { owner: req.params.owner, repo: req.params.repo };
                    return [4 /*yield*/, getRiskFile(octokit, gh_repo, rr_branch)];
                case 2:
                    branched_riskFile = _a.sent();
                    if (!!branched_riskFile) return [3 /*break*/, 5];
                    return [4 /*yield*/, ensureBranch(rr_branch)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, updateRiskFile(req.body, "null", octokit, gh_repo, rr_branch)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, updateRiskFile(req.body, branched_riskFile.sha, octokit, gh_repo, rr_branch)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [4 /*yield*/, createOrUpdatePr(rr_branch, req.body)];
                case 8:
                    pr = _a.sent();
                    res.sendStatus(200).send(pr.data);
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _a.sent();
                    // It threw an error so they can't see the repo
                    res.send(err_1);
                    return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 12];
                case 11:
                    res.send("no session");
                    _a.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.postAssessment = postAssessment;
;
function getAssessment(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var octokit, gh_repo, riskFile, content, ex_3, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(req.session && ghe_host)) return [3 /*break*/, 10];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    octokit = octokit_1.getOctokit(ghe_host, req.session.token);
                    gh_repo = { owner: req.params.owner, repo: req.params.repo };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, getRiskFile(octokit, gh_repo, rr_branch)];
                case 3:
                    riskFile = _a.sent();
                    if (!!riskFile) return [3 /*break*/, 5];
                    return [4 /*yield*/, getRiskFile(octokit, gh_repo)];
                case 4:
                    riskFile = _a.sent();
                    _a.label = 5;
                case 5:
                    if (!riskFile) {
                        riskFile = {};
                    }
                    content = yamltojs.safeLoad(new Buffer(riskFile.content, 'base64').toString('ascii'));
                    res.status(200).send(content);
                    return [3 /*break*/, 7];
                case 6:
                    ex_3 = _a.sent();
                    res.status(500).send(ex_3);
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_2 = _a.sent();
                    // It threw an error so they can't see the repo
                    res.status(500).send(err_2);
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 11];
                case 10:
                    res.send("no session");
                    _a.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.getAssessment = getAssessment;
;
function getUi(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var octokit, gh_repo, repo, ex_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(req.session && ghe_host)) return [3 /*break*/, 5];
                    octokit = octokit_1.getOctokit(ghe_host, req.session.token);
                    gh_repo = { owner: req.params.owner, repo: req.params.repo };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, octokit.repos.get(__assign({}, gh_repo))];
                case 2:
                    repo = _a.sent();
                    res.render("../../../views/risky.hbs", { repo: repo.data });
                    return [3 /*break*/, 4];
                case 3:
                    ex_4 = _a.sent();
                    res.status(500).send(ex_4);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    res.send("no session");
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getUi = getUi;
//# sourceMappingURL=assessment.js.map