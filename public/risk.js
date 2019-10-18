import riskdata from "./data.js";

const debounce = (func, delay) => {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

export function start(org, repo) {
  // @ts-ignore
  var app = new Vue({
    el: "#app",
    delimiters: ["${", "}"],

    created: async function() {
      this.config = await riskdata.getConfig();
      this.datasources.types = await riskdata.getSourceTypes();
      var assessment = await riskdata.getAssessment();

      this.classified = assessment && assessment.data ? assessment.data : [];
      this.scenarios = assessment && assessment.events ? assessment.events : [];

      this.issues = await riskdata.getIssues();
    },

    updated: function() {
      debounce(this.mapLines(this.scenarios), 10000);
    },

    data: {
      test: null,
      config: {},

      datasources: {
        dataSourceModel: null,
        types: {}
      },

      classified: [],
      scenarios: [],
      issues: [],

      threatEditor: {
        lines: [],
        threat: null,
        event: null,
        outcome: null
      }
    },

    computed: {
      classifiedData: function() {
        var data = this.classified;

        data.map(x => {
          x.sourcetype = this.datasources.types[x.type];
        });

        return data;
      },

      filteredThreats: function() {
        var threats = this.config.threats;
        return threats;
      },

      filteredEvents: function() {
        var events = this.scenarios;
        events.map(x => {
          x.datasource = this.classified.filter(d => d.id === x.data)[0];
        });

        return events;
      },

      filteredOutcomes: function() {
        return this.consequences;
      },

      filteredIssues: function() {
        var issues = this.issues;
        return issues;
      },

      impactAsArray: function() {
        return Object.keys(this.config.impact).map(key => {
          var val = this.config.impact[key];
          val.id = key;
          return val;
        });
      },

      threatAsArray: function() {
        return Object.keys(this.config.owasp).map(key => {
          var val = this.config.owasp[key];
          val.id = key;
          return val;
        });
      }
    },

    methods: {
      datasource_new: function(type, name) {
        var source = this.datasources.dataSourceModel || {
          label: "",
          quantity: "+100.000",
          note: "",
          access: []
        };

        source.type = name;
        source.classification = type.default;

        this.datasources.dataSourceModel = source;
      },

      datasource_edit: function(model) {
        this.datasources.dataSourceModel = model;
      },

      datasource_save: function(model) {
        if (!model.id) {
          model.id = Math.max(this.classified.map(x => x.id)) + 1;
          this.classified.push(model);
        } else {
          var elementPos = this.classified.map(x => x.id).indexOf(model.id);
          if (elementPos >= 0) {
            this.classified[elementPos] = model;
          } else {
            this.classified.push(model);
          }
        }

        this.datasources.dataSourceModel = null;
      },

      datasource_delete: function(index) {
        this.classified.splice(index, 1);
      },

      assessment_save: async function() {
        await riskdata.saveAssessment({
          data: this.classified,
          events: this.scenarios
        });
      },

      threat_new: function(event, threat) {
        var t = {
          category: "",
          description: ""
        };
        if (threat) {
          t.category = threat.category;
          t.description = threat.description;
          t.editingThreat = threat;
        }
        t.editingEvent = event;
        this.threatEditor.threat = t;
      },

      threat_save: function(model) {
        if (model.editingThreat) {
          model.editingThreat.category = model.category;
          model.editingThreat.description = model.description;
        } else if (model.editingEvent) {
          model.editingEvent.threats.push({
            category: model.category,
            description: model.description
          });
        }
        this.threatEditor.threat = null;
      },

      event_new: function(event) {
        var e = {
          category: "",
          description: "",
          threats: [],
          outcomes: []
        };

        if (event) {
          e.type = event.type;
          e.description = event.description;
          e.data = event.data;
          e.editingEvent = event;
        }

        this.threatEditor.event = e;
      },

      event_save: function(model) {
        if (model.editingEvent) {
          model.editingEvent.type = model.type;
          model.editingThreat.description = model.description;
          model.editingThreat.data = model.data;
        } else {
          this.scenarios.push(model);
        }

        this.threatEditor.event = null;
      },

      outcome_new: function(event, outcome) {
        var t = {
          type: "reputation",
          impact: "high",
          description: "Something something"
        };

        if (outcome) {
          t.type = outcome.type;
          t.description = outcome.description;
          t.impact = outcome.impact;

          t.editingOutcome = outcome;
        }

        t.editingEvent = event;
        this.threatEditor.outcome = t;
      },

      outcome_save: function(model) {
        if (model.editingOutcome) {
          model.editingOutcome.type = model.type;
          model.editingOutcome.description = model.description;
          model.editingOutcome.impact = model.impact;
        } else if (model.editingEvent) {
          model.editingEvent.outcomes.push({
            type: model.type,
            impact: model.impact,
            description: model.description
          });
        }
        this.threatEditor.outcome = null;
      },

      dataTypeRowClass: function(color) {
        return "dt-" + color;
      },

      impactColor: function(impact) {
        const cols = {
          low: "dt-green",
          medium: "dt-yellow",
          high: "dt-orange",
          maximum: "dt-red"
        };

        return cols[impact];
      },

      impactIcon: function(type) {
        return this.config.impact[type].icon;
      },

      mapLines: function(events) {
        console.log("Mapping lines");

        var lines = this.threatEditor.lines;
        lines.forEach(x => x.remove());
        lines.length = 0;

        events.forEach(event => {
          var e_el = "e_" + event.id;

          event.threats.forEach((threat, index) => {
            var t_el = e_el + "_t_" + index;

            lines.push(
              new LeaderLine(
                document.getElementById(t_el),
                document.getElementById(e_el)
              )
            );
          });

          event.outcomes.forEach((outcome, index) => {
            var o_el = e_el + "_o_" + index;

            lines.push(
              new LeaderLine(
                document.getElementById(e_el),
                document.getElementById(o_el)
              )
            );
          });
        });
      }
    }
  });
}
