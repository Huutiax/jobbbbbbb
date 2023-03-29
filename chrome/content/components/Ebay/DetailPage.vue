<template>
  <div></div>
</template>

<script>
/**
 * @description Ebay商品详情页插件
 */
import $ from "jquery";

export default {
  name: "DetailPage",
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 找出分类id
      const items = $(".breadcrumbs ul li:last-child").toArray();
      const itemId = location.pathname.split("/").reverse()[0];
      // 可能有多个分类
      items.forEach(item => {
        const cid = $(item)
          .children("a")
          .attr("href")
          .split("/")
          .reverse()[1];
        // 显示
        $(item).append(
          `<span>
            <span style="color: #dd1e31; font-size: 14px; text-decoration: underline; cursor: pointer" class="custom-open-link" data-cid="${cid}" data-item="${itemId}">(${cid})</span>
            <a style="margin-left: 5px; color: #ff5600; font-size: 14px;" href="https://erp.bz-bss.com/pivot/view?id=304&match[LEAF_CATEG_ID]=${cid}&match[ITEM_ID]=${itemId}" target="_blank">304报表</a>
          </span>`
        );
      });

      // erp跳转链接
      $(".custom-open-link").click(function() {
        const cid = $(this).data("cid");
        window.open(
          `https://erp.bz-bss.com/ebay/develop-product-spu/index?DevelopProductSpuSearch%5Bcategory_first%5D=${cid}`
        );
        window.open(
          `https://erp.bz-bss.com/ebay/develop-product-spu/index?DevelopProductSpuSearch%5Bitem_id%5D=${itemId}`
        );

        window.open(
          `https://erp.bz-bss.com/pivot/view?id=304&match[LEAF_CATEG_ID]=${cid} `
        );

        // 2021-11-29 09:39新增（jack）
        window.open(
          `https://erp.bz-bss.com/ebay/product-bind-user/index?ProductBindUserSearch%5Bprimary_category%5D=${cid}`
        );
      });

      // ebay 购买历史页已经改版，插件无法使用
      // 简单解决，详情页增加旧链接跳转，旧页面还能使用
      // const link = $(".vi-txt-underline").attr("href");
      // const arr = link.split("?");
      // arr[0] = "https://offer.ebay.com.au/ws/eBayISAPI.dll?ViewBidsLogin&";
      // $(".vi-txt-underline").attr("href", arr.join(""));
      // $(".vi-txt-underline").attr("target", "_blank");
    }
  }
};
</script>

<style lang="scss" scoped></style>
