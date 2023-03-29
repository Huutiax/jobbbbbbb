<template>
  <div>
    <!-- 所有人都能使用的功能 -->
    <Access :accessible="true">
      <!-- 商品详情页插件 -->
      <DetailPage v-if="showDetailPage" />
      <!-- Ebay购买历史页统计插件 -->
      <EbayPurchaseHistory v-if="showEbayPurchaseHistory" />
      <!-- Ebay Research页插件，搜索统计 -->
      <EbayResearch v-if="showEbayResearch" />

      <!-- https://mktg.ebay.com.au/ppl/create页关键词批量打开 -->
      <PplBatchOpen v-if="showPplBatchOpen" />
    </Access>

    <!-- 正式员工才能使用的功能 -->
    <Access :accessible="!isProbationaryStaff">
      <!-- 列表页根据item id近30天销售额排序批量打开购买历史页 -->
      <ListPageBatchOpen />
      <!-- 商品列表页插件 -->
      <ListPage />

      <!-- Ebay后台地址收费规则管理页导入规则插件 -->
      <EbayShopAdminImportExcel v-if="showEbayShopAdminImportExcel" />

      <!-- Feedback列表页插件 -->
      <FeedbackList v-if="showFeedbackListPlugin" />
    </Access>
  </div>
</template>

<script>
/**
 * @description Ebay插件集成
 * ① 列表页显示销量信息、编号，增加跳转到erp产品开发页链接，显示可用库存、备货建议、费率等信息
 * ② 详情页顶部面包屑显示最后一级分类的id，并增加跳转链接
 * ③ ebay购买历史页插件
 * ④ ebay调查页插件
 * ⑤ ebay导入地区规则插件
 */
import Access from "../Access";
import ListPage from "./ListPage/index.vue";
import DetailPage from "./DetailPage";
import EbayPurchaseHistory from "./PurchaseHistory";
import EbayResearch from "./Research";
import EbayShopAdminImportExcel from "./ShopAdminImportExcel";
import ListPageBatchOpen from "./ListPage/ListPageBatchOpen";
import PplBatchOpen from "./PplBatchOpen";
import FeedbackList from "./FeedbackList";

export default {
  components: {
    Access,
    ListPage,
    DetailPage,
    EbayPurchaseHistory,
    EbayResearch,
    EbayShopAdminImportExcel,
    ListPageBatchOpen,
    PplBatchOpen,
    FeedbackList
  },
  data() {
    return {
      href: location.href
    };
  },
  computed: {
    isLimit() {
      return process.env.VUE_APP_LIMIT === "on";
    },
    showListPage() {
      return true;
    },
    showDetailPage() {
      return this.href.indexOf("/itm/") > -1;
    },
    // 试用期员工
    isProbationaryStaff() {
      return this.$store.state.isProbationaryStaff;
    },
    showEbayPurchaseHistory() {
      // return true;
      return location.href.match(/https:\/\/.+\/bin\/purchaseHistory/gi);
      // return (
      //   location.href.indexOf("offer.ebay.com.au/ws/eBayISAPI.dll") > -1 ||
      //   location.href.indexOf("https://www.ebay.com.au/bin/purchaseHistory") >
      //     -1
      // );
      // return location.href.indexOf("offer.ebay.com.au/ws/eBayISAPI.dll") > -1 || location.href.indexOf('https://www.ebay.com.au/bin/purchaseHistory') > -1;
    },
    showEbayResearch() {
      // return href === 'file:///Users/qian/Desktop/work/browser-extension/vue-chrome-extension-master/src/chrome/inject/components/EbayResearch/test.html'
      return (
        location.href.indexOf("ebay.com.au/sh/research") > -1 ||
        location.href ===
          "http://127.0.0.1:5500/src/chrome/content/components/Ebay/Research/test.html"
      );
    },
    showEbayShopAdminImportExcel() {
      return (
        location.href.indexOf("https://www.ebay.com.au/ship/rt") > -1 ||
        location.href.indexOf(
          "http://127.0.0.1:5500/%E6%B5%B7%E6%B1%87%E6%8F%92%E4%BB%B6%E9%9B%86/src/chrome/content/components/EbayShopAdminImportExcel/test.html"
        ) > -1
      );
    },
    showPplBatchOpen() {
      return location.href.indexOf("mktg.ebay.com.au/ppl/create") > -1;
    },
    showFeedbackListPlugin() {
      return location.href.indexOf("fdbk/feedback_profile/") > -1;
    }
  }
};
</script>

<style lang="scss" scoped></style>
