import http from "@/utils/request";

const getHeaders = (contentType = "application/multipart/form-data") => {
  return {
    "Content-Type": contentType
  };
};
const PREFIX = "https://callback.erp.bz-bss.com";
const TOKEN = "e8bf1231-b9c7-4e7e-b9b7-ef8835c8345a";

// 获取用户信息
export const FETCH_USER_INFO = () =>
  http.get("https://buyin.jinritemai.com/index/getUser");

// 获取订单列表
export const FETCH_ORDER_LIST = params =>
  http.get("https://buyin.jinritemai.com/api/author/order/details", params);
// 上传订单列表
export const UPLOAD_ORDER_LIST = (data, userId) =>
  http.post(
    `${PREFIX}/tiktok/tiktok-selection-alliance-order?token=${TOKEN}&user_id=${userId}`,
    data,
    getHeaders()
  );

// 获取直播间列表数据
export const FETCH_LIVE_ROOM_LIST = params =>
  http.get("https://buyin.jinritemai.com/api/livepc/data/list/", params);
// 上传直播间列表数据
export const UPLOAD_LIVE_ROOM_LIST_DATA = (data, userId) =>
  http.post(
    `${PREFIX}/tiktok/tiktok-settle-room-data?token=${TOKEN}&user_id=${userId}`,
    data,
    getHeaders()
  );

// 获取单个直播间详情看板数据
export const FETCH_LIVE_ROOM_DASHBOARD_DATA = room_id =>
  http.get("https://buyin.jinritemai.com/api/livepc/data/room/overview/", {
    room_id
  });
// 上传单个直播间详情看板数据
export const UPLOAD_LIVE_ROOM_DASHBOARD_DATA = (data, userId) => {
  return http.post(
    `${PREFIX}/tiktok/tiktok-live-room-data?token=${TOKEN}&user_id=${userId}`,
    data,
    getHeaders()
  );
};

// 获取单个直播间详情商品数据
export const FETCH_LIVE_ROOM_PRODUCT_DATA = room_id =>
  http.get("https://buyin.jinritemai.com/api/livepc/data/room/product/list/", {
    room_id,
    page: 1,
    size: 100,
    sort_field: "bind_time"
  });
// 上传单个直播间详情商品数据
export const UPLOAD_LIVE_ROOM_PRODUCT_DATA = (data, userId) =>
  http.post(
    `${PREFIX}/tiktok/tiktok-live-room-product-stats-data?token=${TOKEN}&user_id=${userId}`,
    data,
    getHeaders()
  );
