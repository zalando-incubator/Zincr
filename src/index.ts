import { Application, Context } from "probot";
import { AppConfig, getTasksConfig } from "./config/app"
import { Zincr } from "./zincr";
import { IAppParams } from "./interfaces/params/iappparams";
import { Router, Request, Response } from "express";
import cookieSession = require("cookie-session");
import {oauth} from "./auth/oauth";
import { GitHubAPI } from "probot/lib/github";

console.log(process.env);

export = (app: Application) => {
  const setStatusPass = require("./set-status-pass");
  const events = ["pull_request", "pull_request_review"];
  
  // Runs the check on all pull request and review events
  app.on(events, processPullRequest);
  app.on('check_run.requested_action', setStatusPass)

  async function processPullRequest(context : Context) {
    
    const params : IAppParams = {
      repo: context.repo(),
      organization: null,
      taskconfig: await getTasksConfig(context), 
      appconfig: AppConfig
    };

    if(context.payload.repository.organization && context.payload.repository.organization.login){
      params.organization = context.payload.repository.organization.login;
    }

    var zincr = new Zincr(params);
    await zincr.onChange(context); 
  }

  // Functionality for risky UI and auth against GHE
  const server : Router = app.route();
  //const client_id = process.env.CLIENT_ID;
  //const client_secret = process.env.CLIENT_SECRET;
  const ghe_host = process.env.GHE_HOST;
  
  async function authenticate (req : Request, res : Response, next : Function) {
    if (!req.session || !req.session.token) {
      req.session = {}
      req.session.redirect = req.originalUrl
      res.redirect('/github/login')
    } else {
      next()
    }
  }

  if(process.env.WEBHOOK_SECRET){
    server.use(cookieSession({
      name: 'session',
      keys: [process.env.WEBHOOK_SECRET],
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }));
  }
  
  oauth(server);

  server.use(async (req, res, next) => {
    if(req.session){
    
    if (req.session.token) {

      var gh = await app.auth()
      gh.authenticate({ type: 'token', token: req.session.token })
      
      if (!req.session.login) {
        req.session.login = (await gh.users.getAuthenticated({})).data.login
      }

    }
    }
    next()
  })

  server.get('/risky/:owner/:repo', authenticate, async (req, res) => {
    if(req.session && ghe_host){

      try {

      const octokit = GitHubAPI({
        baseUrl: `https://${ghe_host}/api/v3`,
        logger: {
          debug: () => {},
          info: () => {},
          warn: console.warn,
          error: console.error
        },
      });
      octokit.authenticate({ type: 'token', token: req.session.token });
      
      // If this doesn't throw, they can see the repo
      const gh_repo = {owner: req.params.owner, repo: req.params.repo };
      const repo = await octokit.repos.get(gh_repo);
      const riskFile = await octokit.repos.getContents({ path: "risks.md", ...gh_repo });
      
      //todo, parse and process the risk file

      res.render("../../../views/risky", {repo: repo.data, risks: riskFile.data});

      } catch (err) {
        // It threw an error so they can't see the repo
        res.send(err);
      }

      
      //res.send(`Hey, you made it! - Repo: ${req.params.owner}/${req.params.repo} user:` + req.session.login);
    }else{
      res.send("no session");
    }
  });

  
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
