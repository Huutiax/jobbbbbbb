import http from "@/utils/request";

// business.oceanengine
// 获取用户信息
export const FETCH_OCEANENGINE_USER_INFO = () =>
  http.get("https://business.oceanengine.com/nbs/api/bm/user/login_status");

// 上传cookie等信息
export const UPLOAD_COOKIE_INFO = data =>
  http.post(
    "https://callback.erp.bz-bss.com/live-account/update-login-info",
    data
  );
