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
var _this = this;
var app_1 = require("./config/app");
var zincr_1 = require("./zincr");
var cookieSession = require("cookie-session");
var oauth_1 = require("./auth/oauth");
var github_1 = require("probot/lib/github");
console.log(process.env);
module.exports = function (app) {
    var setStatusPass = require("./set-status-pass");
    var events = ["pull_request", "pull_request_review"];
    // Runs the check on all pull request and review events
    app.on(events, processPullRequest);
    app.on('check_run.requested_action', setStatusPass);
    function processPullRequest(context) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, zincr;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            repo: context.repo(),
                            organization: null
                        };
                        return [4 /*yield*/, app_1.getTasksConfig(context)];
                    case 1:
                        params = (_a.taskconfig = _b.sent(),
                            _a.appconfig = app_1.AppConfig,
                            _a);
                        if (context.payload.repository.organization && context.payload.repository.organization.login) {
                            params.organization = context.payload.repository.organization.login;
                        }
                        zincr = new zincr_1.Zincr(params);
                        return [4 /*yield*/, zincr.onChange(context)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    // Functionality for risky UI and auth against GHE
    var server = app.route();
    //const client_id = process.env.CLIENT_ID;
    //const client_secret = process.env.CLIENT_SECRET;
    var ghe_host = process.env.GHE_HOST;
    function authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!req.session || !req.session.token) {
                    req.session = {};
                    req.session.redirect = req.originalUrl;
                    res.redirect('/github/login');
                }
                else {
                    next();
                }
                return [2 /*return*/];
            });
        });
    }
    if (process.env.WEBHOOK_SECRET) {
        server.use(cookieSession({
            name: 'session',
            keys: [process.env.WEBHOOK_SECRET],
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        }));
    }
    oauth_1.oauth(server);
    server.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var gh, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!req.session) return [3 /*break*/, 3];
                    if (!req.session.token) return [3 /*break*/, 3];
                    return [4 /*yield*/, app.auth()];
                case 1:
                    gh = _b.sent();
                    gh.authenticate({ type: 'token', token: req.session.token });
                    if (!!req.session.login) return [3 /*break*/, 3];
                    _a = req.session;
                    return [4 /*yield*/, gh.users.getAuthenticated({})];
                case 2:
                    _a.login = (_b.sent()).data.login;
                    _b.label = 3;
                case 3:
                    next();
                    return [2 /*return*/];
            }
        });
    }); });
    server.get('/risky/:owner/:repo', authenticate, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var octokit, gh_repo, repo, riskFile, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(req.session && ghe_host)) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    octokit = github_1.GitHubAPI({
                        baseUrl: "https://" + ghe_host + "/api/v3",
                        logger: {
                            debug: function () { },
                            info: function () { },
                            warn: console.warn,
                            error: console.error
                        },
                    });
                    octokit.authenticate({ type: 'token', token: req.session.token });
                    gh_repo = { owner: req.params.owner, repo: req.params.repo };
                    return [4 /*yield*/, octokit.repos.get(gh_repo)];
                case 2:
                    repo = _a.sent();
                    return [4 /*yield*/, octokit.repos.getContents(__assign({ path: "risks.md" }, gh_repo))];
                case 3:
                    riskFile = _a.sent();
                    //todo, parse and process the risk file
                    res.render("../../../views/risky", { repo: repo.data, risks: riskFile.data });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    // It threw an error so they can't see the repo
                    res.send(err_1);
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    res.send("no session");
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); });
    /*
    server.get('/login', async (req, res) => {
      const querystring = require('querystring');
      
      //get needed values
      const client_id = process.env.CLIENT_ID;
      const ghe_host = process.env.GHE_HOST;
  
      if(!client_id || !ghe_host)
        return;
  
      // GitHub needs us to tell it where to redirect users after they've authenticated
      const protocol = req.headers['x-forwarded-proto'] || req.protocol
      const host = req.headers['x-forwarded-host'] || req.get('host')
    
      const params = querystring.stringify({
        client_id: client_id,
        redirect_uri: `${protocol}://${host}/login/cb`
      })
    
      const url = `https://${ghe_host}/login/oauth/authorize?${params}`
      res.redirect(url)
    });
    */
};
//# sourceMappingURL=index.js.map