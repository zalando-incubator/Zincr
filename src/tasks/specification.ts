import { Context } from "probot";
import { BaseTask } from "./base";
import { StatusEnum } from "../interfaces/StatusEnum";
import { IAppConfig } from "../interfaces/config/iappconfig";
//import requestPromise = require("request-promise");

// Patters for issue and url checks
const ISSUE_PATTERN = /(?:\w[\w-.]+\/\w[\w-.]+|\B)#[1-9]\d*\b/;
const URL_PATTERN = /\bhttps?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;


export default class SpecificationTask extends BaseTask<any> {
    
  constructor(appconfig : IAppConfig, config : any, repo: {repo: string, owner: string}) {
    super(appconfig, config, repo); 
    this.name = "Specification";  
    this.description =  "All pull requests must follow certain rules for content length and form";
    this.resolution = `Please ensure the follow issues are resolved:`;
  }

  async run(context: Context){

    // repo and pr data
    //const repo = context.repo();
    const pr = context.payload.pull_request;

    // utillity functions
    const isLongEnough = (str : string, requiredLength : number) => (str || '').length > requiredLength;
    const containsPattern = (pattern : RegExp, str : string) => pattern.test(str);
    
    // Check template
    // Get template - compare to body
    if(this.config.template){
      //const url = `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/master/.github/PULL_REQUEST_TEMPLATE.md`;
      //const template = await requestPromise(url, { resolveWithFullResponse: true });
    }

    // Check title
    // check min length
    if(this.config.title){

      if(this.config.title && this.config.title["minimum-length"] && this.config.title["minimum-length"].enabled !== false){

        this.result.push({
          label : `Pull Request Title must be atleast ${this.config.title["minimum-length"].length} characters`,
          result: isLongEnough(pr.title, this.config.title["minimum-length"].length) ? StatusEnum.Success : StatusEnum.Failure
        });
      }
    }

    // Check body
    // check for issue pattern or url pattern
    if(this.config.body){

      if(this.config.body && this.config.body["minimum-length"] && this.config.body["minimum-length"].enabled !== false){
        this.result.push({
          label : `Pull Request body must be atleast ${this.config.body["minimum-length"].length} characters`,
          result: isLongEnough(pr.body, this.config.body["minimum-length"].length) ? StatusEnum.Success : StatusEnum.Failure
        });
      }

      if(this.config.body["contains-issue-number"]){
        this.result.push({
          label : `Pull Request body must contain issue number`,
          result: ISSUE_PATTERN.test(pr.body) ? StatusEnum.Success : StatusEnum.Failure
        });
      }

      if(this.config.body["contains-url"]){
        this.result.push({
          label : `Pull Request body must contain url`,
          result: containsPattern(URL_PATTERN, pr.body) ? StatusEnum.Success : StatusEnum.Failure
        });
      }
    }

    return true;
  }
}