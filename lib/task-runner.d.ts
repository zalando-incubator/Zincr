import { ITaskRunnerResults } from "./interfaces/itaskrunnerresult";
import { IAppConfig } from "./interfaces/config/iappconfig";
import { ITaskConfig } from "./interfaces/config/itaskconfig";
import { Context } from "probot";
import { BaseTask } from "./tasks/base";
export declare class TaskRunner {
    appconfig: IAppConfig;
    taskconfig: ITaskConfig;
    repo: {
        repo: string;
        owner: string;
    };
    tasks: Array<[string, any]>;
    organization: string | undefined;
    constructor(appconfig: IAppConfig, taskconfig: ITaskConfig, repo: {
        repo: string;
        owner: string;
    }, organization: string | undefined);
    loadRunners(): Promise<Array<BaseTask<any>>>;
    run(context: Context): Promise<ITaskRunnerResults>;
}
