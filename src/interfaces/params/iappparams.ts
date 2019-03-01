import { IAppConfig } from "../config/iappconfig";
import { ITaskConfig } from "../config/itaskconfig";

export interface IAppParams {
  appconfig: IAppConfig, 
  taskconfig: ITaskConfig,
  repo: {repo: string, owner: string}, 
  organization: string | null
}