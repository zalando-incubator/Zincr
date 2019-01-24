import { Context } from "probot";
import { IResult } from "./iresult";
import { IResultSummary } from "./iresultsummary";
export interface ITask {
    name: string;
    description: string;
    resolution: string;
    postAsComment?: boolean;
    result?: IResult[];
    summary(): IResultSummary;
    render(): string;
    run(context: Context, config: any): Promise<boolean>;
}
