import { ITask } from "../interfaces/itask";
import { Context } from "probot";
import { IResult } from "../interfaces/iresult";
import { StatusEnum } from "../interfaces/StatusEnum";
import { IResultSummary } from "../interfaces/iresultsummary";

export abstract class BaseTask implements ITask {
  name = "";
  description = "";
  resolution = "";
  result = new Array<IResult>();
  postAsComment = false;

  private _summary : IResultSummary | null = null;

  constructor() {
    this.result = new Array<IResult>();
  }

  async run(context: Context, config: object){
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

  render(){
    const icon = (status: StatusEnum)=>{
      switch (status) {
        case StatusEnum.Success:
          return '✅'
        case StatusEnum.Failure:
          return '❌'
        case StatusEnum.Warning:
          return '⚠️'
        default:
          return 'ℹ️'
      }
    }

    var status = "✅";
    if(this.summary().Warning.length > 0){
      status = "⚠️";
    }
    if(this.summary().Failure.length > 0){
      status = "❌";
    }

    var resolutions = [];
    resolutions.push(`### ${status} ${this.name}`);
    resolutions.push(`${this.description}`);

    if(this.resolution !== ''){
      resolutions.push(`**${this.resolution}**`); 
    }

    if(this.result){
      resolutions.push(" ");
      for(const subResult of this.result){
          resolutions.push(`${icon(subResult.result)} ${subResult.label}`);
      }
    }

    return resolutions.join('\n');
  }
}