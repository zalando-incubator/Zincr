import { Context } from "probot";
import { BaseTask } from "./base";
import { ITaskParams } from "../interfaces/params/itaskparams";
import { ISpecificationConfig } from "../interfaces/config/ispecificationconfig";
export default class SpecificationTask extends BaseTask<ISpecificationConfig> {
    constructor(params: ITaskParams<ISpecificationConfig>);
    run(context: Context): Promise<boolean>;
}
