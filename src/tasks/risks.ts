import { Context } from "probot";
import { BaseTask } from "./base";
import { ITaskParams } from "../interfaces/params/itaskparams";
import { IRisksConfig } from "../interfaces/config/irisksconfig";
import { StatusEnum } from "../interfaces/StatusEnum";

export default class RisksTask extends BaseTask<IRisksConfig> {
    
  constructor(params : ITaskParams<IRisksConfig>) {
    super(params); 

    this.name = "Risk Assessment";  
    this.description =  "Guides developers to assess the risk of their application by checking the change data and validity of risks.md";
    this.resolution = `Please ensure you have a risks.md file and it is updated regularly`;
    this.postAsComment = true;
  }

  
  async run(context: Context){

    const riskfile = await context.github.repos.getContents( { ...this.repo, path: "risks.md" } );
    if(riskfile.status !== 200)
    {

      this.result.push({
        label: "No risks.md file found",
        result: StatusEnum.Failure,
        description: `Create a risks.md file - [Click here](https://${context.host}/risky/${this.repo.owner}/${this.repo.repo}/)`
      })

    }else{

      this.result.push({
        label: "Update your Risks.md file",
        result: StatusEnum.Failure,
        description: `Update your risk assessment - [Click here](https://${context.host}/risky/${this.repo.owner}/${this.repo.repo}/)`
      })

    }

    return true;
  }
}




