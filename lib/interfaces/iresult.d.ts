import { StatusEnum } from "./StatusEnum";
import { IDependencyLookUp } from "license-lookup/lib/interfaces/IDependencyLooKUp";
export interface IResult {
    result: StatusEnum;
    label: string;
    description?: string;
    dependency?: IDependencyLookUp;
}
