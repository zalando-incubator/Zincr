import { Context } from "probot";
import { BaseTask } from "./base";
import { IAppConfig } from "../interfaces/config/iappconfig";
import { PullRequestsListFilesResponse } from "@octokit/rest";
export default class LargeCommits extends BaseTask<any> {
    constructor(appconfig: IAppConfig, config: any, repo: {
        repo: string;
        owner: string;
    });
    run(context: Context): Promise<boolean>;
    unique: (value: any, index: number, self: any[]) => boolean;
    getFiles(context: Context): Promise<PullRequestsListFilesResponse>;
    getOrgMembershipStatus(org: string, login: string, context: Context): Promise<boolean>;
}
