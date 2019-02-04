import { Context } from "probot";
import { BaseTask } from "./base";
import { IAppConfig } from "../interfaces/config/iappconfig";
export default class FourEyePrincipleTask extends BaseTask<any> {
    constructor(appconfig: IAppConfig, config: any, repo: {
        repo: string;
        owner: string;
    });
    run(context: Context): Promise<boolean>;
    unique: (value: any, index: number, self: any[]) => boolean;
    getCommitAuthors(context: Context, pr_author: string): Promise<string[]>;
    dismissContributingReviewers(context: Context, coauthors: Array<string>): Promise<string[]>;
    getReviewers(context: Context, state: String): Promise<string[]>;
    getOrgMembershipStatus(org: string, login: string, context: Context): Promise<boolean>;
}
