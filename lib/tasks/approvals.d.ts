import { Context } from "probot";
import { BaseTask } from "./base";
export default class FourEyePrincipleTask extends BaseTask {
    constructor();
    run(context: Context, config: any): Promise<boolean>;
    getReviewsWithState(context: Context, state: String): Promise<number>;
    getOrgMembershipStatus(org: string, login: string, context: Context): Promise<boolean>;
}
