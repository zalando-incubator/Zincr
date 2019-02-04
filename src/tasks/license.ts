import { Context } from "probot";
import { BaseTask } from "./base";
import { PullRequestsGetResponse } from "@octokit/rest";
import { ILicenseConfig } from "../interfaces/config/ilicenseconfig";
import { IAppConfig } from "../interfaces/config/iappconfig";
import Lookup from "../license/lookup";

export default class LicenseTask extends BaseTask<ILicenseConfig> {
    
  constructor(appconfig : IAppConfig, config : ILicenseConfig, repo: {repo: string, owner: string}) {
    super(appconfig, config, repo); 

    this.name = "Dependency Licensing";  
    this.description =  "All dependencies specified in package manager files must be reviewed, banned dependency licenses will block the merge, all new dependencies introduced in this pull request will give a warning, but not block the merge";
    this.resolution = `Please ensure that only dependencies with licenses compatible with the license of this project is included in the pull request.`;
    this.postAsComment = true;
  }

  async checkComments(context : Context, pull : any) {
    const comments = await context.github.issues.listComments(pull);
    const comment = comments.data.find(
      comment => comment.user.login === process.env.APP_NAME + "[bot]"
    );

    return comment;
  }
  
  async run(context: Context){

    const pullRequest : PullRequestsGetResponse = context.payload.pull_request;
    
    //do the license lookup
    var lookup = new Lookup(this.config, context);
    this.result = await lookup.run(this.repo, pullRequest.base.ref, pullRequest);
  
    return true;
  }
}




