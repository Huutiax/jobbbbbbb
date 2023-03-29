import http from "@/utils/request";

export const getCurrencyRate = () => http.get("/shopee/get-currency");

export const getShopeeImgSearchList = (data, token) =>
  http({
    url: "https://ebayplugin.bz-bss.com/product/Search",
    method: "POST",
    headers: {
      "User-Auth": "Basic " + token
      // "Content-Type": "multipart/form-data"
    },
    data
  });
