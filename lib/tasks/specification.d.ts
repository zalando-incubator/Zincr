import { Context } from "probot";
import { BaseTask } from "./base";
import { ITaskParams } from "../interfaces/params/itaskparams";
export default class SpecificationTask extends BaseTask<any> {
    constructor(params: ITaskParams<any>);
    run(context: Context): Promise<boolean>;
}
