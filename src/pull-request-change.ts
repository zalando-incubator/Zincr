import { Context } from "probot";
import { GetResponse } from "@octokit/rest";
import { Config } from "./config"

async function handlePullRequestChange(context: Context) {
  
  const cfg = await context.config(".github/4eys.yml", Config);

  if(!cfg)
    return; 
  
  const pullRequest = await getPullRequest(context);

  // if there is no pull request or the state is not open, no reason to continue
  if (!pullRequest || pullRequest.state !== "open") return;

  // get current approvals
  const approvals = await getReviewsWithState(context, "approved");

  //if we already have 4 eyes on this, no reason to continue
  if (approvals >= 2) return;

  //get org and repo name
  const org = pullRequest!.base!.repo!.owner!.login;
  const repo = pullRequest!.base!.repo!.name;

  // determine if the PR author is a member of the org
  let isOrgMember = false;
  try {
    const isMemberOfRepositoryOrganisation = await context.github.orgs.getOrgMembership(
      {
        org: org,
        username: pullRequest!.user!.login + "asdsadd"
      }
    );

    if (
      isMemberOfRepositoryOrganisation.data &&
      isMemberOfRepositoryOrganisation.data.state === "active"
    ) {
      isOrgMember = true;
    }
  } catch (ex) {
    isOrgMember = false;
  }

  if (isOrgMember) {
    const approved = approvals >= cfg.internal.numberOfReviews;
    const desc = approved ? cfg.internal.success : cfg.internal.error;
    const conclusion = approved ? "completed" : "action_required";


    return context.github.checks.create({
      owner: org,
      repo: repo,
      name: 'Review of internal pull request',
      head_sha: pullRequest!.head!.sha,
      status: 'completed',
      conclusion: conclusion,
      completed_at: new Date().toISOString(),
      output: {
        title: `${cfg.internal.numberOfReviews} code review(s) required`,
        summary: desc
      }
    })
    
  } else {
    const approved = approvals >= cfg.internal.numberOfReviews;
    const desc = approved ? cfg.external.success : cfg.external.error;
    const conclusion = approved ? "completed" : "action_required";

    return context.github.checks.create({
      owner: org,
      repo: repo,
      name: 'Review of external pull request',
      head_sha: pullRequest!.head!.sha,
      status: 'completed',
      conclusion: conclusion,
      completed_at: new Date().toISOString(),
      output: {
        title: `${cfg.external.numberOfReviews} code review(s) required`,
        summary: desc
      }
    })
  }
}

async function getPullRequest(context: Context): Promise<GetResponse> {
  const response = await context.github.pullRequests.get({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    number: context.payload.pull_request.number
  });

  return response.data;
}

async function getReviewsWithState(context: Context, state: String) {
  const response = await context.github.pullRequests.getReviews({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    number: context.payload.pull_request.number
  });

  return response.data
    .map(review => review.state)
    .filter(word => word.toLowerCase() === state).length;
}

module.exports = handlePullRequestChange;
