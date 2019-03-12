export interface ISpecificationConfig {
  enabled: boolean,
  
  title: {
    "minimum-length": {
      length: number,
      enabled: boolean        
    }
  },

  body: {
    "minimum-length": {
      length: number,
      enabled: boolean
    },

    "contains-url": boolean,
    "contains-issue-number": boolean
  },

  template: {
    "differs-from-body": boolean
  }
}