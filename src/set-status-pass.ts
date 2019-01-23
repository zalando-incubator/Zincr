import { Context } from "probot";
import { AppConfig } from "./config/app"


async function setStatusPass (context : Context) {

  const repo = context.repo();
  const { sha } = context.payload.pull_request.head;
  const checkInfo = {
    owner: repo.owner,
    repo: repo.repo,
    name: AppConfig.checkname,
    head_sha: sha};
  
  return context.github.checks.create({
      ...checkInfo,
      status: "completed",
      conclusion: 'success',
      completed_at: new Date().toISOString(),
      output: {
        title: AppConfig.checkname,
        summary: 'Check was manually approved.'
      }
    });
}

module.exports = setStatusPass;