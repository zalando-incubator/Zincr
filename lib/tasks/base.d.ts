import { ITask } from "../interfaces/itask";
import { Context } from "probot";
import { IResult } from "../interfaces/iresult";
import { IResultSummary } from "../interfaces/iresultsummary";
import { IAppConfig } from "../interfaces/config/iappconfig";
export declare abstract class BaseTask<T> implements ITask {
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
    private _summary;
    constructor(appconfig: IAppConfig, config: T, repo: {
        repo: string;
        owner: string;
    });
    run(context: Context): Promise<boolean>;
    summary(): IResultSummary;
    render(options?: {
        includeDescription: boolean;
        includeHeader: boolean;
        addCheckBox: boolean;
    }): string;
}
