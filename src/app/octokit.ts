import { GitHubAPI } from "probot/lib/github";

export function getOctokit(host : string, token : string){
  const octokit = GitHubAPI({
    baseUrl: `https://${host}/api/v3`,
    logger: {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    },
  });

  octokit.authenticate({ type: 'token', token: token });
  return octokit;
}