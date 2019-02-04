import { ILicenseConfig } from "./ilicenseconfig";
export interface ITaskConfig {
    license?: ILicenseConfig;
    approvals?: any;
    specification?: any;
    [key: string]: any;
}
