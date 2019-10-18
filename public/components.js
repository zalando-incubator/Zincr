Vue.component("data-classifier", {
  props: {
    datatypes: Object,
    type: String,
    classification: String
  },

  computed: {
    filteredTypes: function() {
      return this.datatypes[this.type].classification;
    },

    selectedType: function() {
      return this.datatypes[this.type].classification[this.classification].ex;
    }
  },

  methods: {
    dataTypeButtonClass: function(classification) {
      return "dt-" + classification;
    },

    toggle: function(color) {
      this.$emit("update:color", color);
    }
  },

  template: `

  <div>
  <div class="border d-flex">
      <a href
        v-bind:class="dataTypeButtonClass(color)"
        class="p-2 border flex-auto text-center h2"  
        v-for="(cla, color) in filteredTypes"
        v-on:click.prevent="toggle(color)">
        {{color}}
      </a> 
  </div>


  <div class="Popover right-0 left-0 position-relative">
      <div 
        v-bind:class="dataTypeButtonClass(classification)"  
        class="Popover-message text-left p-4 mt-2 mx-auto Box box-shadow-large">
        <h4 class="mb-2">{{classification}} {{type}} data</h4>
        <p>{{selectedType}}</p>
      </div>
    </div>

  </div>  
  `
});

Vue.component("menu-overlay", {
  props: {
    value: [String, Number],
    items: Array,
    width: String,
    valueField: String
  },

  data: function() {
    return {
      open: false
    };
  },

  methods: {
    created: function() {},
    toggle: function() {
      this.open = this.open ? false : true;
    },
    select: function(selected) {
      this.open = false;
      this.$emit("input", selected[this.valueField]);
    }
  },

  computed: {
    display: function() {
      if (this.value) {
        var find = this.items.filter(x => x[this.valueField] == this.value);
        console.log(find);

        if (find.length > 0) {
          return find[0];
        } else {
          this.$emit("input", null);
          return null;
        }
      }
      return null;
    }
  },

  template: `
  
  <div>

  <nav v-if="open" class="menu position-absolute box-shadow-large" 
  v-bind:style="{width: width + 'px'}" 
  style="margin-top: -70px; z-index: 99999; max-height: 500px; overflow: scroll" aria-label="Person settings">
  <span class="menu-item text-normal" v-on:click.prevent="select(item)" aria-current="page" v-for="item in items">
    <slot name="item" v-bind:item="item">
      <!-- Fallback content -->
      {{ item }}
    </slot>
  </span>
</nav>

    <span v-on:click.prevent="toggle()" class="text-normal">
      <slot name="label" v-bind:item="display">
        <span v-if="value">{{display}}</span>
        <span v-else>Select...</span>
      </slot>
    </span>

    

    </div>
  </div>
</details>


  `
});

Vue.component("dialog-overlay", {
  props: {
    title: String,
    width: [String, Number],
    height: [String, Number],
    enableDelete: Boolean
  },

  methods: {
    submit: function() {
      this.$emit("submit");
    },
    cancel: function() {
      this.$emit("cancel");
    },
    deleteItem: function() {
      this.$emit("delete");
    }
  },

  computed: {
    style: function() {
      return {
        width: this.width + "px",
        height: this.height + "px",
        "margin-top": -this.height / 2 + "px",
        "margin-left": -this.width / 2 + "px"
      };
    }
  },

  created: function() {},

  template: `
  <div 
  class="position-fixed top-0 left-0 bottom-0 right-0" 
  style="background: rgba(0, 0, 0, 0.5); z-index: 99999">
    
  <div 
      class="Box position-fixed"
      style="top: 50%; left: 50%;" 
      v-bind:style="style">

      <div v-if="title" class="Box-header">
        <h3 class="Box-title">
          {{title}}
        </h3>
      </div>
      <div class="Box-body text-left">
        <slot></slot>
      </div>

      <div class="Box-footer form-actions position-absolute left-0 bottom-0 right-0">
          <button v-if="enableDelete" type="submit" class="btn btn-danger float-left" 
          v-on:click="deleteItem()">Delete</button>

          <button type="submit" class="btn btn-primary" 
            v-on:click="submit()">Save</button>
          <button type="button" 
          v-on:click="cancel()" class="btn">Cancel</button>
        </div>
    </div>
  </div>
 `
});
