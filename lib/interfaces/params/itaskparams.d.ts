import { IAppConfig } from "../config/iappconfig";
export interface ITaskParams<T> {
    appconfig: IAppConfig;
    config: T;
    repo: {
        repo: string;
        owner: string;
    };
    organization: string | null;
}
