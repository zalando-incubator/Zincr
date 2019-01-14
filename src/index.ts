import { Application } from "probot";


export = (app: Application) => {
  // Your code here
  app.log("Yay, the app was loaded!");

  const handlePullRequest = require("./pull-request-change");
  
  app.on(
    [
      "pull_request"
    ],
    handlePullRequest
  );
};
