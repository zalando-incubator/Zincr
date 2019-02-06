import { Application } from "probot";


export = (app: Application) => {
  
  const handlePullRequest = require("./pull-request-change");
  const setStatusPass = require("./set-status-pass");

  app.router
  // Runs the check on all pull request and review events
  app.on(
    [
      "pull_request", "pull_request_review"
    ],
    handlePullRequest
  );

  app.on('check_run.requested_action', setStatusPass)
};
