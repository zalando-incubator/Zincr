import { ITask } from "../interfaces/itask";
import { Context } from "probot";
import { IResult } from "../interfaces/iresult";
import { IResultSummary } from "../interfaces/iresultsummary";
import { IAppConfig } from "../interfaces/config/iappconfig";
import { ITaskParams } from "../interfaces/params/itaskparams";
export declare abstract class BaseTask<T> implements ITask<T> {
    name: string;
    description: string;
    resolution: string;
    result: IResult[];
    postAsComment: boolean;
    appconfig: IAppConfig;
    config: T;
    repo: {
        repo: string;
        owner: string;
    };
    organization: string | null;
    private _summary;
    constructor(params: ITaskParams<T>);
    run(context: Context): Promise<boolean>;
    summary(): IResultSummary;
    success(): boolean;
    render(options?: {
        includeDescription: boolean;
        includeHeader: boolean;
        addCheckBox: boolean;
    }): string;
}
