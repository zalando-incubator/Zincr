import { Context } from "probot";
import { BaseTask } from "./base";
import { ITaskParams } from "../interfaces/params/itaskparams";
import { IApprovalsConfig } from "../interfaces/config/iapprovalsconfig";
export default class FourEyePrincipleTask extends BaseTask<IApprovalsConfig> {
    constructor(params: ITaskParams<IApprovalsConfig>);
    run(context: Context): Promise<boolean>;
    unique: (value: any, index: number, self: any[]) => boolean;
    getCommitAuthors(context: Context, pr_author: string): Promise<any>;
    getReviews(context: Context, coauthors: Array<string>, state: string): Promise<{
        approvals: Array<string>;
        contributing: Array<string>;
    }>;
    getRepoMembershipStatus(owner: string, repo: string, login: string, context: Context): Promise<boolean>;
    getOrgMembershipStatus(org: string, login: string, context: Context): Promise<boolean>;
}
