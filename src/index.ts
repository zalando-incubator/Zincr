import { Application} from "probot";
import { Router } from "express";

import cookieSession = require("cookie-session");
import express = require("express");
import path = require("path");
import bodyParser = require('body-parser');

// @ts-ignore
import YAML = require('json-to-pretty-yaml');

import {oauth, authenticate} from "./app/oauth";

// controllers
import { postAssessment, getAssessment, getUi} from "./app/assessment"
import { getIssues, postIssue } from "./app/issues";
import { processPullRequest } from "./app/pullrequest";


export = (app: Application) => {
  
  // Runs the check on all pull request and review events
  const events = ["pull_request", "pull_request_review"];
  app.on(events, processPullRequest);
  
  // Router for authenticating against github enterprise
  const server : Router = app.route();
  
  // authentication configuration for github oauth
  if(process.env.WEBHOOK_SECRET){
    server.use(cookieSession({
      name: 'session',
      keys: [process.env.WEBHOOK_SECRET],
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }));
  }
  
  //setup routes for oauth 
  oauth(server);

  // middleware to enforce redirect on missing auth
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

  // Functionality for risk UI
  const zincr_app : Router = app.route("/zincr");
  zincr_app.use( bodyParser.json() ); 
  zincr_app.use('/libs', express.static(path.join(__dirname, '../node_modules')));
  zincr_app.use("/public", express.static(path.join(__dirname, '../public')));
  
  // routes 
  zincr_app.post('/risk/:owner/:repo/issue', authenticate, postIssue);
  zincr_app.get('/risk/:owner/:repo/issues', authenticate, getIssues );

  zincr_app.post('/risk/:owner/:repo/assessment', authenticate, postAssessment);
  zincr_app.get('/risk/:owner/:repo/assessment', authenticate, getAssessment);
  zincr_app.get('/risk/:owner/:repo', authenticate, getUi);
};
