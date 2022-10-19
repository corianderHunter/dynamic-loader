<template>
  <component
    :is="componentName"
    v-bind="$attrs"
    v-on="$listeners"
    v-if="ready"
  ></component>
</template>

<script>
import loadjs from "loadjs";
import { eventPub } from "./FundamentalLoader";

export default {
  name: "DynamicImport",
  inheritAttrs: true,
  props: {
    name: {
      type: String,
      required: false,
      default: "",
    },
    widgetUrl: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    const URL_REG =
      /(^https?|^ftp|^file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
    return {
      pureUrls: [],
      // eslint-disable-next-line prettier/prettier
      checkUrl: (url) => URL_REG.test(url),
      ready: false,
      initName: "",
    };
  },
  computed: {
    componentName() {
      return this.name || this.initName;
    },
  },
  methods: {
    async loadDependencies() {
      if (!this.componentName) return false;
      await this.readData();
    },

    async readData(res) {
      try {
        const { widgetUrl } = this;
        if (!this.checkUrl(widgetUrl)) throw new Error("Illegal address");
        loadjs(widgetUrl, this.componentName, {
          numRetries: 3,
          returnPromise: false,
        });
        loadjs.ready(this.componentName, {
          success: () => {
            this.$nextTick(() => {
              this.ready = true;
              this.$nextTick(() => {
                eventPub[this.componentName]();
              });
            });
          },
          error(error) {
            // eslint-disable-next-line no-console
            console.log("loadjs error:", error);
          },
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    },
  },
  created() {
    this.loadDependencies();
  },
};
</script>
