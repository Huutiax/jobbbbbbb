import http from "@/utils/request";
import { getToken } from "@/utils/auth";
import { ERPBI_TOKEN_KEY } from "@/constants/token-key";

const getHeaders = (contentType = "multipart/form-data") => {
  return {
    "Content-Type": contentType,
    token: getToken(ERPBI_TOKEN_KEY)
  };
};
const prefix = "https://api.bz-bss.com";

const makeFormData = (data, stringify = true) => {
  const formData = new FormData();
  formData.append("data", stringify ? JSON.stringify(data) : data);
  return formData;
};

export const LOGIN = data =>
  http.post(prefix + "/user/login", data, {
    "Content-Type": "application/json"
  });

// 添加任务
export const ADD_MISSION = mission =>
  http.post(prefix + "/tiktok/bi-mission/add", mission, getHeaders());

// 修改任务状态
export const EDIT_MISSION = data => {
  const formData = new FormData();
  formData.append("id", data.id);
  formData.append("type", data.type);
  return http.post(prefix + "/tiktok/bi-mission/edit", formData, getHeaders());
};

// 任务列表
export const GET_MISSIONS = () =>
  http.get(prefix + "/tiktok/bi-mission/list", { type: "0,1" }, getHeaders());

// 基础分析入库
export const ADD_BASIC_DATA = data =>
  http.post(
    prefix + "/tiktok/bi-chanmama-author-put/base",
    makeFormData(data),
    getHeaders()
  );

// 直播分析入库
export const ADD_LIVE_DATA = data =>
  http.post(
    prefix + "/tiktok/bi-chanmama-author-put/live",
    makeFormData(data),
    getHeaders()
  );

// 视频分析入库
export const ADD_VIDEO_DATA = data =>
  http.post(
    prefix + "/tiktok/bi-chanmama-author-put/video",
    makeFormData(data),
    getHeaders()
  );

// 电商分析入库
export const ADD_PRODUCT_DATA = data =>
  http.post(
    prefix + "/tiktok/bi-chanmama-author-put/commerce",
    makeFormData(data),
    getHeaders()
  );

// 粉丝分析入库
export const ADD_FANS_DATA = data =>
  http.post(
    prefix + "/tiktok/bi-chanmama-author-put/fans",
    makeFormData(data),
    getHeaders()
  );
