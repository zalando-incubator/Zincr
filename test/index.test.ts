import nock = require("nock");
import { Probot } from "probot";
import foureyes = require("../src/");
import { ChecksUpdateResponse } from "@octokit/rest";

const payload = require("./fixtures/pr/opened.json");

// set the in-progress payload
const checkCreated = require("./fixtures/check/in-progress.json");
checkCreated.output.title = "Processing 5 checks";

//const payloadSuccess = require("./fixtures/pr/opened-success.json");
//const checkSuccess = require("./fixtures/check/success.json");

nock.disableNetConnect()

describe('dco', () => {
  let probot : Probot;
  
  beforeEach(() => {
    probot = new Probot({})
    const app = probot.load(foureyes)

    // just return a test token
    app.app = () => 'test'
  })

  test('creates a in-progress check', async (done) => {
    nock('https://api.github.com')
      .post('/app/installations/66666/access_tokens')
      .reply(200, { token: 'test' })

    // returns 404 for the config file
    nock('https://api.github.com')
      .get('/repos/robotland/test/contents/.zappr.yml')
      .reply(404)

    nock('https://api.github.com')
      .get('/repos/robotland/test/contents/.github/.zincr.yml')
      .reply(404)

    nock('https://api.github.com')
      .post('/repos/robotland/test/check-runs', (body : ChecksUpdateResponse) => {
        body.completed_at = '2018-07-14T18:18:54.156Z'
        
        expect(body).toMatchObject(checkCreated)
        return true
      })
      .reply(200)


    await probot.receive({ name: 'pull_request', payload });

    done();
  })

  /*
  test('creates a passing check', async () => {
    nock('https://api.github.com')
      .post('/app/installations/66666/access_tokens')
      .reply(200, { token: 'test' })

    nock('https://api.github.com')
      .get('/repos/robotland/test/contents/.zappr.yml')
      .reply(404)

    nock('https://api.github.com')
      .post('/repos/robotland/test/check-runs', (body : ChecksUpdateResponse) => {
        body.completed_at = '2018-07-14T18:18:54.156Z'
        expect(body).toMatchObject(checkSuccess)
        return true
      })
      .reply(200)

    await probot.receive({ name: 'pull_request', payload: payloadSuccess })
  })*/

})