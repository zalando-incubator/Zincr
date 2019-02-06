import { Context } from "probot";
import { BaseTask } from "./base";
import { StatusEnum } from "../interfaces/StatusEnum";
import { IAppConfig } from "../interfaces/config/iappconfig";

export default class LargeCommits extends BaseTask<any> { 

  constructor(appconfig : IAppConfig, config : any, repo: {repo: string, owner: string}) {
    super(appconfig, config, repo); 
    
    this.name = "Large Commits";  
    this.description =  "Checks all commits for large additions to a single file. Large commits should be reviewed more carefully for potential copyright and licensing issues";  
    this.resolution = `This file contains a substantial change, please review to determine if the change comes from an external source and if there are any copyright or licensing issues to be aware of`;
    this.postAsComment = true;
  }

  async run(context: Context){
    
    //const author = context.payload.pull_request.user.login;
    //const isOrgMember = await this.getOrgMembershipStatus(this.repo.owner, author, context);

    let commits = await this.getCommits(context);
    
    var allFiles = commits
                      .map((x: { files: any; }) => x.files);
    
    allFiles = [].concat.apply([], allFiles);
    allFiles = allFiles.filter( file => file.additions > this.config.maxLines || file.changes > this.config.maxLines);
    
    for(const file of allFiles){

      this.result.push({
        label: `[${file.filename}](/${this.repo.owner}/${this.repo.repo}/pull/${context.payload.pull_request.number}/commits/${file.sha}) had +${this.config.maxLines} lines of code changed in a single commit`,
        result: StatusEnum.Warning,
        description: "Please review this commit to determine the source of this change"
      });
    }
    
    return true;
  }

  unique = (value : any, index : number, self : Array<any>) => {
    return self.indexOf(value) === index;
  }

  async getCommits(context: Context) {

    const response = await context.github.pullRequests.listCommits({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      number: context.payload.pull_request.number
    });
    
    var commitReq = response.data.map(async commit => { 
      return (await context.github.repos.getCommit({ sha: commit.sha, repo: context.payload.repository.name, owner: context.payload.repository.owner.login })).data;
    });

    var commitData = await Promise.all(commitReq);
    return commitData;
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