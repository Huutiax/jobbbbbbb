import http from "@/utils/request";

export const login = data =>
  http.post("https://ebayplugin.bz-bss.com/Ebay/ToLogin", data);

// export const getUserInfo = token =>
//   http.get("https://ebayplugin.bz-bss.com/Ebay/GetUserData", null, {
//     "User-Auth": "Basic " + token
//   });
export const getUserInfo = token =>
  http({
    url: "https://ebayplugin.bz-bss.com/Ebay/GetUserData",
    method: "GET",
    headers: {
      "User-Auth": "Basic " + token
    }
  });
