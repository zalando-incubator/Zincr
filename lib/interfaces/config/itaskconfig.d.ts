import { ILicenseConfig } from "./ilicenseconfig";
import { IApprovalsConfig } from "./iapprovalsconfig";
import { ISpecificationConfig } from "./ispecificationconfig";
import { ILargeCommitsConfig } from "./ilargecommitsconfig";
import { IRisksConfig } from "./irisksconfig";
export interface ITaskConfig {
    comment?: boolean;
    license?: ILicenseConfig;
    approvals?: IApprovalsConfig;
    specification?: ISpecificationConfig;
    largecommits?: ILargeCommitsConfig;
    risks?: IRisksConfig;
    [key: string]: any;
}
