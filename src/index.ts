import { Application } from "probot";


export = (app: Application) => {
  // Your code here
  app.log("Yay, the app was loaded!");

  const handlePullRequest = require("./pull-request-change");
  const setStatusPass = require("./set-status-pass");

  app.on(
    [
      "pull_request", "pull_request_review"
    ],
    handlePullRequest
  );

  app.on('check_run.requested_action', setStatusPass)

  
};
