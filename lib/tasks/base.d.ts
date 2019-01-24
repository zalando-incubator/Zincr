import { ITask } from "../interfaces/itask";
import { Context } from "probot";
import { IResult } from "../interfaces/iresult";
import { IResultSummary } from "../interfaces/iresultsummary";
export declare abstract class BaseTask implements ITask {
    name: string;
    description: string;
    resolution: string;
    result: IResult[];
    postAsComment: boolean;
    private _summary;
    constructor();
    run(context: Context, config: object): Promise<boolean>;
    summary(): IResultSummary;
    render(): string;
}
