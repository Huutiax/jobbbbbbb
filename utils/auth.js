import Cookies from "js-cookie";

export function getToken(tokenKey) {
  return Cookies.get(tokenKey);
}

/**
 * @date 2020/04/30 13:49
 * @author 潜
 * @description 设置token
 * @param { String } tokenKey
 * @param { String } token
 * cookie设置过期时间
 */
export function setToken(tokenKey, token) {
  // let expires = 1; // 1天过期
  // if (isRemember) {
  //   // 当天23:59:59
  //   expires = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
  // }
  return Cookies.set(tokenKey, token);
}

export function removeToken(tokenKey) {
  return Cookies.remove(tokenKey);
}
