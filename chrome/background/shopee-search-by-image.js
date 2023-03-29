/**
 * @description shopee以图搜图
 * 仿 Shopee Search by image 插件
 * 结果页设计图 https://modao.cc/app/17c983e28e358c8d79441aa8910e8e332d7f1b0a?simulator_type=device&sticky#screen=skzqpxedyz40k90
 *
 * 1. 添加右键菜单，以图搜图
 * 2. 只要是图片都可以右键
 * 3. 详情banner图由于是background的形式，增加对background url的识别（无法做到，
 * 因右键菜单需要匹配类型，采用另外的办法，将详情内的banner以图的形式展示）
 * 4. 点击搜索跳到结果页
 *
 * @doc https://developer.chrome.com/docs/extensions/reference/contextMenus/
 * @core 核心sign获取功能参考该python项目 https://github.com/Zhui-CN/1688_image_search_crawler
 */
import { SHOPEE_PLAFORMS } from "@/constants/index.js";
import axios from "axios";
import md5 from "blueimp-md5";
import qs from "qs";
import Compressor from "compressorjs";

const guid = (code, imgUrl) => {
  return `${code}-${imgUrl}`;
};

export default {
  APP_KEY: "12574478",
  init() {
    console.log(chrome.contextMenus);
    chrome.contextMenus.create(
      {
        type: "normal",
        title: "Shopee以图搜图",
        id: "shopeeSearchByImage",
        contexts: ["image"]
      },
      function() {
        console.log("Shopee以图搜图右键菜单创建完成。");
      }
    );
    this.createChildren();
  },
  createChildren() {
    const _this = this;
    SHOPEE_PLAFORMS.forEach(item => {
      chrome.contextMenus.create({
        type: "normal",
        title: item.name,
        parentId: "shopeeSearchByImage", // 作为以图搜图子菜单
        contexts: ["all"],
        onclick: params => {
          console.log(params);
          _this.handleRightContextMenuSearch({
            ...item,
            imgUrl: params.srcUrl
          });
        }
      });
    });
  },
  /**
   * @description 邮件菜单图搜
   * @param {Object} params {code, imgUrl}
   */
  async handleRightContextMenuSearch(params) {
    const { code, host, imgUrl } = params;
    this.openWindowByUrl(
      `result.html?imgUrl=${imgUrl}&code=${code}&host=${host}`
    );
  },
  /**
   * @description 压缩图片到360宽，质量0.8
   */
  async compressImg(imgUrl) {
    return new Promise(async (resolve, reject) => {
      const file = await axios.get(imgUrl, { responseType: "blob" });
      const reader = new FileReader();
      try {
        reader.readAsDataURL(file.data);

        new Compressor(file.data, {
          size: 4, // the max size in MB, defaults to 2MB
          quality: 0.8, // the quality of the image, max is 1,
          width: 360,
          resize: true, // defaults to true, set false if you do not want to resize the image width and height
          rotate: false, // See the rotation section below
          success(result) {
            const reader = new FileReader();
            try {
              reader.readAsDataURL(result);
            } catch (err) {
              reject(err);
              console.error(err);
            }
            reader.onload = e => {
              const base64 = e.target.result.replace(/.+base64,/, "");
              resolve(base64);
            };
          }
        });
      } catch (err) {
        console.error(err);
      }
    });
  },
  getUrl(params) {
    const host =
      process.env.NODE_ENV === "product"
        ? "http://erpbi.bz-bss.com"
        : "http://localhost:1246";
    return `${host}/#/shopee-search-by-image?${Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join("&")}`;
  },
  async getImgBase64(imgUrl) {
    const file = await axios.get(imgUrl, { responseType: "blob" });
    const reader = new FileReader();
    try {
      reader.readAsDataURL(file.data);
    } catch (err) {
      console.error(err);
    }

    const base64 = await new Promise(resolve => {
      reader.onload = e => {
        console.log("[base64]:", e.target.result);
        const base64 = e.target.result.replace(/.+base64,/, "");
        resolve(base64);
      };
    });
    return base64;
  },
  async getToken() {
    // s.1688.com站点解析出token
    const token = await new Promise(resolve => {
      chrome.cookies.get(
        {
          url: "https://s.1688.com",
          name: "_m_h5_tk"
        },
        data => {
          if (!data || !data.value) {
            resolve("");
          } else {
            resolve(data.value.split("_")[0]);
          }
        }
      );
    });
    return token;
  },
  /**
   * @description 获取上传到1688的图片路径，拼接查询参数
   * @param {Object} params {timestamp, sign}
   * @return {String}
   */
  getUploadImgUrl(params) {
    const queryParams = {
      jsv: "2.4.11",
      appKey: this.APP_KEY,
      t: params.timestamp,
      sign: params.sign,
      api: "mtop.1688.imageService.putImage",
      ecode: "0",
      v: "1.0",
      type: "originaljson",
      dataType: "jsonp"
      // "_bx-v": "1.1.20"
    };
    const queryString = Object.keys(queryParams)
      .map(key => `${key}=${queryParams[key]}`)
      .join("&");
    return `https://h5api.m.1688.com/h5/mtop.1688.imageservice.putimage/1.0/?${queryString}`;
  },
  /**
   * @description 1688图搜
   * @param {Object} { imgUrl: 图片路径, base64: 图片base64，有content-script传过来 }
   * 1. 图片上传到阿里云os
   * 2. 拿到上传后的参数，调用图搜接口
   * 3. 将图搜接口响应格式化后传给后端
   */
  async searchByImg(detailData) {
    // 图片url获取base64编码
    // 这里有个问题：
    // 1688在上传的时候会对图片进行压缩，再去base64
    // 如果不压缩，搜索到的产品和1688页面内搜索到的有很大不同
    // const base64 = await this.getImgBase64(imgUrl);
    // axios.defaults.withCredentials = true;

    const base64 = await this.compressImg(detailData.imgUrl);

    // 图片上传到阿里云的表单参数
    const imgData = {
      imageBase64: base64,
      appName: "searchImageUpload",
      appKey: "pvvljh1grxcmaay2vgpe9nb68gg9ueg2"
    };

    // 关键参数md5 获取sign
    const token = await this.getToken(); // s.1688.com站点解析出token
    if (!token) {
      return Promise.reject("请登录1688后再刷新当前页面！");
    }

    const timestamp = new Date().getTime();
    const s = JSON.stringify(imgData);
    const t = token + "&" + timestamp + "&" + this.APP_KEY + "&" + s;
    const sign = md5(t);

    try {
      // 图片上传到阿里云
      // 获取上传链接
      const url = this.getUploadImgUrl({ timestamp, sign });
      let data = await axios.post(url, qs.stringify({ data: s }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      // console.log("data", data);
      // FAIL_SYS_ILLEGAL_ACCESS::非法请求
      // FAIL_SYS_ILLEGAL_ACCESS::令牌过期
      // SUCCESS::调用成功
      const errMsg = data.data.ret[0];
      if (errMsg) {
        if (errMsg === "FAIL_SYS_ILLEGAL_ACCESS::非法请求") {
          return Promise.reject("非法请求");
        } else if (errMsg === "FAIL_SYS_ILLEGAL_ACCESS::令牌过期") {
          return Promise.reject("请登录1688后再刷新当前页面！");
          // 再请求一次
          // data = await axios.post(url, qs.stringify({ data: s }), {
          //   headers: {
          //     "Content-Type": "application/x-www-form-urlencoded"
          //   }
          // });
        }
      }

      const imgRes = data.data.data;

      // 调用图搜列表api前，获取关键的requestId等参数
      // https://search.1688.com/service/getSearchImageUpload?imageId=1795907338592151237&pageName=image&sessionId=99b42dcd31c44dadb512f57b2d1c7ade&_bx-v=1.1.20

      // const requestParams = await axios.get('https://search.1688.com/service/getSearchImageUpload', {
      //   ...imgRes,
      //   '_bx-v': '1.1.20'
      // })
      // console.log(requestParams)

      const searchRes = await axios({
        url:
          "https://search.1688.com/service/imageSearchOfferResultViewService",
        params: {
          tab: "imageSearch",
          beginPage: 1,
          pageSize: 40,
          pageName: "image",
          "_bx-v": "1.1.20",
          imageId: imgRes.imageId,
          imageIdList: imgRes.imageId,
          // pailitaoCategoryId: 4, // 不能写0，0会被默认为衣服类
          requestId: imgRes.requestId,
          sessionId: imgRes.sessionId,
          // 按销售从高到低排序
          sortField: "sold_quantity",
          sortType: "desc"
        }
      });
      console.log("searchRes", searchRes);
      // 返回关键信息，剔除无用的
      const list = searchRes.data.data.data.offerList.map(item => {
        return {
          title: item.information.subject, // 商品标题
          link: item.information.detailUrl, // 1688详情地址
          imgUrl: item.image.imgUrl, // 图片地址
          symbol: "人民币",
          gmv30dRt: item.tradeQuantity.gmv30dRt, // 30天销售额
          quantitySumMonth: item.tradeQuantity.quantitySumMonth, // 月销量
          priceInfo: item.tradePrice.offerPrice.priceInfo, // 价格信息
          quantityPrices: item.tradePrice.offerPrice.quantityPrices // 区间价格信息
        };
      });
      // const _guid = guid(detailData.code, detailData.imgUrl);
      // // 存储数据 - key为itemId和imgUrl组合
      // sessionStorage.setItem(
      //   _guid,
      //   JSON.stringify({
      //     ...detailData,
      //     list
      //   })
      // );
      // this.openWindowByUrl(
      //   `result.html?guid=${_guid}&imgUrl=${detailData.imgUrl}&code=${detailData.code}&host=${detailData.host}`
      // );
      return list;
    } catch (err) {
      console.error(err);
      return Promise.reject(err.message);
    }
  },
  openWindowByUrl(url) {
    chrome.tabs.create(
      {
        active: true,
        url
      },
      null
    );
  }
};
