import { getOctokit } from "./octokit";
import { Request, Response } from "express";
//@ts-ignore
import YAML = require('json-to-pretty-yaml');

//@ts-ignore
import yamltojs = require('js-yaml');
import { GitHubAPI } from "probot/lib/github";

const ghe_host = process.env.GHE_HOST;
const rr_branch = "rapid-risk";
//const master_branch = "master";
const rr_file = "risks.md";

async function ensureBranch(branch : string){
  // get all refs
  // if no risk branch, create one from master
}

async function createOrUpdatePr(branch : string, risks: any){
  // get all PRs from rapid-risk branch
  // create or update PR with correct desription.

  return {data: "meh"};
}

async function getRiskFile(octokit : GitHubAPI, repo : {owner: string, repo: string}, branch : string = ''){
  try{
    var req = { path: rr_file, ...repo };
    if(branch !== ''){
      //@ts-ignore
      req.ref = branch;
    }
      
    //get the risk file from branch
    var response = await octokit.repos.getContents(req);
    if(response.status === 200){
      return response.data;
    }
  }catch(ex){
    console.log(ex);
    return null
  }
};

async function updateRiskFile(content : string, sha : string, octokit : GitHubAPI, repo : {owner: string, repo: string}, branch : string){
  try{
    const yaml = Buffer.from(YAML.stringify(content)).toString('base64');
    await octokit.repos.updateFile({...repo, path: rr_file, sha: sha, content: yaml, message: "updated risk file", branch: branch});
    return true;
  }catch(ex){
    return false;
  }
};

export async function postAssessment(req : Request, res: Response){
  if(req.session && ghe_host){

    try {
      var octokit = getOctokit(ghe_host, req.session.token);
      const gh_repo = {owner: req.params.owner, repo: req.params.repo };
      
      // try to get rapid-risk branch / rapid risk PR
      var branched_riskFile = await getRiskFile(octokit, gh_repo, rr_branch);
      if(!branched_riskFile){
        await ensureBranch(rr_branch);
        await updateRiskFile(req.body, "null", octokit, gh_repo, rr_branch);
      }else{
        await updateRiskFile(req.body, branched_riskFile.sha, octokit, gh_repo, rr_branch);
      }

      var pr = await createOrUpdatePr(rr_branch, req.body);
      res.sendStatus(200).send(pr.data);
    } catch (err) {
      // It threw an error so they can't see the repo
      res.send(err);
    }
  }else{
    res.send("no session");
  }
};



export async function getAssessment(req : Request, res : Response){
  
  if(req.session && ghe_host){

    try {
      var octokit = getOctokit(ghe_host, req.session.token);
    
      // If this doesn't throw, they can see the repo
      const gh_repo = {owner: req.params.owner, repo: req.params.repo };

      try{
        //get the risk branch
        //var branch = await octokit.repos.getBranch({branch: rr_branch, ...gh_repo});
        var riskFile = await getRiskFile(octokit, gh_repo, rr_branch);
        if(!riskFile){
          riskFile =  await getRiskFile(octokit, gh_repo);
        }

        if(!riskFile){
          riskFile = {};
        }
        var content = yamltojs.safeLoad(new Buffer(riskFile.content, 'base64').toString('ascii'))
        res.status(200).send(content);
      }catch(ex){
        res.status(500).send(ex);
      } 
    } catch (err) {
      // It threw an error so they can't see the repo
      res.status(500).send(err);
    }
    
    //res.send(`Hey, you made it! - Repo: ${req.params.owner}/${req.params.repo} user:` + req.session.login);
  }else{
    res.send("no session");
  }
};

export async function getUi(req : Request, res : Response){
  
  if(req.session && ghe_host){

      var octokit = getOctokit(ghe_host, req.session.token);
    
      // If this doesn't throw, they can see the repo
      const gh_repo = {owner: req.params.owner, repo: req.params.repo };
      
      try{
        var repo = await octokit.repos.get({...gh_repo});
        res.render("../../../views/risky.hbs", {repo: repo.data});
      }catch(ex){
        res.status(500).send(ex);
      }
  }else{
    res.send("no session");
  }
}