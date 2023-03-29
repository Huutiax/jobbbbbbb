<template>
  <div>
    <!-- 1688以图搜索产品 -->
    <!-- <ImageSearch1688 /> -->

    <Access :accessible="!!$store.state.userNumber">
      <!-- 根据知虾插件的数据做数据过滤、排序 -->
      <ZhiXiaDataFilter />
      <!-- shopee 详情以图搜图 -->
      <SearchByImage />
    </Access>
  </div>
</template>

<script>
// import ImageSearch1688 from "./ImageSearch1688";
import Access from "../Access";
import ZhiXiaDataFilter from "./ZhiXiaDataFilter.vue";
import SearchByImage from "./SearchByImage.vue";

export default {
  name: "Shopee",
  components: {
    // ImageSearch1688,
    Access,
    ZhiXiaDataFilter,
    SearchByImage
  },
  mounted() {
    console.log("============= Shopee插件 =============");
  }
};
</script>

<style lang="scss">
.shopee-search-item-result__items {
  margin-top: 15px !important;
  margin-bottom: 20 !important;
  padding-bottom: 0 !important;

  .shopee-search-item-result__item {
    min-height: 380px;
    height: auto !important;
    margin-top: 0 !important;
    // > a {
    //   display: block;
    // }
  }
}
</style>
