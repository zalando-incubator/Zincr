import { Application, Context } from "probot";
import { AppConfig, getTasksConfig } from "./config/app"
import { Zincr } from "./zincr";

export = (app: Application) => {
  
  const setStatusPass = require("./set-status-pass");
  const events = ["pull_request", "pull_request_review"];
  
  // Runs the check on all pull request and review events
  app.on(events, processPullRequest);
  app.on('check_run.requested_action', setStatusPass)

  async function processPullRequest(context : Context) {
    const repo = context.repo();
    const config = await getTasksConfig(context);
    let org = undefined;
    if(context.payload.repository.organization){
      org = context.payload.repository.organization.login;
    }

    var zincr = new Zincr(AppConfig, config, repo, org);
    await zincr.onChange(context); 
  }
};
