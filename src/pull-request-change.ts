import { Context } from "probot";
import { AppConfig, getTasksConfig } from "./config/app"
import { ChecksCreateParams } from "@octokit/rest";
import { TaskRunner } from "./task-runner";


async function handlePullRequestChange(context: Context) {
  
  // use the legacy zappr config for drop-in replacement support
  const cfg = await getTasksConfig(context);
  const CHECKNAME = AppConfig.checkname;
  
  const pullRequest = context.payload.pull_request;
  const event = context.event;
  const issue = context.issue();

  // if there is no pull request or the state is not open, no reason to continue
  if (!pullRequest || pullRequest.state !== "open") return;

  // no need to rerun checks when a review is requested..
  if(event == "pull_request" && context.payload.action === 'review_requested') return;

  // if this a dimissal of a review, we already handling this elsewhere.
  if(event === "pull_request_review" && context.payload.action === "dismissed") return;

  const repo = context.repo();
  const { sha } = context.payload.pull_request.head;
  
  const runner = new TaskRunner(AppConfig, cfg, repo);
  const checkInfo = {
    owner: repo.owner,
    repo: repo.repo,
    name: CHECKNAME,
    head_sha: sha};
  

  // In progress feedback
  await context.github.checks.create({
    ...checkInfo,
    status: "in_progress",
    output: {
      title: `Processing ${runner.tasks.length} checks`,
      summary: ''
    }
  });
  
  // Find all tasks which are listed in the config and run them with the context of this config
  var result = await runner.run(context);

  let checkResult : ChecksCreateParams = {
    ...checkInfo,
    status: "completed",
    conclusion: (result.Failure.length==0) ? "success" : "action_required",
    completed_at: new Date().toISOString(),
    output: {
      title: `Found ${result.Failure.length} problems,  ${result.Warning.length} warnings`,
      summary: '',
      text: ''
    }
  };
  
    var summary = [];    
    for(const r of result.Failure){
      summary.push(`- ❌ ${r.name}`);
    }
    for(const r of result.Warning){
      summary.push(`- ⚠️ ${r.name}`);
    }
    for(const r of result.Success){
      summary.push(`- ✅ ${r.name}`);
    }

    if(result.Warning.length + result.Failure.length > 0){
      summary.push("");
      summary.push("Details on how to resolve provided below");
    }

    var resolutions = [];
    var comments = [];

    comments.push(`### 🤖 ${AppConfig.appname} found ${result.Failure.length} problems,  ${result.Warning.length} warnings`);
    comments.push(summary.join('\n'));  
    comments.push("");

    for(const r of result.Failure){
      resolutions.push(r.render());
      comments.push(r.render());
    }

    for(const r of result.Warning){
      resolutions.push(r.render());
      comments.push(r.render());
    }
    for(const r of result.Success){
      resolutions.push(r.render());
    }

    checkResult.output!.summary = summary.join('\n');
    checkResult.output!.text = resolutions.join('\n');

    //section for providing guidance as a comment on the P
    const issue_comments = await context.github.issues.listComments(issue);
    const comment = issue_comments.data.find(comment => comment.user.login === AppConfig.appname + "[bot]");
    const body = comments.join('\n'); 
     
    if(comment){
      await context.github.issues.updateComment({ ...issue, comment_id: comment.id, body: body });
    }else{
      await context.github.issues.createComment({ ...issue, body: body });
    }

  return context.github.checks.create(checkResult);
}

module.exports = handlePullRequestChange;