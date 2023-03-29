<template>
  <div style="margin-top: 20px;">
    <AppSearch
      label-width="90px"
      :default-cols-number="4"
      :options="searchOptions"
      :action="filterList"
      block-button
    />

    <vxe-table
      ref="tableRef"
      style="margin-top: 20px;"
      :loading="loading"
      :data="data"
      border="inner"
      size="small"
      align="center"
      height="500px"
      :empty-render="{ name: 'Empty' }"
      :highlightCurrentColumn="false"
      @current-change="changeCurrentRow"
      @sort-change="handleSortChange"
    >
      <!-- <vxe-table-column type="radio" title="选择" width="40" fixed="left">
        <template slot-scope="{ row }"></template>
      </vxe-table-column> -->
      <vxe-table-column title="产品图" width="80px" fixed="left">
        <!-- @click="handleShowPicture(row)" -->
        <template slot-scope="{ row }">
          <el-image
            lazy
            class="pointer"
            style="width: 50px; height: 50px;"
            :src="
              `${params.host.replace('https://', 'https://cf.')}/file/${
                row.image
              }`
            "
            :preview-src-list="[
              `${params.host.replace('https://', 'https://cf.')}/file/${
                row.image
              }`
            ]"
          />
        </template>
      </vxe-table-column>
      <vxe-table-column
        title="产品名称"
        field="name"
        align="left"
        min-width="180px"
      >
        <a
          slot-scope="{ row }"
          :href="`${params.host}/x-i.${row.shopid}.${row.itemid}`"
          target="_blank"
          style="font-size: 12px;"
          class="ellipsis--l3"
          >{{ row.name }}</a
        >
      </vxe-table-column>
      <vxe-table-column
        title="售价"
        field="salesPriceRange"
        align="center"
        min-width="120"
      >
        <table slot-scope="{ row }">
          <tbody>
            <tr>
              <td style="text-align: right">价格</td>
              <td>{{ row.price }}</td>
            </tr>
            <tr>
              <td style="text-align: right">最低价</td>
              <td>{{ row.price_min }}</td>
            </tr>
            <tr>
              <td style="text-align: right">最高价</td>
              <td>{{ row.price_max }}</td>
            </tr>
          </tbody>
        </table>
      </vxe-table-column>
      <!-- <vxe-table-column
        title="折扣率"
        field="raw_discount"
        align="center"
        width="60px"
      /> -->
      <vxe-table-column
        title="30天销量"
        field="sold"
        align="center"
        width="110px"
        sortable
      />
      <vxe-table-column
        title="历史销量"
        field="historical_sold"
        align="center"
        width="110px"
        sortable
      />
      <vxe-table-column
        title="关键词、排名"
        field="keyword"
        align="center"
        min-width="180px"
      >
        <template slot-scope="{ row }">
          <div>
            <div
              v-for="(rank, keyword) in row.rank"
              :key="keyword"
              style="display: flex;"
            >
              <span style="flex: 1; text-align: right;">{{ keyword }} => </span>
              <span style="width: 30px; text-align: left;">{{
                rank || "-"
              }}</span>
            </div>
          </div>
        </template>
      </vxe-table-column>
      <!-- <vxe-table-column
        title="平台分类"
        field="platformCategory"
        align="center"
        min-width="140px"
      /> -->
      <vxe-table-column
        title="上架时间"
        field="ctime"
        align="center"
        width="100px"
        sortable
      />
    </vxe-table>
  </div>
</template>

<script>
import AppSearch from "@/components/AppSearch";
import { getShopeeImgSearchList } from "@/api/shopee";
import { LOGIN_COOKIE_DOMAIN, LOGIN_TOKEN_KEY } from "@/constants/token-key";
const getTime = date => new Date(date).getTime();

export default {
  components: {
    AppSearch
  },
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dataSource: [],
      data: [],
      loading: false,
      sort: {}
    };
  },
  computed: {
    searchOptions() {
      return [
        {
          key: "price",
          label: "价格",
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          component: {
            name: "numberRange"
          }
        },
        {
          key: "sold",
          label: "30天销量",
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          component: {
            name: "numberRange"
          }
        },
        {
          key: "rank",
          label: "排名",
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          component: {
            name: "numberRange"
          }
        },
        {
          key: "ctime",
          label: "上架时间",
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          component: {
            name: "range"
          }
        }
      ];
    }
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    changeCurrentRow({ row }) {
      this.$emit("row-change", row);
    },
    handleSortChange({ column, property, order }) {
      this.sort.property = property;
      this.sort.order = order;
    },
    async fetchList() {
      this.loading = true;
      // const token = await chrome.runtime.sendMessage({
      //   action: "getCookie",
      //   domain: LOGIN_COOKIE_DOMAIN,
      //   name: LOGIN_TOKEN_KEY
      // });
      const token = await new Promise(resolve => {
        chrome.cookies.get(
          { url: LOGIN_COOKIE_DOMAIN, name: LOGIN_TOKEN_KEY },
          val => resolve(val.value)
        );
      });
      try {
        const data = await getShopeeImgSearchList(this.params, token);
        this.dataSource = [...data];
        this.data = [...data];
        console.log("data", data);
      } catch (err) {
        console.error(err);
      }
      this.loading = false;
    },
    filterList(formVal) {
      const form = {};
      Object.keys(formVal)
        .filter(key => {
          return !!formVal[key] && formVal[key].filter(v => !!v).length > 0;
        })
        .forEach(key => {
          form[key] = formVal[key];
        });
      console.log("form", form, formVal);
      const keys = Object.keys(form);
      this.data = this.dataSource.filter(item => {
        return keys.every(key => {
          if (key === "ctime") {
            return (
              getTime(item[key]) >= getTime(form[key][0]) &&
              getTime(item[key]) <= getTime(form[key][1])
            );
          } else if (key === "rank") {
            const ranks = Object.values(item.rank);
            // 取排名最高的
            const maxRank = ranks.length === 0 ? 0 : Math.min(...ranks);
            return (
              maxRank >= (form[key][0] || -Infinity) &&
              maxRank <= (form[key][1] || Infinity)
            );
          } else {
            return (
              item[key] >= (form[key][0] || -Infinity) &&
              item[key] <= (form[key][1] || Infinity)
            );
          }
        });
      });
      this.$refs.tableRef.sort(this.sort.property, this.sort.order);
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.app-datepicker {
  z-index: 1000;
}
</style>
