import { ITask } from "../interfaces/itask";
import { Context } from "probot";
import { IResult } from "../interfaces/iresult";

export abstract class BaseTask implements ITask {
  name = "";
  description = "";
  resolution = "";
  result = new Array<IResult>();;

  constructor() {
    this.result = new Array<IResult>();
  }

  async run(context: Context, config: object){
    return true;
  }

  success(){
    return ( this.result.filter(x => !x.success).length < 1)
  }
}