import { Context } from "probot";
import { TaskRunner } from "./task-runner";
import { ITaskConfig } from "./interfaces/config/itaskconfig";
import { IAppConfig } from "./interfaces/config/iappconfig";
import { IAppParams } from "./interfaces/params/iappparams";
export declare class Zincr {
    appconfig: IAppConfig;
    taskconfig: ITaskConfig;
    repo: {
        repo: string;
        owner: string;
    };
    runner: TaskRunner;
    organization: string | null;
    constructor(params: IAppParams);
    onChange(context: Context): Promise<void>;
    setStatusPass(context: Context): Promise<import("@octokit/rest").Response<import("@octokit/rest").ChecksCreateResponse>>;
}
