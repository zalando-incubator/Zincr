import { Context } from "probot";
import { BaseTask } from "./base";
import { ILicenseConfig } from "../interfaces/config/ilicenseconfig";
import { IAppConfig } from "../interfaces/config/iappconfig";
export default class LicenseTask extends BaseTask<ILicenseConfig> {
    constructor(appconfig: IAppConfig, config: ILicenseConfig, repo: {
        repo: string;
        owner: string;
    });
    checkComments(context: Context, pull: any): Promise<import("@octokit/rest").IssuesListCommentsResponseItem | undefined>;
    run(context: Context): Promise<boolean>;
}
