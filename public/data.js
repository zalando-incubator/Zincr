export default {
  async getScenarios() {
    return [
      {
        data: 1,
        id: 1,
        type: "confidentiality",
        description:
          "Cras porta lobortis mi, a feugiat elit ultricies sit amet. Duis hendrerit felis a est consequat mollis id at dolor. Nulla eu ligula odio. Nunc consequat justo sit amet urna egestas, a congue quam congue. Aenean pharetra quam sed auctor fermentum.",
        issue: "#2312",

        outcomes: [
          {
            type: {
              reputation: "high",
              productivity: "low"
            },
            description: "Something something"
          },
          {
            type: {
              reputation: "high",
              productivity: "low"
            },
            description: "Something something"
          }
        ],

        threats: []
      },
      {
        data: 2,
        id: 2,
        type: "integrity",
        description:
          "Vestibulum a purus a eros maximus accumsan. Donec ornare cursus condimentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas",
        issue: "#1234",
        outcomes: [],
        threats: []
      },
      {
        data: 1,
        id: 3,
        type: "availability",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis mollis sapien, et luctus nulla. Donec nec tempus nisi, quis faucibus nisl. Nulla sit amet elementum quam, ac rutrum augue",
        outcomes: [],
        threats: []
      }
    ];
  },

  getOutcome() {
    // owasp top 10:
    return {
      reputation: {
        label: "Injection",
        url: "",
        description:
          "Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. The attacker’s hostile data can trick the interpreter into executing unintended commands or accessing data without proper authorization."
      }
    };
  },

  getThreats() {
    // owasp top 10:
    return {
      a1: {
        label: "Injection",
        url: "",
        description:
          "Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. The attacker’s hostile data can trick the interpreter into executing unintended commands or accessing data without proper authorization."
      },
      a2: {
        label: "Broken auth",
        url: "",
        description:
          "an attacker uses leaks or flaws in the authentication or session management functions to impersonate other users."
      },
      a3: {
        label: "XSS",
        url: "",
        description:
          "XSS flaws occur whenever an application takes untrusted data and sends it to a web browser without proper validation or escaping. XSS allows attackers to execute scripts in the victims' browser, which can access any cookies, session tokens, or other sensitive information retained by the browser, or redirect user to malicious sites."
      },
      a4: {
        label: "Insecure Direct Object References",
        url: "",
        description:
          "A direct object reference occurs when a developer exposes a reference to an internal implementation object, such as a file, directory, or database key. Without an access control check or other protection, attackers can manipulate these references to access unauthorized data."
      },
      a5: {
        label: "Misconfiguration",
        url: "",
        description:
          "This vulnerability allows an attacker to accesses default accounts, unused pages, unpatched flaws, unprotected files and directories, etc. to gain unauthorized access to or knowledge of the system. Security misconfiguration can happen at any level of an application stack, including the platform, web server, application server, database, framework, and custom code."
      },
      a6: {
        label: "Sensitive Data",
        url: "",
        description:
          "This vulnerability allows an attacker to access sensitive data such as credit cards, tax IDs, authentication credentials, etc to conduct credit card fraud, identity theft, or other crimes. Losing such data can cause severe business impact and damage to the reputation. Sensitive data deserves extra protection such as encryption at rest or in transit, as well as special precautions when exchanged with the browser."
      },
      a7: {
        label: "Access Controls",
        url: "",
        description:
          "Most web applications verify function level access rights before making that functionality visible in the UI. However, applications need to perform the same access control checks on the server when each function is accessed."
      },
      a8: {
        label: "CSRF",
        url: "",
        description:
          "A CSRF attack forces a logged-on victim’s browser to send a forged HTTP request, including the victim’s session cookie and any other automatically included authentication information, to a vulnerable web application. This allows the attacker to force the victim’s browser to generate requests that the vulnerable application processes as legitimate requests from the victim."
      },
      a9: {
        label: "Insecure dependencies",
        url: "",
        description:
          "Components, such as libraries, frameworks, and other software modules, almost always run with full privileges. If a vulnerable component is exploited, such an attack can facilitate serious data loss or server takeover. Applications using components with known vulnerabilities may undermine application defenses and enable a range of possible attacks and impacts."
      },
      a10: {
        label: "Redirects",
        url: "",
        description:
          "Web applications frequently redirect and forward users to other pages and websites, and use untrusted data to determine the destination pages. Without proper validation, attackers can redirect victims to phishing or malware sites, or use forwards to access unauthorized pages."
      },
      a0: {
        label: "Other",
        url: "",
        description:
          "Threats which is not covered by the OWASP top 10, such as social engineering"
      }
    };
  },

  async getClassifiedData() {
    return [
      {
        id: 1,
        label: "Customer Profiles",
        type: "customer",
        classification: "red",
        quantity: "10000",
        access: [],
        notes:
          "Cras porta lobortis mi, a feugiat elit ultricies sit amet. Duis hendrerit felis a est consequat mollis id at dolor. Nulla eu ligula odio. Nunc consequat justo sit amet urna egestas, a congue quam congue. Aenean pharetra quam sed auctor fermentum."
      },
      {
        id: 2,
        label: "Article data",
        type: "stock",
        classification: "green",
        quantity: "10000",
        access: [],
        notes:
          "Publicly known article descriptions, pharetra quam sed auctor fermentum."
      }
    ];
  },

  async getSourceTypes() {
    return {
      employee: {
        label: "Employee Data",
        default: "green",
        icon: "fas fa-user-tie",

        classification: {
          green: {
            ex:
              "Contains no identifiable info, which can be linked to an employee"
          }
        }
      },
      customer: {
        label: "Customer Data",
        default: "orange",
        icon: "fas fa-user",

        classification: {
          green: {
            ex:
              "Contains no identifiable info, which can be linked to a customer"
          },

          yellow: {
            ex:
              "Contains no identifiable info, which can be linked to a customer"
          },
          orange: {
            ex: `Customer names,
                email, telephone number,
                address, date of birth, purchase
                and order data or any other data
                that can be linked to a customer
                by means of (any kind of)
                identifiers`
          },
          red: {
            ex: `Criminal conviction,
              ethnic/racial origin,
              health, religious,
              trade union
              membership, sexual
              orientation/activity,
              political opinions;
              customer payment
              details/instruments
              information (in
              particular credit
              card/PCI data)`
          }
        }
      },

      stock: {
        label: "Stock Data",
        default: "red",
        icon: "fas fa-box",

        classification: {
          green: {
            ex:
              "Contains no identifiable info, which can be linked to a customer"
          },

          yellow: {
            ex:
              "Contains no identifiable info, which can be linked to a customer"
          },
          orange: {
            ex: `Customer names,
              email, telephone number,
              address, date of birth, purchase
              and order data or any other data
              that can be linked to a customer
              by means of (any kind of)
              identifiers`
          },
          red: {
            ex: `Criminal conviction,
            ethnic/racial origin,
            health, religious,
            trade union
            membership, sexual
            orientation/activity,
            political opinions;
            customer payment
            details/instruments
            information (in
            particular credit
            card/PCI data)`
          }
        }
      }
    };
  },

  async getIssues() {
    const url = window.location.pathname + "/issues";
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }

    throw new Error("Could not retrieve issues for " + url);
  },

  async getAssessment() {
    const url = window.location.pathname + "/assessment";
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }

    throw new Error("Could not retrieve issues for " + url);
  },

  async saveAssessment(data) {
    const url = window.location.pathname + "/assessment/";
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    if (response.ok) {
      return response.json();
    }

    throw new Error("Could not post assessment to " + url);
  },

  async getConfig() {
    var config = {
      category: [
        {
          id: "confidentiality",
          label: "Confidentiality",
          description: "What happens if all the data is disclosed to the world?"
        },
        {
          id: "integrity",
          label: "Integrity",
          description:
            "What happens if the data is incorrect, misleading, defaced?"
        },
        {
          id: "availability",
          label: "Availability",
          description:
            "What happens if the data or service is missing, deleted or unreachable?"
        }
      ],

      access: {
        Create: "Creates new records",
        Read: "Reads existing records",
        Update: "Updates existing records",
        Delete: "Deletes existing records"
      },

      records: {
        "10": "No more than 10",
        "1000": "Less than 1000",
        "10000": "Between 1.000 and 10.000",
        "100000": "Between 10.000 and 100.000",
        "+100000": "More than 100.000"
      },

      owasp: this.getThreats(),

      impact: {
        reputation: {
          label: "Reputational Impact",
          description: "Who would notice the incident occurring?",
          icon: "fas fa-newspaper",

          levels: {
            low: "Insiders",
            medium: "Customers",
            high: "Industry news",
            maximum: "Mainstream news"
          }
        },

        productivity: {
          label: "Productivity Impact",
          description: "Amount of unplanned effort to resolve the incident?",
          icon: "fas fa-hammer",

          levels: {
            low: "24h < team effort",
            medium: "> 2d team effort",
            high: "Week long effort",
            maximum: "Big company effort"
          }
        },

        financial: {
          label: "Financial Impact",
          description: "Direct or indirect loss of money due to incident",
          icon: "fas fa-money-bill-alt",

          levels: {
            low: "No financial loss",
            medium: ">1k eur loss",
            high: "~10k eur loss",
            maximum: "More?"
          }
        }
      }
    };
    return config;
  }
};
