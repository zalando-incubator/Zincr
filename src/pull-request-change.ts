import { Context } from "probot";
import { TaskConfig } from "./config/tasks"
import { AppConfig } from "./config/app"

import { ITask } from "./interfaces/itask"
import { ChecksCreateParams } from "@octokit/rest";
import { BaseTask } from "./tasks/base";


async function handlePullRequestChange(context: Context) {
  
  // use the legacy zappr config for drop-in replacement support
  const cfg = await context.config(AppConfig.configfile, TaskConfig);
  const CHECKNAME = AppConfig.checkname;
  const tasksToRun = Object.keys(cfg);

  const pullRequest = context.payload.pull_request;
  const issue = context.issue();

  // if there is no pull request or the state is not open, no reason to continue
  if (!pullRequest || pullRequest.state !== "open") return;

  const repo = context.repo();
  const { sha } = context.payload.pull_request.head;

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
      title: `Processing ${tasksToRun.length} checks`,
      summary: ''
    }
  });
  
  // Find all tasks which are listed in the config and run them with the context of this config
  const results = new Array<ITask>();
  for(const task of tasksToRun){

    try{
    // The 2019 winner of the most wonderful syntax award... 
    var t : BaseTask = new ((await import("./tasks/" + task)).default)();
    
    if(t !== null){
      await t.run(context, cfg[task]);
      results.push(t);
    }
    }catch(ex){
      console.log(ex);
    }
  }

  // based on the above tasks, build a check result
  const failedTasks = results.filter(x => x.summary().Failure.length > 0);
  const warningTasks = results.filter(x => x.summary().Warning.length > 0 && x.summary().Failure.length == 0);
  const successTasks = results.filter(x => x.summary().Warning.length == 0 && x.summary().Failure.length == 0);

  let checkResult : ChecksCreateParams = {
    ...checkInfo,
    status: "completed",
    conclusion: (failedTasks.length==0) ? "success" : "action_required",
    completed_at: new Date().toISOString(),
    output: {
      title: `Found ${failedTasks.length} problems,  ${warningTasks.length} warnings`,
      summary: '',
      text: ''
    }
  };
  
  if(warningTasks.length + failedTasks.length > 0){
    
    var summary = [];    
    for(const result of failedTasks){
      summary.push(`❌ ${result.name}`);
    }
    for(const result of warningTasks){
      summary.push(`⚠️ ${result.name}`);
    }
    for(const result of successTasks){
      summary.push(`✅ ${result.name}`);
    }

    summary.push("");
    summary.push("Details on how to resolve provided below");

    var resolutions = [];
    var comments = [];
    for(const result of failedTasks){
      resolutions.push(result.render());

      if(result.postAsComment){
        comments.push(result.render());
      }
    }

    for(const result of warningTasks){
      resolutions.push(result.render());

      if(result.postAsComment){
        comments.push(result.render());
      }
    }

    checkResult.output!.summary = summary.join('\n');
    checkResult.output!.text = resolutions.join('\n');


    //section for providing guidance as a comment on the P
    const issue_comments = await context.github.issues.listComments(issue);
    const comment = issue_comments.data.find(comment => comment.user.login === AppConfig.appname + "[bot]");

    if(comments.length > 0){
      const body = comments.join('\n');
      
      if(comment){
        await context.github.issues.updateComment({ ...issue, comment_id: comment.id, body: body });
      }else{
        await context.github.issues.createComment({ ...issue, body: body });
      }

    }else if(comment){
      // this likely won't work... 
      await context.github.issues.deleteComment({ ...issue, comment_id: comment.id });
    }
  }

  return context.github.checks.create(checkResult);
}

module.exports = handlePullRequestChange;