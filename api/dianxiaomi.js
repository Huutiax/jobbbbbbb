import http from "@/utils/request";
const URL = "https://tools-api.erp.bz-bss.com";

const getHeaders = (contentType = "application/multipart/form-data") => {
  return {
    "Content-Type": contentType
  };
};

// 拉取单号列表
export const getOrderList = () => http.get(URL + "/lazada/order-to-get-label");

// 上传面单接口
export const uploadPrintInfo = data =>
  http.post(URL + "/lazada/set-label", data);
