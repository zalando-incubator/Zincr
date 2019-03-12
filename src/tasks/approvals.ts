import { Context } from "probot";
import { BaseTask } from "./base";
import { StatusEnum } from "../interfaces/StatusEnum";
import { ITaskParams } from "../interfaces/params/itaskparams";
import { plural } from "../plural";
import { IApprovalsConfig } from "../interfaces/config/iapprovalsconfig";
export default class FourEyePrincipleTask extends BaseTask<IApprovalsConfig> { 

  constructor(params : ITaskParams<IApprovalsConfig>) {
    super(params); 
    
    this.name = "Approvals";  
    this.description =  "All proposed changes must be reviewed by project maintainers before they can be merged";  
    this.resolution = `Not enough people have approved this pull request - please ensure that XXX additional user(s) who have not contributed to this pull request approve the changes.`;
    this.postAsComment = true;
  }

  async run(context: Context){
    
    const author = context.payload.pull_request.user.login;
    let directCollaborator = false;

    if(this.organization)
      directCollaborator = await this.getOrgMembershipStatus(this.organization, author, context);
    else
      directCollaborator = await this.getRepoMembershipStatus(this.repo.owner, this.repo.repo, author, context);

    var approvals = 0;
   
    // exclude PR co-authors as a valid reviewer - this is an edge case, but it can happen
    // if a reviewer modifies a PR and are then single-handedly able to approve his/hers own code into production. 
    // While this could lead to a review deadlock, this should be avoided by maintainers. 
    let coAuthors = await this.getCommitAuthors(context, author);
    const reviews = await this.getReviews(context, coAuthors, "approved");

    // get current approvals
   
    approvals = reviews.approvals.length;

    if(directCollaborator && this.config.includeAuthor){
      this.result.push({
        label: `Approved by PR author @${author}`,
        result: StatusEnum.Success
      })
      approvals++;
    }

    for(const apr of reviews.approvals){
      this.result.push({
        label: `Approved by team member @${apr}`,
        result: StatusEnum.Success
      })
    }

    if(reviews.contributing.length > 0){
      this.result.push({
        label: `${plural('Approvals', 'Approval', reviews.contributing.length)} from ${reviews.contributing.map(x => "@"+x).join(", ")} was excluded as the pull request contains changes from ${plural('those users', 'this user', reviews.contributing.length)}`,
        result: StatusEnum.Warning
      })
    }

    if(approvals < this.config.minimum){
      var missingApprovals = this.config.minimum - approvals;

      this.result.push({
        label: `${missingApprovals} additional ${plural('approvals', 'approval', missingApprovals)} needed`,
        result: StatusEnum.Failure
      });

      this.resolution = this.resolution.replace('XXX', missingApprovals.toString());
    }

   
    return true;
  }

  unique = (value : any, index : number, self : Array<any>) => {
    return self.indexOf(value) === index;
  }

  async getCommitAuthors(context: Context, pr_author: string) {

    const pr = context.payload.pull_request;
    
    const response = await context.github.repos.compareCommits({
      ...this.repo, base: pr.base.sha, head: pr.head.sha
    });
    /*
    const response = await context.github.pullRequests.listCommits({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      number: context.payload.pull_request.number
    });*/

    // get all contributin users - except where the contribution is made via the suggestion feature, as this is reviwed
    // by the original author before including - so co-authored commits can be exluded
    return response.data.commits
      .filter( (data : any)  => data.commit.message.indexOf(`Co-Authored-By: ${pr_author}`) < 0)
      .filter( (data : any)  => (data.commit.committer.login !== 'Github' && data.commit.message.indexOf(`Merge branch '${pr.base.ref}' into`) < 0))
      .map((commit : any)  => commit.author.login)
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

  async getRepoMembershipStatus(owner: string, repo: string, login: string, context : Context){
    const response = await context.github.repos.getCollaboratorPermissionLevel({owner: owner, repo: repo, username: login });
    const permission = response.data.permission;

    return ( permission === "write" || permission === "admin"); 
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