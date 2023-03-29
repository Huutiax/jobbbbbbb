import Vue from "vue";
import index from "./index.vue";
import "@/styles/index.scss";
import "normalize.css/normalize.css";
import "@/plugins/element-ui.js";
// 按需引入vxe-table
import "@/plugins/utils.js";
import "@/plugins/table.js";

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(index)
});
