import { ITask } from "../interfaces/itask";
import { Context } from "probot";
import { IResult } from "../interfaces/iresult";
import { StatusEnum } from "../interfaces/StatusEnum";
import { IResultSummary } from "../interfaces/iresultsummary";
import { IAppConfig } from "../interfaces/config/iappconfig";
import { IconEnum } from "../interfaces/IconEnum";
import { ITaskParams } from "../interfaces/params/itaskparams";

export abstract class BaseTask<T> implements ITask<T> {
  name = "";
  description = "";
  resolution = "";

  result = new Array<IResult>();
  postAsComment = false;

  appconfig : IAppConfig;
  config : T;
  repo: {repo: string, owner: string};
  organization: string | null;

  private _summary : IResultSummary | null = null;
  
  constructor( params : ITaskParams<T> ) {
    this.appconfig = params.appconfig;
    this.config = params.config; 
    this.repo = params.repo;
    this.result = new Array<IResult>();
    this.organization = params.organization;
  }

  async run(context: Context){
    return true;
  }

  summary(){

    if(this._summary == null){
      
      this._summary = {
        Success : this.result.filter(x => x.result == StatusEnum.Success),
        Failure : this.result.filter(x => x.result == StatusEnum.Failure),
        Warning : this.result.filter(x => x.result == StatusEnum.Warning)
      };

    }

    return this._summary
  }

  success(){
    return !(this.summary().Failure.length > 0 || this.summary().Warning.length > 0);
  }

  render( options : {includeDescription: boolean, includeHeader : boolean, addCheckBox: boolean} = {includeDescription: true, includeHeader: true, addCheckBox: false} ){
    const icon = (status: StatusEnum)=>{
      switch (status) {
        case StatusEnum.Success:
          return IconEnum.Success
        case StatusEnum.Failure:
          return IconEnum.Failure
        case StatusEnum.Warning:
          return IconEnum.Warning
        default:
          return 'ℹ️'
      }
    }

    /*
    var status = IconEnum.Success;
    if(this.summary().Warning.length > 0){
      status = IconEnum.Warning;
    }
    if(this.summary().Failure.length > 0){
      status = IconEnum.Failure;
    }*/

    var resolutions = [];

    if(options.includeHeader){
      resolutions.push(`## ${this.name}`);
      
      if(this.description && this.description !== ''){
        resolutions.push(`${this.description}`);
      }

      if(!this.success() && this.resolution && this.resolution !== ''){
        resolutions.push(" ");
        resolutions.push(`**${this.resolution}**`); 
      }
    }

    if(this.result){

      resolutions.push("");
      for(const subResult of this.result){
          
          resolutions.push(`- ${(options.addCheckBox && subResult.result !== StatusEnum.Success) ? "[ ]" : ""} ${icon(subResult.result)} ${subResult.label}`);
          
          if(options.includeDescription && subResult.description){
            resolutions.push(`    ${subResult.description}`);
          }
      }
    }
    
    resolutions.push("&nbsp;");
    return resolutions.join('\n');
  }
}