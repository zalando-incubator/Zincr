declare let Config: {
    autobranch: {
        pattern: string;
        length: number;
    };
    approvals: {
        minimum: number;
        internal: number;
        external: number;
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
};
export { Config };
