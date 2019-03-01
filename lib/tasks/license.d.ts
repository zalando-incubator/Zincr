import { Context } from "probot";
import { BaseTask } from "./base";
import { ILicenseConfig } from "../interfaces/config/ilicenseconfig";
import { ITaskParams } from "../interfaces/params/itaskparams";
export default class LicenseTask extends BaseTask<ILicenseConfig> {
    constructor(params: ITaskParams<ILicenseConfig>);
    checkComments(context: Context, pull: any): Promise<import("@octokit/rest").IssuesListCommentsResponseItem | undefined>;
    run(context: Context): Promise<boolean>;
}
