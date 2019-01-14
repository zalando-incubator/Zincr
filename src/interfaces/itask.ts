import { Context } from "probot";
import { IResult } from "./iresult";

export interface ITask {
  name: string;
  description: string;
  resolution: string;
  result?: IResult[];
  success(): boolean;
  run(context: Context, config: any) : Promise<boolean>
}