import Specification from "../src/tasks/specification";
import { AppConfig } from "../src/config/app";
import { Context } from "probot";
import { GitHubAPI } from "probot/lib/github";
import nock = require("nock");
import { ISpecificationConfig } from "../src/interfaces/config/ispecificationconfig";
import { StatusEnum } from "../src/interfaces/StatusEnum";


nock.disableNetConnect();
jest.setTimeout(10000);

let task : Specification, context : Context;

describe("zincr Specification", () => {

  beforeEach(() => {
    const event = {
      id: '123',
      name: 'pull_request',
      payload: require("./fixtures/pr/opened.json")
    }

    var repo = {repo: "test", owner: "robotland"};
    context = new Context(event, GitHubAPI(), {} as any);

    //standard config
    var config : ISpecificationConfig = {
      enabled: true,

      title: {
        "minimum-length": {
          length: 8,
          enabled: true
        }
      },

      body: {
        "minimum-length": {
          length: 8,
          enabled: true
        },

        "contains-url": false,
        "contains-issue-number": true
      },

      template: {
        "differs-from-body": true
      }
    };
    task = new Specification({appconfig:AppConfig, config, repo, organization: "robotland"});
  })  

  test("Zincr can bootstrap the specification tasks", async done => {
    expect(task.name).toBe("Specification");
    expect(task.result.length).toBe(0);
    expect(task.repo).toMatchObject({repo: "test", owner: "robotland"});
    done();
  })

  test("No issue number returns failure", async done => {

    /*
    nock("https://api.github.com")
      .get("/repos/robotland/test/compare/607c64cd8e37eb2db939f99a17bee5c7d1a90a31...e76ed6025cec8879c75454a6efd6081d46de4c94")
      .reply(200,  {commits: [] });

    nock("https://api.github.com")
      .get("/repos/robotland/test/pulls/113/reviews")
      .reply(200,  [] );
    */
   
    await task.run(context);

    expect(task.success()).toBe(false);
    expect(task.result[0].result).toBe(StatusEnum.Failure);
  
    done();
  })
  

});