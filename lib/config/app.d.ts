import { IAppConfig } from "../interfaces/config/iappconfig";
import { ITaskConfig } from "../interfaces/config/itaskconfig";
import { Context } from "probot";
declare let AppConfig: IAppConfig;
declare function getTasksConfig(context: Context): Promise<ITaskConfig>;
export { AppConfig, getTasksConfig };
