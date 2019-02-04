import { Context } from "probot";
import { BaseTask } from "./base";
import { IAppConfig } from "../interfaces/config/iappconfig";
export default class SpecificationTask extends BaseTask<any> {
    constructor(appconfig: IAppConfig, config: any, repo: {
        repo: string;
        owner: string;
    });
    run(context: Context): Promise<boolean>;
}
