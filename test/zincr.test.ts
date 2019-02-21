import nock = require("nock");
import { Zincr } from "../src/zincr";
import { AppConfig } from "../src/config/app";
import { ChecksUpdateResponse } from "@octokit/rest";
import { Probot, Application, Context } from "probot";

const payload = require("./fixtures/pr/opened.json");
//const checkCreated = require("./fixtures/check/in-progress.json");

nock.disableNetConnect();
jest.setTimeout(10000);

describe("zincr", () => {
  test("Zincr bootstraps custom configuration", async done => {
    const config = {
      approvals: {
        includeAuthor: true,
        minimum: 2,
        enabled: true
      }
    };

    var zincr = new Zincr(AppConfig, config, {
      repo: "rest",
      owner: "zalando"
    }, "zalando");

    expect(zincr.runner.tasks.length).toBe(1);
    expect(zincr.runner.organization).toBe("zalando");

    expect(zincr.runner.tasks[0][0]).toBe("approvals");

    expect(zincr.appconfig).toMatchObject(AppConfig);
    expect(zincr.taskconfig).toMatchObject(config);
    expect(zincr.repo).toMatchObject({ repo: "rest", owner: "zalando" });
    expect(zincr.organization).toBe("zalando");

    done();
  });

  test("Probot bootstraps Zincr with single task configuration", async done => {
    let probot = new Probot({});
    const runningBot = probot.load((app: Application) => {
      const events = ["pull_request", "pull_request_review"];
      app.on(events, async (context: Context) => {
        const repo = { repo: "test", owner: "robotland" };

        const config = {
          approvals: {
            includeAuthor: true,
            minimum: 2,
            enabled: true
          }
        };

        var zincr = new Zincr(AppConfig, config, repo, "robotland");
        await zincr.onChange(context);
      });
    });

    // just return a test token
    runningBot.app = () => "test";

    nock("https://api.github.com")
      .post("/app/installations/66666/access_tokens")
      .reply(200, { token: "test" });

    nock("https://api.github.com")
      .post(
        "/repos/robotland/test/check-runs",
        (body: ChecksUpdateResponse) => {
          body.completed_at = "2018-07-14T18:18:54.156Z";
          expect(body.status).toBe("in_progress");

          done();
        }
      )
      .reply(200);

    await probot.receive({ name: "pull_request", payload });
    
  });

});
