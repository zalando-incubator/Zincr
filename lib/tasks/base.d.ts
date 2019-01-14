import { ITask } from "../interfaces/itask";
import { Context } from "probot";
import { IResult } from "../interfaces/iresult";
export declare abstract class BaseTask implements ITask {
    name: string;
    description: string;
    resolution: string;
    result: IResult[];
    constructor();
    run(context: Context, config: object): Promise<boolean>;
    success(): boolean;
}
