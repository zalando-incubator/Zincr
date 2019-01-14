import { BaseTask } from "../tasks/base";
export interface ModuleConstructor<T extends BaseTask> {
    new (): T;
}
