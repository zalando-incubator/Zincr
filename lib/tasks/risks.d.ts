import { Context } from "probot";
import { BaseTask } from "./base";
import { ITaskParams } from "../interfaces/params/itaskparams";
import { IRisksConfig } from "../interfaces/config/irisksconfig";
export default class RisksTask extends BaseTask<IRisksConfig> {
    constructor(params: ITaskParams<IRisksConfig>);
    run(context: Context): Promise<boolean>;
}
