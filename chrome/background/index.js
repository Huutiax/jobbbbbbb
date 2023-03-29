import installReload from "./hmr";
import { LOGIN_COOKIE_DOMAIN, LOGIN_TOKEN_KEY } from "@/constants/token-key";
import axios from "axios";
import { uploadPrintInfo } from "@/api/dianxiaomi.js";
import shopeeSearchByImage from "./shopee-search-by-image.js";

// 右键菜单，shopee以图搜图功能
shopeeSearchByImage.init();

// import installRequest from "./request";

// axios({
//   url:
//     "https://www.dianxiaomi.com/printMb.htm?packageIds=66881650405351481&authId=66881643056561683&isCos=1",
//   method: "get",
//   responseType: "blob"
// })
//   .then(data => {
//     console.log(data);
//     const file = new File([data.data], "test.pdf", {
//       type: "application/pdf"
//     });
//     console.log(file);
//     // var downloadElement = document.createElement("a");
//     // var href = window.URL.createObjectURL(file);
//     // downloadElement.href = href;
//     // downloadElement.download = decodeURIComponent("test");
//     // document.body.appendChild(downloadElement);
//     // downloadElement.click();
//     // document.body.removeChild(downloadElement);
//     // window.URL.revokeObjectURL(href);
//     // console.log(data);
//     // const blob = new Blob([data.data]);

//     const formData = new FormData();
//     formData.append("UploadObject[file]", file); // pdf
//     formData.append("order_number", 299813362104355); // 订单号
//     formData.append("logistics_number", "MYMPA039446853"); // 物流单号

//     // // axios.post("https://erp.bz-bss.com/upload", formData);
//     uploadPrintInfo(formData);
//   })
//   .catch(err => console.log(err));

// 安装热刷新功能
if (process.env.NODE_ENV === "development") {
  installReload();
}
// installRequest();

// 定义操作
const actions = {
  /**
   * @description 获取cookie
   * @param { Object } message 消息对象
   * @return { Promise }
   */
  getCookies(message) {
    const url = message.domain;
    return new Promise(resolve => {
      // 获取指定网址的Cookie
      chrome.cookies.getAll(
        {
          url
        },
        function(result) {
          // 组装cookie
          const cookies = result.map(v => `${v.name}=${v.value}`).join(";");
          resolve(cookies);
        }
      );
    });
  },
  /**
   * @description 设置cookie
   * @param { Object } message 消息对象
   * @return { Promise }
   */
  setCookie(message) {
    const url = message.domain || LOGIN_COOKIE_DOMAIN;
    const cookie = message.cookie; // { name: xx, value: xx }
    console.log(message);
    return new Promise(resolve => {
      // 获取指定网址的Cookie
      chrome.cookies.set(
        {
          url,
          ...cookie
        },
        function(result) {
          // 组装cookie
          resolve(result);
        }
      );
    });
  },
  /**
   * @description 获取单个cookie
   * @param { Object } message 消息对象
   * @return { Promise }
   */
  getCookie(message) {
    const { domain, name } = message;
    return new Promise((resolve, reject) => {
      chrome.cookies.get(
        {
          url: domain,
          name
        },
        data => {
          resolve(data);
        }
      );
    });
  },
  /**
   * @description 删除单个cookie
   * @param { Object } message 消息对象
   * @return { Promise }
   */
  removeCookie(message) {
    const { domain, name } = message;
    console.log(domain, name);
    return new Promise((resolve, reject) => {
      chrome.cookies.remove(
        {
          url: domain,
          name
        },
        data => {
          resolve(data);
        }
      );
    });
  },
  /**
   * @description 获取指定tab页面
   * @param { Object } message 消息对象
   * @return { Promise }
   */
  getTab(message) {
    const urls = message.urls;
    return new Promise(resolve => {
      chrome.tabs.query({}, tabs => {
        const tab = tabs.filter(tab => {
          return urls.includes(tab.url);
        })[0];
        resolve(tab);
      });
    });
  },
  /**
   * @description 店小秘上传面单方法
   * @param { Object } message 消息对象
   * - string pdfUrl
   * @return
   */
  async uploadPrintPdf(message) {
    const { pdfData } = message;
    const { url, order_number, logistics_number } = pdfData;

    return axios({
      url,
      method: "get",
      responseType: "blob"
    })
      .then(data => {
        let file = new File([data.data], "test.pdf", {
          type: "application/pdf"
        });
        const formData = new FormData();
        formData.append("UploadObject[file]", file); // pdf
        formData.append("order_number", order_number); // 订单号
        formData.append("logistics_number", logistics_number); // 物流单号

        uploadPrintInfo(formData);
        file = null;
        return true;
      })
      .catch(err => console.log(err));
  },
  /** @description 1688图搜 */
  async searchImgIn1688(message) {
    try {
      const data = await shopeeSearchByImage.searchByImg(message.detailData);
      return Promise.resolve({
        success: true,
        data
      });
    } catch (err) {
      console.error(err);
      return Promise.resolve({
        success: false,
        message: err
      });
    }
  },
  openWindow(message) {
    const { url } = message;
    chrome.tabs.create(
      {
        active: true,
        url
      },
      null
    );
  },
  async getStorage(message) {
    const { name } = message;
    return Promise.resolve(sessionStorage.getItem(name));
  },
  setStorage(message) {
    const { name, value } = message;
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [name]: value }, data => {
        resolve(data);
      });
    });
  }
};

// 监听前台文件发送的消息
chrome.runtime.onMessage.addListener((message, sender, sendMessage) => {
  console.log(message);
  const action = message.action;
  // 不能使用es7的async和await方法，否则return true返回的是Promise包装的响应
  // 导致接收端无法正确接受到异步请求结果，而是undefined
  if (actions[action]) {
    actions[action](message).then(data => sendMessage(data));
    return true;
  }
  // 注意，异步方法必须返回true，而不是sendMessage
  return sendMessage("找不到对应的action");
});

// 拦截请求
// chrome.webRequest.onHeadersReceived.addListener(
//   function(details) {
//     // console.log("onHeadersReceived", details); //请求baidu .png文件时会拦截
//     //onHeadersReceived {frameId: 0, initiator: "chrome-extension://agkllkkjbhclhjnlebdbdagkagfgcecj", method: "GET", parentFrameId: -1, requestId: "72074", …}
//     return { cancel: false };
//   },
//   { urls: ["https://erp.datacaciques.com/*"] }
//   // ["responseHeaders", "blocking"]
// );

const BLOCK_URL_LIST = [
  "https://erp.datacaciques.com/ebay/post/listing/api_getList", // 数字酋长
  "https://api-service.chanmama.com/v1/home/author/search", // 禅妈妈
  "https://www.ebay.com.au/sh/research/api/search/v2", // ebay research
  "https://www.ebay.com.au/sh/research/api/search", // ebay research 有两个版本
  "https://creator.douyin.com/web/api/media/user/info/", // creator.douyin.com 用户信息

  "https://shopee.com.my/api/v4/search/search_items", // shopee 马来站搜索商品列表
  "https://shopee.co.th/api/v4/search/search_items", // shopee 泰国站搜索商品列表
  "https://shopee.tw/api/v4/search/search_items", // shopee 台湾站搜索商品列表
  "https://shopee.co.id/api/v4/search/search_items", // shopee 印度尼西亚站搜索商品列表
  "https://shopee.vn/api/v4/search/search_items", // shopee 越南站搜索商品列表
  "https://shopee.sg/api/v4/search/search_items", // shopee 新加坡站搜索商品列表
  "https://br.xiapibuy.com/api/v4/search/search_items", // shopee 巴西站搜索商品列表
  "https://shopee.ph/api/v4/search/search_items", // shopee 菲律宾站搜索商品列表

  "https://shopee.com.my/api/v4/item/get", // shopee 马来站搜索商品列表
  "https://shopee.co.th/api/v4/item/get", // shopee 泰国站搜索商品列表
  "https://shopee.tw/api/v4/item/get", // shopee 台湾站搜索商品列表
  "https://shopee.co.id/api/v4/item/get", // shopee 印度尼西亚站搜索商品列表
  "https://shopee.vn/api/v4/item/get", // shopee 越南站搜索商品列表
  "https://shopee.sg/api/v4/item/get", // shopee 新加坡站搜索商品列表
  "https://br.xiapibuy.com/api/v4/item/get", // shopee 巴西站搜索商品列表
  "https://shopee.ph/api/v4/item/get", // shopee 菲律宾站搜索商品列表

  "https://console.captainbi.com/FBA-fba_claim-fbaClaimDetail.html", // 船长索赔列表
  "https://console.captainbi.com/FBA-fba_claim-searchClaimForm.php", // 船长索赔列表
  "https://console.captainbi.com/FBA-fba_claim-fbaClaimDetail.php", // 船长索赔列表

  "https://www.ebay.com.au/fdbk/update_feedback_profile" // ebay feedback列表
];

// 请求前处理
// chrome.webRequest.onBeforeRequest.addListener(
//   details => {
//     console.log(details);
//   },
//   {
//     urls: ["https://s.1688.com/*"]
//   }
// );

// 请求后处理
chrome.webRequest.onCompleted.addListener(
  details => {
    const url = details.url.split("?")[0];
    if (BLOCK_URL_LIST.includes(url)) {
      console.log(details);
      chrome.tabs.sendRequest(details.tabId, {
        apiStatus: "completed",
        details
      });
    }
    return { cancel: false };
  },
  {
    urls: [
      "https://erp.datacaciques.com/*",
      "https://api-service.chanmama.com/*",
      "https://www.ebay.com.au/sh/research/*",
      "https://creator.douyin.com/*",
      // "https://shopee.com.my/*", // shopee商品搜索列表页
      // "https://shopee.co.th/*",
      "https://shopee.com.my/*",
      "https://shopee.com.br/*",
      "https://br.xiapibuy.com/*",
      "https://shopee.co.th/*",
      "https://shopee.tw/*",
      "https://shopee.co.id/*",
      "https://shopee.sg/*",
      "https://shopee.ph/*",
      "https://shopee.vn/*",
      "https://console.captainbi.com/*",
      "https://www.ebay.com.au/fdbk/update_feedback_profile*"
    ]
  }
);
