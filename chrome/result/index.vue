<template>
  <div v-if="!error" style="padding: 15px;">
    <ItemInfo :data-source="queryParams" />

    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="13">
        <ShopeeSearchResultTable
          :params="queryParams"
          @row-change="changeCurrentRow"
        />
      </el-col>
      <!-- :data-source="data.list1688" -->
      <el-col :xs="24" :sm="12" :md="11">
        <SearchResult1688 :data-item="currentDataItem" :params="queryParams" />
      </el-col>
    </el-row>
  </div>
  <div v-else>
    图片url不能为空！操作非法！
  </div>
</template>

<script>
import ItemInfo from "./components/ItemInfo.vue";
import ShopeeSearchResultTable from "./components/ShopeeSearchResultTable.vue";
import SearchResult1688 from "./components/SearchResult1688.vue";
// import testData from "./test-data";
const getQueryObj = () => {
  const queryArr = location.search.substring(1).split("&");
  const queryObj = {};
  queryArr.forEach(query => {
    const [queryKey, value] = query.split("=");
    queryObj[queryKey] = decodeURIComponent(value);
  });
  return queryObj;
};
const getQueryItem = key => {
  const queryArr = location.search.substring(1).split("&");
  const queryObj = {};
  queryArr.forEach(query => {
    const [queryKey, value] = query.split("=");
    queryObj[queryKey] = decodeURIComponent(value);
  });
  return queryObj[key];
};

export default {
  components: {
    ItemInfo,
    ShopeeSearchResultTable,
    SearchResult1688
  },
  data() {
    return {
      // loading: true,
      error: !getQueryItem("imgUrl"),
      // guid: getQueryItem("guid"),
      data: {},
      queryParams: getQueryObj(),
      currentDataItem: {}
    };
  },
  // mounted() {
  //   this.fetchData();
  // },
  methods: {
    changeCurrentRow(row) {
      this.currentDataItem = row;
    },
    async fetchData() {
      // this.loading = true;
      // // const storageData = testData;
      // let storageData = await new Promise(resolve => {
      //   chrome.runtime.sendMessage(
      //     {
      //       action: "getStorage",
      //       name: this.guid
      //     },
      //     value => resolve(value)
      //   );
      // });
      // if (!storageData) {
      //   this.error = false;
      //   return;
      // }
      // storageData = JSON.parse(storageData);
      // console.log("storageData", storageData);
      // const {
      //   itemId,
      //   imgUrl,
      //   categoryId,
      //   list,
      //   title,
      //   platform,
      //   plaformCategory,
      //   link,
      //   code,
      //   host,
      //   categoryName
      // } = storageData;

      // if (!itemId || !imgUrl) {
      //   this.loading = false;
      //   this.error = true;
      //   return;
      // }

      // this.shopeeSearchResultTableParams = {
      //   imgUrl,
      //   code,
      //   host
      // };
      // this.data = {
      //   imgUrl,
      //   // host: this.$route.query.host,
      //   originalIfo: {
      //     code,
      //     categoryName,
      //     host,
      //     title,
      //     platform,
      //     plaformCategory,
      //     itemId: itemId,
      //     categoryId: categoryId,
      //     link
      //   },
      //   list1688: list
      // };
      // this.loading = false;

      this.loading = true;
      this.queryParams = getQueryObj();
    }
  }
};
</script>

<style scoped></style>
