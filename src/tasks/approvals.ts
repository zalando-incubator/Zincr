import { Context } from "probot";
import { BaseTask } from "./base";

export default class FourEyePrincipleTask extends BaseTask {
  

  constructor() {
    super();
    
    this.name = "Approvals";  
    this.description =  "Ensures that all contributions are reviewed by 2 Zalando employees";  
    this.resolution = `Please ensure that XXX current employees have reviewed and approved this pull request`;
  }

  async run(context: Context, config: any){
    
    const repo = context.repo();
    const author = context.payload.pull_request.head.user.login;
    const isOrgMember = await this.getOrgMembershipStatus(repo.owner, author, context);

    // get current approvals
    const approvals = await this.getReviewsWithState(context, "approved");
    const requiredApprovals = Math.max(config.internal, config.external, config.minimum);

    if(approvals >= requiredApprovals){
      return true;
    } 

    if(isOrgMember){

      // hack to fallback to old minimum setting and substract one employee
      var requiredInternal = config.minimum == null ? config.internal : config.minimum-1;

      this.result.push({
        label: `${approvals} approvals out of ${requiredInternal} required`,
        success: (approvals >= requiredInternal)
      });

      this.resolution = this.resolution.replace('XXX', requiredInternal.toString());

    }else{

      // take the old minimum setting into account, use whichever number is highest
      var requiredExternal = Math.max(config.minimum,  config.external);

      this.result.push({
        label: `${approvals} approvals out of ${requiredExternal} required`,
        success: (approvals >= requiredExternal)
      });

      this.resolution = this.resolution.replace('XXX', requiredExternal.toString());
    }


    
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