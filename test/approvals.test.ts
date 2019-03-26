import Approvals from "../src/tasks/approvals";
import { AppConfig } from "../src/config/app";
import { Context } from "probot";
import { GitHubAPI } from "probot/lib/github";
import nock = require("nock");
import { StatusEnum } from "../src/interfaces/StatusEnum";


nock.disableNetConnect();
jest.setTimeout(10000);

let task : Approvals, context : Context;

describe("zincr approvals", () => {

  beforeEach(() => {
    const event = {
      id: '123',
      name: 'pull_request',
      payload: require("./fixtures/pr/opened.json")
    }

    var config = {
      includeAuthor: true,
        minimum: 2,
        enabled: true
    };
    var repo = {repo: "test", owner: "robotland"};
    
    context = new Context(event, GitHubAPI(), {} as any);
    task = new Approvals( {appconfig:AppConfig, config, repo, organization: "robotland"});
  })  

  test("Zincr can bootstrap the approvals tasks", async done => {
    expect(task.name).toBe("Approvals");
    expect(task.result.length).toBe(0);
    expect(task.repo).toMatchObject({repo: "test", owner: "robotland"});
    done();
  })

  
  
  test("No reviews returns failure", async done => {

    nock("https://api.github.com")
      .get("/repos/robotland/test/compare/607c64cd8e37eb2db939f99a17bee5c7d1a90a31...e76ed6025cec8879c75454a6efd6081d46de4c94")
      .reply(200,  {commits: [] });

    nock("https://api.github.com")
      .get("/repos/robotland/test/pulls/113/reviews")
      .reply(200,  [] );
    
    await task.run(context);

    expect(task.result[0].result).toBe(StatusEnum.Failure);
  
    done();
  })
  
  test("2 reviews for non-employee returns success", async done => {

    nock("https://api.github.com")
      .get("/orgs/robotland/memberships/bkeepers")
      .reply(404);

    nock("https://api.github.com")
      .get("/repos/robotland/test/compare/607c64cd8e37eb2db939f99a17bee5c7d1a90a31...e76ed6025cec8879c75454a6efd6081d46de4c94")
      .reply(200,  {commits: [] });

    nock("https://api.github.com")
      .get("/repos/robotland/test/pulls/113/reviews")
      .reply(200,  [ {id: 666, user: {login: 'a'}, state: "approved"},{id: 666, user: {login: 'b'}, state: "approved"}] );
    
    await task.run(context);
    
    expect( task.success() ) .toBe(true);

    expect(task.result[0].result).toBe(StatusEnum.Success);
    expect(task.result[0].label).toContain("@a");

    expect(task.result[1].result).toBe(StatusEnum.Success);
    expect(task.result[1].label).toContain("@b");

    done();
  })

  test("1 review for non-employee returns failure", async done => {

    // looks up if the PR author is a member of the robotland org
    nock("https://api.github.com")
      .get("/orgs/robotland/memberships/bkeepers")
      .reply(404);


    nock("https://api.github.com")
      .get("/repos/robotland/test/compare/607c64cd8e37eb2db939f99a17bee5c7d1a90a31...e76ed6025cec8879c75454a6efd6081d46de4c94")
      .reply(200,  {commits: []} );

    nock("https://api.github.com")
      .get("/repos/robotland/test/pulls/113/reviews")
      .reply(200,  [ {id: 666, user: {login: 'b'}, state: "approved"}] );
    
    await task.run(context);
    
    expect( task.success() ) .toBe(false);

    // should contain the passing review
    expect(task.result[0].result).toBe(StatusEnum.Success);
    expect(task.result[0].label).toContain("@b");

    // should contain the missing review message
    expect(task.result[1].result).toBe(StatusEnum.Failure);
    expect(task.result[1].label).toContain("1 additional approval needed");

    done();
  })

  
  test("1 review + employee returns success", async done => {

    nock("https://api.github.com")
      .get("/orgs/robotland/memberships/bkeepers")
      .reply(200,  {state: "active"} );

    nock("https://api.github.com")
      .get("/repos/robotland/test/compare/607c64cd8e37eb2db939f99a17bee5c7d1a90a31...e76ed6025cec8879c75454a6efd6081d46de4c94")
      .reply(200,  {commits: []} );

    nock("https://api.github.com")
      .get("/repos/robotland/test/pulls/113/reviews")
      .reply(200,  [ {id: 666, user: {login: 'a'}, state: "approved"}] );
    
    await task.run(context);
    
    expect( task.success() ) .toBe(true);

    // should contain the passing review by the author
    expect(task.result[0].result).toBe(StatusEnum.Success);
    expect(task.result[0].label).toContain("@bkeepers");

    // should contain the missing review message
    expect(task.result[1].result).toBe(StatusEnum.Success);
    expect(task.result[1].label).toContain("@a");

    done();
  })
  

  test("review by co-author returns failure", async done => {

    nock("https://api.github.com")
      .get("/orgs/robotland/memberships/bkeepers")
      .reply(200,  {state: "active"} );

    nock("https://api.github.com")
      .get("/repos/robotland/test/compare/607c64cd8e37eb2db939f99a17bee5c7d1a90a31...e76ed6025cec8879c75454a6efd6081d46de4c94")
      .reply(200,  {commits: [{author: {login: "a"}, commit: {committer: {login: "a"}, message: 'change' }}]} );

    nock("https://api.github.com")
      .get("/repos/robotland/test/pulls/113/reviews")
      .reply(200,  [ {id: 666, user: {login: 'a'}, state: "approved"}] );
    
    nock("https://api.github.com")
      .put("/repos/robotland/test/pulls/113/reviews/666/dismissals")
      .reply(200,  {} );
      
    await task.run(context);
    
    expect( task.success() ) .toBe(false);

    // should contain the passing review by the author
    expect(task.result[0].result).toBe(StatusEnum.Success);
    expect(task.result[0].label).toContain("@bkeepers");

    // should contain the failing co-author review from a
    expect(task.result[1].result).toBe(StatusEnum.Warning);
    expect(task.result[1].label).toContain("@a");

    // should contain the missing reviews request 
    expect(task.result[2].result).toBe(StatusEnum.Failure);
    expect(task.result[2].label).toContain("1 additional approval needed");

    done();
  })
 
  test("review by co-author and non-author returns warning", async done => {

    nock("https://api.github.com")
      .get("/orgs/robotland/memberships/bkeepers")
      .reply(200,  {state: "active"} );

    nock("https://api.github.com")
      .get("/repos/robotland/test/compare/607c64cd8e37eb2db939f99a17bee5c7d1a90a31...e76ed6025cec8879c75454a6efd6081d46de4c94")
      .reply(200,  {commits:  [{author: {login: "a"}, commit: {committer: {login: "a"}, message: 'change' }}]} );

    nock("https://api.github.com")
      .get("/repos/robotland/test/pulls/113/reviews")
      .reply(200,  [ {id: 666, user: {login: 'a'}, state: "approved"}, {id: 666, user: {login: 'b'}, state: "approved"}] );
    
    nock("https://api.github.com")
      .put("/repos/robotland/test/pulls/113/reviews/666/dismissals")
      .reply(200,  {} );

    await task.run(context);
    
    // this should produce a warning, so success will be false
    expect( task.success() ) .toBe(false);

    var status = task.summary();
    expect( status.Failure.length ).toBe(0);
    expect( status.Warning.length ).toBe(1);
    expect( status.Success.length ).toBe(2);

    // should contain the passing review by the author
    expect(task.result[0].result).toBe(StatusEnum.Success);
    expect(task.result[0].label).toContain("@bkeepers");

    // should contain the passing review from b
    expect(task.result[1].result).toBe(StatusEnum.Success);
    expect(task.result[1].label).toContain("@b");
    
    // should contain the failing co-author review from a
    expect(task.result[2].result).toBe(StatusEnum.Warning);
    expect(task.result[2].label).toContain("@a");

    done();
  })
  

});