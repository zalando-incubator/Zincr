import { ITask } from "./itask";
export interface ITaskRunnerResults {
    Success: ITask<any>[];
    Failure: ITask<any>[];
    Warning: ITask<any>[];
}
