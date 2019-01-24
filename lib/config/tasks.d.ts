declare let TaskConfig: {
    autobranch: {
        pattern: string;
        length: number;
    };
    approvals: {
        includeAuthor: boolean;
        minimum: number;
    };
    commit: {
        message: {
            patterns: string[];
        };
    };
    specification: {
        title: {
            "minimum-length": {
                length: number;
                enabled: boolean;
            };
        };
        body: {
            "minimum-length": {
                length: number;
                enabled: boolean;
            };
            "contains-url": boolean;
            "contains-issue-number": boolean;
        };
        template: {
            "differs-from-body": boolean;
        };
    };
    "pull-request": {
        labels: never[];
        additional: boolean;
    };
    license: {
        onlyAllow: string[];
        exclude: never[];
    };
};
export { TaskConfig };
