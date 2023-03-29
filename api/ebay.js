// 通过item id数组查询改item是否在ebay开发产品中
import http from "@/utils/request";
const URL = "https://tools-api.erp.bz-bss.com";
const TOKEN = "linshichulitigonggeichajiande"; // 固定token

export function queryIfItemsInEbayProductDevelope(data) {
  return http({
    url: "/ebay-plugin/develop-itemid",
    method: "POST",
    headers: {
      token: TOKEN, // 此接口固定token
      "Content-Type": "multipart/form-data"
    },
    data
  });
}

export function fetchRankItemData(data) {
  return http({
    url: URL + "/ebay/ebay-rank-item-data",
    method: "POST",
    headers: {
      token: TOKEN, // 此接口固定token
      "Content-Type": "multipart/form-data"
    },
    data
  });
}
export function fetchRankItemData2(data) {
  return http({
    url: URL + "/ebay/ebay-rank-item-data-v2",
    method: "POST",
    headers: {
      token: TOKEN, // 此接口固定token
      "Content-Type": "multipart/form-data"
    },
    data
  });
}

// ebay research 保存时间段
export function saveDateRange(range) {
  return http({
    url:
      "https://www.ebay.com.au/sh/research/api/preference?module=lastDateRange",
    method: "PUT",
    data: {
      lastPredefinedRange: "",
      lastCustomDateRange: range //"1617897600000, 1618329600000"
    }
  });
}

// ebay获取sku绑定人列表、海外仓库存等
export function fetchSkuBindUsers(data) {
  return http({
    url: URL + "/ebay/sku-list-report",
    method: "POST",
    headers: {
      token: TOKEN, // 此接口固定token
      "Content-Type": "multipart/form-data"
    },
    data
  });
}

// ebay获取sku库龄和数量
export function fetchSkuStockAgeAndQuantity(data) {
  return http({
    url: URL + "/ebay/stock-age",
    method: "POST",
    headers: {
      token: TOKEN, // 此接口固定token
      "Content-Type": "multipart/form-data"
    },
    data
  });
}
