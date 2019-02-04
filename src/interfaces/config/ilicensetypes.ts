export interface ILicenseTypes {
  publicdomain:  Array<string>;
  permissive:     Array<string>;
  weakcopyleft:      Array<string>;
  strongcopyleft:      Array<string>;
  networkcopyleft:      Array<string>;
  [key: string]: Array<string>;
}