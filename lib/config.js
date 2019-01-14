"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = {
    // Not implemented
    autobranch: {
        pattern: "{number}-{title}",
        length: 60
    },
    approvals: {
        // Legacy setting to support as a zappr drop-in replacement
        // in case the commit is an employee this includes the employee in the total count
        minimum: 2,
        // recommended settings
        internal: 1,
        external: 2
        // there is no org, group or member settings, all this is now controlled by github codeowners and org membership
    },
    // not implemented
    commit: {
        message: {
            patterns: ["#[0-9]+"]
        }
    },
    specification: {
        title: {
            "minimum-length": {
                length: 8,
                enabled: true
            }
        },
        body: {
            "minimum-length": {
                length: 8,
                enabled: true
            },
            "contains-url": true,
            "contains-issue-number": true
        },
        template: {
            "differs-from-body": true
        }
    },
    // not implemented
    "pull-request": {
        labels: [],
        additional: true
    }
};
exports.Config = Config;
//# sourceMappingURL=config.js.map