import { Context } from "probot";
import { BaseTask } from "./base";
import { StatusEnum } from "../interfaces/StatusEnum";

export default class FourEyePrincipleTask extends BaseTask {
  

  constructor() {
    super();
    
    this.name = "Approvals";  
    this.description =  "Pull request must be reviewed";  
    this.resolution = `Please ensure that XXX have reviewed this pull request and approve of the change`;
  }

  async run(context: Context, config: any){
    
    const repo = context.repo();
    const author = context.payload.pull_request.head.user.login;
    const isOrgMember = await this.getOrgMembershipStatus(repo.owner, author, context);

    // get current approvals
    let approvals = await this.getReviewsWithState(context, "approved");
    if(isOrgMember && config.includeAuthor){
      approvals++;
    }

    if(approvals >= config.minimum){
      return true;
    } 

    this.result.push({
        label: `${approvals} approvals of ${config.minimum} required`,
        result: (approvals >= config.minimum) ? StatusEnum.Success : StatusEnum.Failure
    });

    this.resolution = this.resolution.replace('XXX', config.minimum.toString());
    return true;
  }

  async getReviewsWithState(context: Context, state: String) {
    const response = await context.github.pullRequests.listReviews({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      number: context.payload.pull_request.number
    });
  
    return response.data
      .map(review  => review.state)
      .filter(word => word.toLowerCase() === state).length;
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