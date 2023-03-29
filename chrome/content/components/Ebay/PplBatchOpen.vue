<template>
  <RightPanel width="200px" height="120px">
    <div>
      <el-button
        type="primary"
        style="margin-top: 40px; margin-left: 15px;"
        @click="handleBatchOpen()"
        >批量打开research页</el-button
      >
    </div>
    <div>
      <el-button
        type="primary"
        style="margin-top: 40px; margin-left: 15px;"
        @click="handleBatchOpen('ebaySearch')"
        >批量ebay搜索页</el-button
      >
    </div>
  </RightPanel>
</template>

<script>
/**
 * @description https://mktg.ebay.com.au/ppl/create 页对suggested keywords关键词批量打开
 */
import RightPanel from "@/components/RightPanel";
import $ from "jquery";
export default {
  name: "PplBatchOpen",
  components: {
    RightPanel
  },
  mounted() {
    console.log("======== PplBatchOpen插件 ========");
  },
  methods: {
    handleBatchOpen(type) {
      const list = $(".suggestedKW.gridFont tbody tr")
        .toArray()
        .slice(0, 6);
      console.log("list", list);
      list.forEach(item => {
        let url = "";
        const keyword = $(item)
          .data("kw")
          .replace(" ", "+");
        if (type === "ebaySearch") {
          url = `https://www.ebay.com.au/sch/i.html?_nkw=${keyword}`;
        } else {
          url = `https://www.ebay.com.au/sh/research?marketplace=EBAY-AU&keywords=${keyword}&dayRange=30&categoryId=0&tabName=SOLD`;
        }
        window.open(url);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .rightPanel {
  min-height: 100px;
}
</style>
