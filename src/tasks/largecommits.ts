import { Context } from "probot";
import { BaseTask } from "./base";
import { StatusEnum } from "../interfaces/StatusEnum";
import { IAppConfig } from "../interfaces/config/iappconfig";
import { PullRequestsListFilesResponse } from "@octokit/rest";

export default class LargeCommits extends BaseTask<any> { 

  constructor(appconfig : IAppConfig, config : any, repo: {repo: string, owner: string}, organization: string | undefined) {
    super(appconfig, config, repo, organization); 
    
    this.name = "Large Commits";  
    this.description =  "Checks all commits for large additions to a single file. Large commits should be reviewed more carefully for potential copyright and licensing issues";  
    this.resolution = `This file contains a substantial change, please review to determine if the change comes from an external source and if there are any copyright or licensing issues to be aware of`;
    this.postAsComment = true;
  }

  async run(context: Context){
    let files = await this.getFiles(context);
    var allFiles = files.filter(x => x.additions > this.config.maxLines || x.changes > this.config.maxLines );

    for(const file of allFiles){
      this.result.push({
        label: `[${file.filename}](/${file.blob_url}) had +${this.config.maxLines} lines of code changed in a single commit`,
        result: StatusEnum.Warning,
        description: "Please review this file to determine the source of this change"
      });
    }
    
    return true;
  }

  unique = (value : any, index : number, self : Array<any>) => {
    return self.indexOf(value) === index;
  }

  async getFiles(context: Context) : Promise<PullRequestsListFilesResponse> {

    const response = await context.github.pullRequests.listFiles({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      number: context.payload.pull_request.number
    });
    
    return response.data;
  }

  async getOrgMembershipStatus(org: string, login: string, context : Context){
    let isOrgMember = false;
  
    try {
      const isMemberOfRepositoryOrganisation = await context.github.orgs.getMembership(
        {
          org: org,
          username: login
        }
      );
  
      if (
        isMemberOfRepositoryOrganisation.data &&
        isMemberOfRepositoryOrganisation.data.state === "active"
      ) {
        isOrgMember = true;
      }
  
    } catch (ex) {
      // if the request fails, the member is not found.. 
      isOrgMember = false;
    }
  
    return isOrgMember;
  }
}