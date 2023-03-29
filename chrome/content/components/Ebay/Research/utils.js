import queryString from "query-string";

//获取url中的参数
export function getUrlParam() {
  return queryString.parse(location.search);
}

// 构造查询参数
export function joinUrlParam(params) {
  return queryString.stringify(params);
}

export function formatDate(data) {
  const [d, m, y] = data.split("/");
  return `${y}-${m}-${d}`;
}

export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
