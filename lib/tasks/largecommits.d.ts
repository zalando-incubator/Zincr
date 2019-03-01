import { Context } from "probot";
import { BaseTask } from "./base";
import { PullRequestsListFilesResponse } from "@octokit/rest";
import { ITaskParams } from "../interfaces/params/itaskparams";
export default class LargeCommits extends BaseTask<any> {
    constructor(params: ITaskParams<any>);
    run(context: Context): Promise<boolean>;
    unique: (value: any, index: number, self: any[]) => boolean;
    getFiles(context: Context): Promise<PullRequestsListFilesResponse>;
    getOrgMembershipStatus(org: string, login: string, context: Context): Promise<boolean>;
}
