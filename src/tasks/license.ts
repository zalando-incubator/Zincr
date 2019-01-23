import { Context } from "probot";
import { BaseTask } from "./base";
//import requestPromise = require("request-promise");

import { LicenseLookup } from "license-lookup"



export default class LicenseTask extends BaseTask {
    
  constructor() {
    super(); 
    this.name = "Dependency Licenses";  
    this.description =  "Checks commits for new dependencies and which licenses apply to these";
    
    this.resolution = `Please check the rules of play docs [here](rulesofplay.com)`;
  }

  async checkComments(context : Context, pull : any) {
    const comments = await context.github.issues.listComments(pull);
    const comment = comments.data.find(
      comment => comment.user.login === process.env.APP_NAME + "[bot]"
    );

    return comment;
  }
  

  async run(context: Context, config: any){

    // repo and pr data
    //const repo = context.repo();
    const pr = context.payload.pull_request;
    const repo = context.repo();
    const pr_contents = await context.github.pullRequests.listFiles({ ...repo, number: pr.number});
    const pr_files = pr_contents.data.map(x => x.filename);

    var ll = new LicenseLookup();
    var matches = ll.matchFilesToManager(pr_files);
    if(matches.length == 0)
    {
      return true;
    }
    
    for(const match of matches){
      var base = await context.github.repos.getContents( {...repo, path: match.file,});
      var head = await context.github.repos.getContents( {repo: pr.head.repo.name, owner: pr.head.repo.owner.login, path: match.file, ref: pr.head.ref})
      
      const base_content = Buffer.from(base.data.content, 'base64').toString()
      const head_content = Buffer.from(head.data.content, 'base64').toString()

      var base_deps = await match.manager.detect(base_content);
      var head_deps = await match.manager.detect(head_content);

      var baseDepsKeys = base_deps.map(x => x.name);
      var new_deps = head_deps.filter( x => baseDepsKeys.indexOf(x.name)<0 );
      var new_deps_lookup = await match.manager.lookup(new_deps);

      for(var dd of new_deps_lookup){
        this.result.push({
          label: `${dd.name} is a new dependency, licensed under: ${dd.license}`,
          success: false
        });
      }
      

      this.resolution = JSON.stringify(new_deps_lookup);
    }

    return true;
  }
}




