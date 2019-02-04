import { ITask } from "./itask";

export interface ITaskRunnerResults {
  Success: ITask[],
  Failure: ITask[],
  Warning: ITask[],
}