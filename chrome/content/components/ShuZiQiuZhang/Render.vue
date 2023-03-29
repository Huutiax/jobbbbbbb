<template>
  <div class="list-page-plugin-render">
    <!-- sku绑定人信息展示 -->
    <SkuBindersInfo :data="$root.data" width="500px" />
  </div>
</template>

<script>
import SkuBindersInfo from "../Ebay/ListPage/SkuBindersInfo.vue";

export default {
  name: "ShuZiQiuZhangPluginRender",
  components: {
    SkuBindersInfo
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
