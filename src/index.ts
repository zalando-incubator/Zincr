import { Application, Context } from "probot";
import { AppConfig, getTasksConfig } from "./config/app"
import { Zincr } from "./zincr";
import { IAppParams } from "./interfaces/params/iappparams";

console.log(process.env);

export = (app: Application) => {
  
  const setStatusPass = require("./set-status-pass");
  const events = ["pull_request", "pull_request_review"];
  
  // This is used to debug passing of ENV variables to the docker image and should be included in production as it leasks secrets
  //const router = app.route('/zincr')
  // Add a new route
  //router.get('/env', (req : any, res : any) => {
  //  res.send(JSON.stringify(process.env));
  //});

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
};
