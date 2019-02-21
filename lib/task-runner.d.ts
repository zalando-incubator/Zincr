import { ITaskRunnerResults } from "./interfaces/itaskrunnerresult";
import { IAppConfig } from "./interfaces/config/iappconfig";
import { ITaskConfig } from "./interfaces/config/itaskconfig";
import { Context } from "probot";
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
    run(context: Context): Promise<ITaskRunnerResults>;
}
