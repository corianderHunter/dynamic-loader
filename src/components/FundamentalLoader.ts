/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
import Vue from "vue";

import DynamicImport from "./DynamicImport.vue";

const fundamentalComponentConfig: string[][] = [
  [
    "demo-test",
    "https://cdn.jsdelivr.net/gh/corianderHunter/resource/js/component-DemoTest.umd.min.js",
  ],
];

export const eventPub: Record<string, Function> = {};

const componentLoader = (name: string, url: string) => {
  const instance = new Vue({
    name: "FundamentalLoader",
    render(h) {
      return h(DynamicImport, {
        props: { name, widgetUrl: url },
      });
    },
  });
  const component = instance.$mount();
  document.body.append(component.$el);
  eventPub[name] = () => {};
  return () => {
    //todo
  };
};

const init = () => {
  // eslint-disable-next-line prettier/prettier
  fundamentalComponentConfig.forEach(([componentName, url]) => {
    componentLoader(componentName, url);
  });
};

export default init;
