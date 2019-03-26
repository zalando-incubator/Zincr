import { ILicenseConfig } from "./ilicenseconfig";
import { IApprovalsConfig } from "./iapprovalsconfig";
import { ISpecificationConfig } from "./ispecificationconfig";
import { ILargeCommitsConfig } from "./ilargecommitsconfig";
export interface ITaskConfig {
    license?: ILicenseConfig;
    approvals?: IApprovalsConfig;
    specification?: ISpecificationConfig;
    largecommits?: ILargeCommitsConfig;
    [key: string]: any;
}
