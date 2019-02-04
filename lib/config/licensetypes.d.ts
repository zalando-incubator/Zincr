import { ILicenseTypes } from "../interfaces/config/ilicensetypes";
declare function FindCompatible(baselicense: string): Array<string>;
declare let LicenseTypes: ILicenseTypes;
export { LicenseTypes, FindCompatible };
