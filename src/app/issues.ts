import { getOctokit } from "./octokit";
import { Request, Response } from "express";

const ghe_host = process.env.GHE_HOST;

export async function getIssues(req : Request, res: Response){
  if(req.session && ghe_host){

    try {
      var octokit = getOctokit(ghe_host, req.session.token);
      const gh_repo = {owner: req.params.owner, repo: req.params.repo };
      const issues = await octokit.issues.listForRepo({...gh_repo, labels: 'risk'});;
      res.send(issues.data);

    }catch(ex){
      res.status(500).send(ex);
    }
  }else{
    res.send("no session");
  }
};

export async function postIssue(req : Request, res: Response){
  if(req.session && ghe_host){
     
       
       //var octokit = getOctokit(ghe_host, req.session.token);
       /*
       var ev = req.body;
       //ev.datasource
       //ev.threats.label

       // how do we construct a fairly generic body here to convey info of threats -> event -> consequeces
       var body = {
         title: 
       }
       
       const gh_repo = {owner: req.params.owner, repo: req.params.repo };
       const issues = await octokit.issues.create({...gh_repo, title}) .listForRepo({...gh_repo, labels: 'risk'});;
       res.send(issues.data);

     }catch(ex){
       res.status(500).send(ex);
     }
   }else{
     res.send("no session");
   }*/
   
 }
};