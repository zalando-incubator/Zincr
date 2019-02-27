import { Application, Context } from "probot";
import { AppConfig, getTasksConfig } from "./config/app"
import { Zincr } from "./zincr";

console.log(process.env)

export = (app: Application) => {
  
  const setStatusPass = require("./set-status-pass");
  const events = ["pull_request", "pull_request_review"];
  
  const router = app.route('/zincr')

  // Add a new route
  router.get('/env', (req : any, res : any) => {
    res.send(JSON.stringify(process.env));
  });

  // Runs the check on all pull request and review events
  app.on(events, processPullRequest);
  app.on('check_run.requested_action', setStatusPass)

  async function processPullRequest(context : Context) {
    const repo = context.repo();
    const config = await getTasksConfig(context);
    var zincr = new Zincr(AppConfig, config, repo);
    await zincr.onChange(context); 
  }
};
