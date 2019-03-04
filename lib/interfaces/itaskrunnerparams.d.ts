import { IAppConfig } from "./config/iappconfig";
import { ITaskConfig } from "./config/itaskconfig";
export interface ITaskRunnerParams {
    appconfig: IAppConfig;
    taskconfig: ITaskConfig;
    repo: {
        repo: string;
        owner: string;
    };
    organization: string | null;
}
