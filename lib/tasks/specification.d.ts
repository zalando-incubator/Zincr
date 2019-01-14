import { Context } from "probot";
import { BaseTask } from "./base";
export default class SpecificationTask extends BaseTask {
    constructor();
    run(context: Context, config: any): Promise<boolean>;
}
