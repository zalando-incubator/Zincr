import { Context } from "probot";
import { ChecksCreateParams } from "@octokit/rest";
import { TaskRunner } from "./task-runner";
import { IconEnum } from "./interfaces/IconEnum";
import { ITaskConfig } from "./interfaces/config/itaskconfig";
import { IAppConfig } from "./interfaces/config/iappconfig";

export class Zincr {
  appconfig: IAppConfig;
  taskconfig: ITaskConfig;
  repo: { repo: string; owner: string };
  runner: TaskRunner;
  organization: string | undefined;

  constructor(
    appconfig: IAppConfig,
    taskconfig: ITaskConfig,
    repo: { repo: string; owner: string },
    organization: string | undefined
  ) {
    this.appconfig = appconfig;
    this.taskconfig = taskconfig;
    this.repo = repo;
    this.organization = organization;
    this.runner = new TaskRunner(this.appconfig, this.taskconfig, this.repo, this.organization);
  }

  async onChange(context: Context) {
    // use the legacy zappr config for drop-in replacement support
    //const cfg = await getTasksConfig(context);
    const CHECKNAME = this.appconfig.checkname;
    const pullRequest = context.payload.pull_request;
    const event = context.event;
    const issue = context.issue();
    const { sha } = context.payload.pull_request.head;

    const _plural = function(
      plural: string,
      singular: string,
      count: number
    ): string {
      if (count === 1) {
        return singular;
      } else {
        return plural;
      }
    };

    // if there is no pull request or the state is not open, no reason to continue
    if (!pullRequest || pullRequest.state !== "open") return;

    // no need to rerun checks when a review is requested..
    if (
      event == "pull_request" &&
      context.payload.action === "review_requested"
    )
      return;

    // if this a dimissal of a review, we already handling this elsewhere.
    if (
      event === "pull_request_review" &&
      context.payload.action === "dismissed"
    )
      return;

    const checkInfo = {
      owner: this.repo.owner,
      repo: this.repo.repo,
      name: CHECKNAME,
      head_sha: sha
    };

    // In progress feedback
    await context.github.checks.create({
      ...checkInfo,
      status: "in_progress",
      output: {
        title: `Processing ${this.runner.tasks.length} ${_plural(
          "checks",
          "check",
          this.runner.tasks.length
        )}`,
        summary: ""
      }
    });

    // Find all tasks which are listed in the config and run them with the context of this config
    var result = await this.runner.run(context);

    let checkResult: ChecksCreateParams = {
      ...checkInfo,
      status: "completed",
      conclusion: result.Failure.length == 0 ? "success" : "action_required",
      completed_at: new Date().toISOString(),
      output: {
        title: `Found ${result.Failure.length} ${_plural(
          "problems",
          "problem",
          result.Failure.length
        )},  ${result.Warning.length} ${_plural(
          "warnings",
          "warning",
          result.Failure.length
        )}`,
        summary: "",
        text: ""
      }
    };

    var summary = [];
    for (const r of result.Failure) {
      summary.push(`    ${IconEnum.Failure} ${r.name}`);
    }
    for (const r of result.Warning) {
      summary.push(`    ${IconEnum.Warning} ${r.name}`);
    }
    for (const r of result.Success) {
      summary.push(`    ${IconEnum.Success} ${r.name}`);
    }

    if (result.Warning.length + result.Failure.length > 0) {
      summary.push("");
      summary.push("Details on how to resolve are provided below");
      summary.push("");
      summary.push("----");
      summary.push("");
    }

    var resolutions = [];
    var comments = [];

    comments.push(
      `## 🤖 ${this.appconfig.appname} found ${result.Failure.length} ${_plural(
        "problems",
        "problem",
        result.Failure.length
      )} ,  ${result.Warning.length} ${_plural(
        "warnings",
        "warning",
        result.Warning.length
      )}`
    );
    comments.push(summary.join("\n"));
    comments.push("");

    for (const r of result.Failure) {
      resolutions.push(r.render());
      comments.push(r.render());
    }

    for (const r of result.Warning) {
      resolutions.push(r.render());
      comments.push(r.render());
    }

    for (const r of result.Success) {
      resolutions.push(r.render());
    }

    checkResult.output!.summary = summary.join("\n");
    checkResult.output!.text = resolutions.join("\n");

    //section for providing guidance as a comment on the P
    const issue_comments = await context.github.issues.listComments(issue);
    const comment = issue_comments.data.find(
      comment => comment.user.login === this.appconfig.appname + "[bot]"
    );
    const body = comments.join("\n");

    if (comment) {
      await context.github.issues.updateComment({
        ...issue,
        comment_id: comment.id,
        body: body
      });
    } else {
      await context.github.issues.createComment({ ...issue, body: body });
    }

    await context.github.checks.create(checkResult);
  }

  async setStatusPass (context : Context) {

    const { sha } = context.payload.pull_request.head;
    const checkInfo = {
      owner: this.repo.owner,
      repo: this.repo.repo,
      name: this.appconfig.checkname,
      head_sha: sha};
    
    return context.github.checks.create({
        ...checkInfo,
        status: "completed",
        conclusion: 'success',
        completed_at: new Date().toISOString(),
        output: {
          title: this.appconfig.checkname,
          summary: 'Check was manually approved.'
        }
      });
  }

 
}
