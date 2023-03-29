<template>
  <span></span>
  <!-- <div>
    <div class="shopee-search-by-image" :style="currentStyle">
      <el-button icon="el-icon-search" round></el-button>
      <ul>
        <li
          v-for="(item, index) in list"
          :key="index"
          @click="handleAction(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div> -->
</template>

<script>
/**
 * @description shopee以图搜图补充功能，详情页显示图片以便以图搜图功能可以识别出来
 */
import $ from "jquery";
import { sleep } from "@/utils";
import { SHOPEE_PLAFORMS } from "@/constants/index.js";
import Compressor from "compressorjs";
import axios from "axios";

export default {
  name: "ShopeeSearchByImage",
  data() {
    return {
      list: SHOPEE_PLAFORMS,
      currentStyle: {},
      currentParams: {}
    };
  },
  mounted() {
    console.log("========== shopee以图搜图补充功能 =========");
    this.init();
    chrome.extension.onRequest.addListener(async request => {
      console.log(request.apiStatus);
      if (request.apiStatus === "completed") {
        await sleep(1500);
        this.init();
      }
    });
    // this.listenA();
  },
  methods: {
    listenA() {
      const handler = e => {
        const target = $(e.target)
          .children('a[data-sqe="link"]')
          .toArray()[0];

        // 必须含有商品详情的链接才是商品项
        if (
          !target ||
          $(target)
            .attr("href")
            .indexOf("-i.") === -1
        ) {
          return;
        }

        // $(target).
        const link = `${location.origin}${$(target).attr("href")}`;
        const imgs = $(target)
          .find("img")
          .toArray();
        const targetImg = imgs.find(item => !!$(item).attr("alt"));
        const imgUrl = $(targetImg).attr("src");
        const title = $(targetImg).attr("alt");

        if ($(e.target).find(".shopee-search-by-image").length === 0) {
          $(e.target).css({
            display: "block",
            position: "relative"
          });
          $(e.target).prepend(
            `
            <div class="shopee-search-by-image">
              <button class="el-button el-button--default el-button--mini is-round">
                <i class="el-icon-search"></i>
              </button>
              <ul>
                ${SHOPEE_PLAFORMS.map(item => {
                  return `<li data-item='${JSON.stringify({
                    code: item.code,
                    host: item.host,
                    imgUrl,
                    title,
                    link
                  })}'>
                      ${item.name}
                    </li>`;
                }).join("")}
              </ul>
            </div>
          `
          );
          const _this = this;
          $(e.target)
            .find(".shopee-search-by-image li")
            .click(function(e) {
              _this.handleAction($(this).data("item"));
            });
        }
      };

      $(document).on("mouseover", ".shopee-search-item-result__item", handler);
      $(document).on(
        "mouseover",
        ".stardust-tabs-panels__panel ._2x8AVA",
        handler
      );
      $(document).on(
        "mouseover",
        ".image-carousel__item-list .image-carousel__item .product-recommend-items__item-wrapper",
        handler
      );
    },
    handleAction(item) {
      const { link, imgUrl, title } = this.currentParams;
      chrome.runtime.sendMessage({
        action: "openWindow",
        url: `result.html?${Object.keys(item)
          .map(key => `${key}=${item[key]}`)
          .join("&")}`
      });
    },
    async init() {
      this.showSearchMenu();
      const _this = this;

      $(".shopee-search-by-image li").click(async function(e) {
        // const loading = _this.$loading({
        //   lock: true,
        //   text: "正在1688进行图搜，请稍后...",
        //   background: "rgba(0, 0, 0, 0.7)"
        // });

        // 图片路径
        const imgUrl = _this.getImgUrl(this);
        // 站点编码，域名
        const { host, code } = $(this).data("item");

        if (!imgUrl) {
          return;
        }
        const detailData = _this.getProductInfo();
        const categoryData = detailData.categoryData.itemListElement.map(
          item => item.item.name
        );
        console.log(detailData);

        chrome.runtime.sendMessage({
          action: "openWindow",
          url: `result.html?imgUrl=${imgUrl}&code=${code}&host=${host}&title=${
            detailData.name
          }&itemId=${detailData.productID}&link=${
            detailData.url
          }&categoryName=${categoryData
            .slice(0, categoryData.length - 1)
            .join(" > ")}`
        });
        // chrome.tabs.create(
        //   {
        //     active: true,
        //     url: `result.html?imgUrl=${detailData.imgUrl}&code=${
        //       detailData.code
        //     }&host=${location.hostname}&title=${detailData.name}&itemId=${
        //       detailData.productID
        //     }&link=${detailData.url}&categryName=${categoryData
        //       .slice(0, categoryData.length - 1)
        //       .join(" > ")}`
        //   },
        //   null
        // );
        return;

        // 判断后台是否有存该数据

        // 一定要对图片进行压缩和修改尺寸
        // 固定为360px宽，质量0.8
        // 如果不压缩，搜索到的产品精确度极低，与1688官方搜索结果不一致
        // 1688官方是进行了压缩和固定宽度的
        // const base64 = await _this.compressImg(imgUrl);
        // console.log("base64", base64);

        try {
          const data = await new Promise(resolve => {
            chrome.runtime.sendMessage(
              {
                action: "searchImgIn1688",
                // base64,
                detailData: {
                  code,
                  imgUrl,
                  itemId: detailData.productID,
                  categoryName: categoryData
                    .slice(0, categoryData.length - 1)
                    .join(" > "),
                  title: detailData.name,
                  host: location.hostname,
                  link: detailData.url,
                  priceInfo: {
                    highPrice: detailData.offers.highPrice,
                    lowPrice: detailData.offers.lowPrice,
                    currency: detailData.offers.priceCurrency
                  }
                }
              },
              data => {
                resolve(data);
              }
            );
          });
          console.log("data", data);
          if (!data.success) {
            _this.$notify({
              title: "提示",
              message: data.message,
              type: "warning"
            });
            return;
          }

          // const postData = {
          //   ...($(this).data("item") || {}),
          //   imgUrl,
          //   itemId,
          //   categoryId,
          //   link: location.href,
          //   data: data.data
          // };
          // // 上传数据到后台
          // console.log("success", data.data);
          // await _this.uploadData(postData);
        } catch (err) {
          _this.$notify({
            title: "提示",
            message: err.message,
            type: "warning"
          });
        } finally {
          loading.close();
        }
      });
    },
    getProductInfo() {
      const scripts = $('script[type="application/ld+json"]').toArray();
      const categoryScript = scripts.find(
        script =>
          $(script)
            .text()
            .indexOf('"@type":"BreadcrumbList"') > -1
      );
      const dataScript = scripts.find(
        script =>
          $(script)
            .text()
            .indexOf("aggregateRating") > -1
      );
      return {
        ...JSON.parse($(dataScript).text()),
        categoryData: JSON.parse($(categoryScript).text())
      };
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
    showSearchMenu() {
      if ($("#shopee-search-by-image").length > 0) {
        return;
      }
      $(".product-briefing >div:nth-child(2) >div >div:first-child").prepend(
        `
            <div id="shopee-search-by-image" class="shopee-search-by-image">
              <button class="el-button el-button--default el-button--mini is-round">
                <i class="el-icon-search"></i>
              </button>
              <ul>
                ${SHOPEE_PLAFORMS.map(item => {
                  return `<li data-item='${JSON.stringify(item)}'>
                      ${item.name}
                    </li>`;
                }).join("")}
              </ul>
            </div>
          `
      );
    },
    getImgUrl(target) {
      let divs = $(target)
        .parent()
        .parent()
        .next()
        .find("div")
        .toArray();

      const imgItem = divs.find(item => {
        return ($(item).css("background-image") || "").includes("url(");
      });

      if (!imgItem) {
        return "";
      }

      const imgUrl = $(imgItem)
        .css("background-image")
        .replace('url("', "")
        .replace('")', "");
      return imgUrl;
    }
  }
};
</script>

<style lang="scss">
.shopee-search-by-image {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  font-weight: 500;
  font-size: 15px;
  order: 3;

  .el-button {
    background-color: rgba(0, 0, 0, 0.9);
    color: rgb(255, 115, 24);
    font-size: 18px;
    border-color: #000;
    padding: 0 !important;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  > span {
    display: inline-block;
    padding: 5px;
  }

  &:hover {
    > ul {
      display: block;
    }
  }

  > ul {
    display: none;
    position: absolute;
    right: -110px;
    top: 0;
    border: 1px solid #ccc;
    padding: 0;
    background-color: #fff;
    color: #000;
    margin: 0;

    > li {
      line-height: 28px;
      list-style: none;
      cursor: pointer;
      padding: 0 10px;

      &:hover {
        background-color: red;
        color: #fff;
      }
    }
  }
}
</style>
