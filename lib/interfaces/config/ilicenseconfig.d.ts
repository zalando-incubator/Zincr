import { StatusEnum } from "../StatusEnum";
export interface ILicenseConfig {
    onlyAllow?: string[];
    exclude?: string[];
    whitelist?: string[];
    onNotFound: StatusEnum;
    onNolicense: StatusEnum;
    baseLicense?: string;
}
