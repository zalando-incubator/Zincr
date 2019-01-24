import { IResult } from "./iresult";

export interface IResultSummary {
  Success: IResult[],
  Failure: IResult[],
  Warning: IResult[],
}