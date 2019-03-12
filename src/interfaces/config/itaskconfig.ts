import { ILicenseConfig } from "./ilicenseconfig";
import { IApprovalsConfig } from "./iapprovalsconfig";
import { ISpecificationConfig } from "./ispecificationconfig";

export interface ITaskConfig {
  license?: ILicenseConfig,
  approvals?: IApprovalsConfig,
  specification?: ISpecificationConfig,
  [key: string]: any
}