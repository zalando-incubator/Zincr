import { Context } from "probot";
import { BaseTask } from "./base";
import { StatusEnum } from "../interfaces/StatusEnum";
import { IAppConfig } from "../interfaces/config/iappconfig";


export default class FourEyePrincipleTask extends BaseTask<any> { 

  constructor(appconfig : IAppConfig, config : any, repo: {repo: string, owner: string}) {
    super(appconfig, config, repo); 
    
    this.name = "Approvals";  
    this.description =  "All proposed changes must be reviewed by project maintainers before they can be merged";  
    this.resolution = `Not enough people have approved this pull request - please ensure that atleast XXX users who have not contributed to this pull request approve the changes.`;
    this.postAsComment = true;
  }

  async run(context: Context){
    
    const author = context.payload.pull_request.user.login;
    const isOrgMember = await this.getOrgMembershipStatus(this.repo.owner, author, context);

    var approvals = 0;
    var desc = "";
    // exclude PR co-authors as a valid reviewer - this is an edge case, but it can happen
    // if a reviewer modifies a PR and are then single-handedly able to approve his/hers own code into production. 
    // While this could lead to a review deadlock, this should be avoided by maintainers. 
    let coAuthors = await this.getCommitAuthors(context, author);
    const reviews = await this.getReviews(context, coAuthors, "approved");

    // get current approvals
   
    approvals = reviews.approvals.length;
    if(isOrgMember && this.config.includeAuthor){
      approvals++;
    }

    if(approvals >= this.config.minimum){
      return true;
    } 

    if(reviews.contributing.length > 0){
      desc = `The reviews from ${reviews.contributing.map(x => "@"+x).join(", ")} are excluded as the pull request contains changes from those users`;
    }

    this.result.push({
        label: `${approvals} approvals of ${this.config.minimum} required ${this.config.includeAuthor ? "(Including author of this pull request)" : ""}`,
        result: (approvals >= this.config.minimum) ? StatusEnum.Success : StatusEnum.Failure,
        description: desc
    });

    this.resolution = this.resolution.replace('XXX', this.config.minimum.toString());
    return true;
  }

  unique = (value : any, index : number, self : Array<any>) => {
    return self.indexOf(value) === index;
  }

  async getCommitAuthors(context: Context, pr_author: string) {
    const response = await context.github.pullRequests.listCommits({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      number: context.payload.pull_request.number
    });

    // get all contributin userds - except where the contribution is made via the suggestion feature, as this is reviwed
    // by the original author before including - so co-authored commits can be exluded
    return response.data
      .filter(commit => commit.commit.message.indexOf(`Co-Authored-By: ${pr_author}`) < 0)
      .map(commit  => commit.author.login)
      .filter(this.unique)
  }

  async getReviews(context: Context, coauthors : Array<string>, state : string) : Promise<{approvals: Array<string>, contributing: Array<string>}> {
    
    const response = await context.github.pullRequests.listReviews({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      number: context.payload.pull_request.number
    });
    
    var reviews = response.data
      .filter(x => x.state.toLowerCase() === state);

    const contributingReviews = reviews.filter(review => coauthors.indexOf(review.user.login) >= 0);
    const non_contributingReviews = reviews.filter(review => coauthors.indexOf(review.user.login) < 0);
    
    for (const review of contributingReviews) {

      await context.github.pullRequests.dismissReview({ 
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        number: context.payload.pull_request.number, 
        review_id: review.id ,
        message: `@${review.user.login} is contributing to this pull request and can therefore not review the proposed changes`
      }); 
    }

    return {
              contributing: contributingReviews.map(x => x.user.login).filter(this.unique), 
              approvals: non_contributingReviews.map(x => x.user.login).filter(this.unique)
          };
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