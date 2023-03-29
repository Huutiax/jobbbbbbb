// import Vue from "vue";
import App from "./App.vue";
import insert from "@/utils/insert";
// import stroe from "@/mixins/store";
import "@/plugins/element-ui.js";

// element-ui icon
(function insertElementIcons() {
  let elementIcons = document.createElement("style");
  elementIcons.textContent = `
    @font-face {
    font-family: "element-icons";
    src: url('${window.chrome.extension.getURL(
      "fonts/element-icons.woff"
    )}') format('woff'),
    url('${window.chrome.extension.getURL(
      "fonts/element-icons.ttf "
    )}') format('truetype'); /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
    }
  `;
  document.head.appendChild(elementIcons);
})();

const inserLink = path => {
  let link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", chrome.extension.getURL(path));
  document.head.appendChild(link);
};

// 样式 --- 防止有些情况导致的样式丢失
(function insertLink() {
  if (process.env.NODE_ENV === "production") {
    inserLink("/css/chunk-common/chunk-vendors.css");
    inserLink("/css/chunk-vendors/chunk-vendors.css");
    inserLink("/css/content.css");
  }
})();

// 插入组件到页面中
insert(App);
