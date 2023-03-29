// import Vue from "vue";
// import App from "./components/App.vue";
// import insert from "@/utils/insert";
// import stroe from "@/mixins/store";
// import "@/plugins/element-ui.js";

// 注入js到页面
import { UPLOAD_COOKIE_INFO } from "@/api/info";
if (
  location.href === "https://creator.douyin.com/creator-micro/creator/message"
) {
  UPLOAD_COOKIE_INFO({
    type: 3, // 类型5其实跟4是一样的，需要多传一个compass_cookie
    cookie: document.cookie,
    user_agent: navigator.userAgent,
    aid: "2906"
  })
    .then(data => console.log(data))
    .catch(err => console.error(err));
}
console.log(chrome);
chrome.cookies.getAll({ url: location.href }, res => {
  console.log("cookie", res);
});

injectJS();

// Vue.mixin(stroe);

// 插入组件到页面中
// insert(App);
const inject = path => {
  return new Promise((resolve, reject) => {
    path = path || "/js/inject.js";
    const s = document.createElement("script");
    s.setAttribute("type", "text/javascript");
    s.setAttribute("id", new Date().getTime() + Math.random() * 100);
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    s.src = chrome.extension.getURL(path);
    s.onload = function() {
      resolve();
      // 放在页面不好看，执行完后移除掉
      // this.parentNode.removeChild(this)
    };
    document.body.appendChild(s);
  });
};

function injectJS() {
  document.addEventListener("readystatechange", async () => {
    if (process.env.NODE_ENV === "production") {
      await inject("js/chunk-common/chunk-vendors.js");
      await inject("js/chunk-vendors/chunk-vendors.js");
    }
    await inject();
  });
}

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
