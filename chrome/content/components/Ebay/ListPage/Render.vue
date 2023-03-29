<template>
  <div class="list-page-plugin-render">
    <!-- 序号展示 -->
    <SerialNumber :number="number" />
    <!-- 关键词、费率、广告排名等内容显示 -->
    <BasicInfo :data="basicInfoData" />
    <!-- sku绑定人信息展示 -->
    <SkuBindersInfo :data="skuBindersInfoData" />
    <!-- 库龄、数量信息展示 -->
    <SkuStockAgeAndQuantityInfo :data="skuStockAgeAndQuantityInfoData" />
    <!-- item销售数据信息展示 -->
    <ItemSalesInfo :data="itemSalesInfoData" />
  </div>
</template>

<script>
import BasicInfo from "./BasicInfo";
import SkuBindersInfo from "./SkuBindersInfo";
import SkuStockAgeAndQuantityInfo from "./SkuStockAgeAndQuantityInfo";
import ItemSalesInfo from "./ItemSalesInfo";
import SerialNumber from "./SerialNumber";
export default {
  name: "ListPagePluginRender",
  components: {
    BasicInfo,
    SkuBindersInfo,
    SkuStockAgeAndQuantityInfo,
    ItemSalesInfo,
    SerialNumber
  },
  data() {
    return {
      basicInfoData: null,
      skuBindersInfoData: [],
      skuStockAgeAndQuantityInfoData: [],
      itemSalesInfoData: [],
      number: null
    };
  }
};
</script>

<style lang="scss">
.list-page-plugin-render {
  margin-bottom: 20px;
}

.lvresult .list-page-plugin-render {
  float: right;
  width: 74%;

  .serial-number {
    right: -40px;
  }
}
</style>
