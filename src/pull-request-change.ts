import { Context } from "probot";
import { Config } from "./config"
import { ITask } from "./interfaces/itask"
import { ChecksCreateParams } from "@octokit/rest";
import { BaseTask } from "./tasks/base";

async function handlePullRequestChange(context: Context) {
  
  // use the legacy zappr config for drop-in replacement support
  const cfg = await context.config("./zappr.yml", Config);
  const CHECKNAME = "4eyes-bot";
  const tasksToRun = Object.keys(cfg);

  const pullRequest = context.payload.pull_request;

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
    }catch{
      
    }
  }

  // based on the above tasks, build a check result
  const failedTasks = results.filter(x => !x.success());
  let checkResult : ChecksCreateParams = {
    ...checkInfo,
    status: "completed",
    conclusion: (failedTasks.length==0) ? "success" : "action_required",
    completed_at: new Date().toISOString(),
    output: {
      title: "All checks have passed",
      summary: '',
      text: ''
    }
  };
  
  if(failedTasks.length > 0){
    checkResult.output!.title = `${failedTasks.length} checks out of ${results.length} failed`;
    
    var summary = [];
    
    for(const result of results){
      summary.push(`${ result.success() ? '✅' : '❌' } ${result.name}`);
    }
    summary.push("");
    summary.push("Details on how to resolve provided below");

    var resolutions = [];
    for(const result of failedTasks){

      resolutions.push(`### Task: ${result.name} failed`);
      resolutions.push(`${result.description}`);

      resolutions.push(`#### Resolution`);
      resolutions.push(`${result.resolution}`); 

      if(result.result){
        resolutions.push("#### Details");

        for(const subResult of result.result){
          resolutions.push(`${ subResult.success ? '✅' : '❌' } ${subResult.label}`);
        }
      }
    }

    checkResult.output!.summary = summary.join('\n');
    checkResult.output!.text = resolutions.join('\n');
  }

  return context.github.checks.create(checkResult);
}

module.exports = handlePullRequestChange;