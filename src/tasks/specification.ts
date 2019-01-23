import { Context } from "probot";
import { BaseTask } from "./base";
//import requestPromise = require("request-promise");

// Patters for issue and url checks
const ISSUE_PATTERN = /^(?:[-\w]+\/[-\w]+)?#\d+$/g
const URL_PATTERN = /\bhttps?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig


export default class SpecificationTask extends BaseTask {
    
  constructor() {
    super(); 
    this.name = "Specification";  
    this.description =  "Checks for the presence of a issue tracker number in the pull request";
    this.resolution = `Please check the rules of play docs [here](rulesofplay.com)`;
  }

  async run(context: Context, config: any){

    // repo and pr data
    //const repo = context.repo();
    const pr = context.payload.pull_request;

    // utillity functions
    const isLongEnough = (str : string, requiredLength : number) => (str || '').length > requiredLength;
    const containsPattern = (pattern : RegExp, str : string) => pattern.test(str);
    
    // Check template
    // Get template - compare to body
    if(config.template){
      //const url = `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/master/.github/PULL_REQUEST_TEMPLATE.md`;
      //const template = await requestPromise(url, { resolveWithFullResponse: true });
    }

    // Check title
    // check min length
    if(config.title){

      if(config.title && config.title["minimum-length"] && config.title["minimum-length"].enabled !== false){
        this.result.push({
          label : `Pull Request Title must be atleast ${config.title["minimum-length"].length} characters`,
          success: isLongEnough(pr.title, config.title["minimum-length"].length)
        });
      }
    }

    // Check body
    // check for issue pattern or url pattern
    if(config.body){

      if(config.body && config.body["minimum-length"] && config.body["minimum-length"].enabled !== false){
        this.result.push({
          label : `Pull Request body must be atleast ${config.body["minimum-length"].length} characters`,
          success: isLongEnough(pr.body, config.body["minimum-length"].length)
        });
      }

      if(config.body["contains-issue-number"]){
        this.result.push({
          label : `Pull Request body must contain issue number`,
          success: containsPattern(ISSUE_PATTERN, pr.body)
        });
      }

      if(config.body["contains-url"]){
        this.result.push({
          label : `Pull Request body must contain url`,
          success: containsPattern(URL_PATTERN, pr.body)
        });
      }
    }

    return true;
  }
}