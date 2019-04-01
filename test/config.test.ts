import nock = require("nock");
import fs = require("fs");
import { getTasksConfig } from "../src/config/app";
import { Probot, Application, Context } from "probot";

const payload = require("./fixtures/pr/opened.json");
const defaultConfig = Buffer.from(
  fs.readFileSync("./test/configs/zappr.empty.yml", "utf8")
).toString("base64");
const overrideConfig = Buffer.from(
  fs.readFileSync("./test/configs/zappr.approvals.yml", "utf8")
).toString("base64");

nock.disableNetConnect();
jest.setTimeout(10000);

describe("zincr", () => {
  test("Probot bootstraps Zincr with default zappr configuration", async done => {
    let probot = new Probot({});
    const runningBot = probot.load((app: Application) => {
      const events = ["pull_request", "pull_request_review"];
      app.on(events, async (context: Context) => {
        const config = await getTasksConfig(context);

        expect(config["X-Zalando-Type"]).toBe("doc");
        expect(config["X-Zalando-Team"]).toBe("opensource");

        expect(config.approvals).toBeDefined();

        if (config.approvals) {
          expect(config.approvals.enabled).toBe(true);
        }

        done();
        //var zincr = new Zincr(AppConfig, config, repo);
        //await zincr.onChange(context);
      });
    });

    // just return a test token
    runningBot.app = () => "test";

    nock("https://api.github.com")
      .get("/repos/robotland/test/contents/.github/.zincr.yml")
      .reply(404);

    nock("https://api.github.com")
      .get("/repos/robotland/test/contents/.zappr.yml")
      .reply(200, {
        type: "file",
        encoding: "base64",
        name: ".zappr.yml",
        path: ".zappr.yml",
        content: defaultConfig
      });

    nock("https://api.github.com")
      .post("/app/installations/66666/access_tokens")
      .reply(200, { token: "test" });

    await probot.receive({ name: "pull_request", payload });
  });

  test("Probot bootstraps Zincr with overriding zappr configuration", async done => {
    let probot = new Probot({});
    const runningBot = probot.load((app: Application) => {
      const events = ["pull_request", "pull_request_review"];
      app.on(events, async (context: Context) => {
        const config = await getTasksConfig(context);

        expect(config["X-Zalando-Type"]).toBe("doc");
        expect(config["X-Zalando-Team"]).toBe("opensource");

        expect(config.approvals).toBeDefined();
        if (config.approvals) {
          expect(config.approvals.includeAuthor).toBe(false);
        }

        expect(config.specification).toBeDefined();
        if (config.specification) {
          expect(config.specification.enabled).toBe(true);
        }

        expect(config.largecommits).toBeDefined();
        if (config.largecommits) {
          expect(config.largecommits.enabled).toBe(false);
        }

        done();
      });
    });

    // just return a test token
    runningBot.app = () => "test";

    nock("https://api.github.com")
      .get("/repos/robotland/test/contents/.github/.zincr.yml")
      .reply(404);

    nock("https://api.github.com")
      .get("/repos/robotland/test/contents/.zappr.yml")
      .reply(200, {
        type: "file",
        encoding: "base64",
        name: ".zappr.yml",
        path: ".zappr.yml",
        content: overrideConfig
      });

    nock("https://api.github.com")
      .post("/app/installations/66666/access_tokens")
      .reply(200, { token: "test" });

    await probot.receive({ name: "pull_request", payload });
  });
});
