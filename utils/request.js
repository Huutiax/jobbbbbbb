// import axios from "axios";
// import config from "@/config";

// class HttpRequest {
//   constructor(baseUrl) {
//     this.baseUrl = baseUrl;
//   }
//   // 设置请求配置
//   getInsideConfig() {
//     const config = {
//       baseURL: this.baseUrl,
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded"
//         // "Content-Type": "multipart/form-data"
//       },
//       transformRequest: [
//         function(data, config) {
//           // 对 data 进行任意转换处理
//           if (
//             config["Content-Type"] &&
//             config["Content-Type"].indexOf("multipart/form-data") > -1
//           ) {
//             const formData = new FormData();
//             formData.append("data", JSON.stringify(data));
//             return formData;
//           } else if (
//             config["Content-Type"] &&
//             config["Content-Type"].indexOf("application/json") > -1
//           ) {
//             return JSON.stringify(data);
//           } else {
//             // return qs.stringify(data, config);
//             return JSON.stringify(data);
//           }
//         }
//       ]
//     };

//     return config;
//   }

//   interceptors(instance) {
//     // 请求拦截
//     instance.interceptors.request.use(
//       config => config,
//       error => Promise.reject(error)
//     );
//     // 响应拦截
//     instance.interceptors.response.use(
//       res => {
//         const data = res.data;
//         const code = data.code;
//         if (code === 0) {
//           return Promise.resolve(data.data);
//         } else if (code === -1) {
//           return Promise.reject(data.message || data.msg);
//         } else if (code === -99) {
//           return Promise.reject("登录token已失效");
//         }
//       },
//       error => Promise.reject(error)
//     );
//   }

//   request(options) {
//     const instance = axios.create();

//     options = Object.assign(this.getInsideConfig(), options);
//     this.interceptors(instance);
//     return instance(options);
//   }
// }
// const http = new HttpRequest(config.BASE_API_URL);

// export default http;

import axios from "axios";
import config from "@/config";

const service = axios.create({
  baseURL: config.BASE_API_URL,
  withCredentials: true // send cookies when cross-domain requests
});

service.interceptors.request.use(
  config => {
    const type = config.headers["Content-Type"];
    if (type && type.indexOf("application/json") > -1) {
      config.data = JSON.stringify(config.data);
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  res => {
    const data = res.data;
    const code = data.code;
    // console.log(res);
    // // 非erp的接口，统一返回data
    // if (res.config.url.indexOf("https://tools-api.erp.bz-bss.com") === -1) {
    //   return Promise.resolve(data.data || data.response);
    // }
    const url = res.config.url;
    if (url.indexOf("api-service.chanmama.com") > -1) {
      return Promise.resolve(data.data || data.response);
    }
    if (code === 0) {
      return Promise.resolve(
        url.indexOf("api/author/order/details") > -1
          ? data
          : data.data || data.response || data.result
      );
    } else if (code === -1) {
      return Promise.reject(data.message || data.msg);
    } else if (code === -99) {
      return Promise.reject("登录token已失效");
    } else if (code === 1105) {
      // 精选联盟操作异常
      return Promise.reject("操作异常");
    }
  },
  error => Promise.reject(error)
);

service.get = (url, params, headers) => {
  return service({
    method: "GET",
    url,
    params,
    headers
  });
};
service.post = (url, data, headers) => {
  return service({
    method: "POST",
    url,
    data,
    headers
  });
};

export default service;
