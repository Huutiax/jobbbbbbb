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
      :highlightCurrentRow="false"
      @sort-change="handleSortChange"
    >
      <!-- :sort-config="{
        remote: true,
        defaultSort: { field: 'created_at', order: 'desc' }
      }"
      @sort-change="handleVxeSort" -->
      <vxe-table-column title="产品图" width="80px" fixed="left">
        <!-- @click="handleShowPicture(row)" -->
        <template slot-scope="{ row }">
          <el-image
            lazy
            class="pointer"
            style="width: 50px; height: 50px;"
            :src="row.imgUrl"
            :preview-src-list="[row.imgUrl]"
          />
        </template>
      </vxe-table-column>
      <vxe-table-column
        title="产品名称"
        field="title"
        align="left"
        width="170px"
      >
        <a
          slot-scope="{ row }"
          class="hover-link"
          :href="row.link"
          target="_blank"
          style="font-size: 12px;"
          >{{ row.title }}</a
        >
      </vxe-table-column>
      <vxe-table-column
        title="30天销量"
        field="quantitySumMonth"
        align="center"
        width="110px"
        sortable
      />
      <vxe-table-column
        title="30天成交额"
        field="gmv30dRt"
        align="center"
        width="110px"
        sortable
      />
      <vxe-table-column
        title="件数/单价/料本率(排序按料本率)"
        field="liaoBenLv"
        align="center"
        min-width="230"
        sortable
        :sort-by="handleLiaoBenLvSort"
      >
        <table slot-scope="{ row }" style="width: 100%" class="column-table">
          <tbody>
            <tr v-for="(item, index) in row.quantityPrices" :key="index">
              <td style="width: 40%; text-align: right;">
                <span>{{ item.quantity }}</span>
              </td>
              <td style="width: 30%">
                <span>¥{{ item.valueString }}</span>
              </td>
              <td
                style="width: 30%"
                :style="{
                  color: item.valueString > dataItem.price ? 'red' : 'green'
                }"
              >
                <span>{{
                  item.valueString | getLiaoBenLv(dataItem.price)
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import AppSearch from "@/components/AppSearch";
import shopeeSearchByImage from "@/chrome/background/shopee-search-by-image.js";
const getTime = date => new Date(date).getTime();

export default {
  filters: {
    getLiaoBenLv(MaterialPrice, salePrice) {
      if (!salePrice) {
        return "-";
      }
      MaterialPrice = parseFloat(MaterialPrice);

      return ((MaterialPrice / salePrice) * 100).toFixed(2) + "%";
    }
  },
  components: {
    AppSearch
  },
  props: {
    /** @description 成本核算sku对象 */
    dataItem: {
      type: Object,
      default: () => ({})
    },
    params: {
      type: Object,
      default: () => ({})
    }
    // dataSource: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data() {
    return {
      dataSource: [],
      data: [],
      loading: false,
      sort: {
        property: "",
        sort: ""
      },
      form: {}
    };
  },
  computed: {
    searchOptions() {
      return [
        {
          key: "priceInfo",
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
          key: "quantitySumMonth",
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
          key: "gmv30dRt",
          label: "30天成交额",
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          component: {
            name: "numberRange"
          }
        },
        {
          key: "liaoBenLv",
          label: "料本年率",
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          component: {
            name: "numberRange"
          }
        }
      ];
    }
  },
  watch: {
    // dataSource(newV) {
    //   this.data = newV.map(item => ({
    //     ...item,
    //     liaoBenLv: (
    //       (this.dataItem.price / item.priceInfo.valueString) *
    //       100
    //     ).toFixed(2)
    //   }));
    // },
    dataItem(newV) {
      this.data = this.data.map(item => ({
        ...item,
        liaoBenLv: ((newV.price / item.priceInfo.valueString) * 100).toFixed(2)
      }));
      // 排序
      this.$refs.tableRef.sort(this.sort.property, this.sort.order);
    }
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    async fetchList() {
      this.loading = true;
      try {
        const data = await shopeeSearchByImage.searchByImg(this.params);
        this.dataSource = [...data];
        this.data = [...data];
        console.log("data", data);
      } catch (err) {
        this.$notify({
          title: "提示",
          message: err,
          type: "warning"
        });
        console.error(err);
      }
      this.loading = false;
    },
    handleSortChange({ column, property, order }) {
      console.log(property, order);
      this.sort.property = property;
      this.sort.order = order;
    },
    /**
     * @description 自定义表格排序
     * @param { Object } item { order, property }
     * asc 升序
     * desc 降序
     * null 空
     */
    handleVxeSort({ order, property }) {
      let prevLiaoBenLv = 0,
        nextLiaoBenLv = 0;
      const data = this.data.sort((prevItem, nextItem) => {
        if (property !== "liaoBenLv") {
          return order === "asc"
            ? prevItem[property] - nextItem[property]
            : nextItem[property] - prevItem[property];
        } else {
          // 料本率需要额外处理
          // 因为价格是个区间
          // 取第一个价格计算的料本率进行排序
          prevLiaoBenLv = this.dataItem.price / prevItem.priceInfo.price;
          nextLiaoBenLv = this.dataItem.price / nextItem.priceInfo.price;

          return order === "asc"
            ? nextLiaoBenLv - prevLiaoBenLv
            : prevLiaoBenLv - nextLiaoBenLv;
        }
      });
      this.data = data;
    },
    handleLiaoBenLvSort({ row, sort }) {
      if (!this.dataItem.price) {
        return true;
      }
      const liaoBenLv = Number(
        ((this.dataItem.price / row.priceInfo.price) * 100).toFixed(2)
      );
      // console.log("liaoBenLv", row, this.dataItem, liaoBenLv);
      return -liaoBenLv;
    },
    /**
     * @description 表格数据筛选
     */
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
      const materialPrice = this.dataItem.price;
      this.data = this.dataSource.filter(item => {
        return keys.every(key => {
          if (key === "priceInfo") {
            return (
              item[key]["price"] >= Number(form[key][0] || -Infinity) &&
              item[key]["price"] <= Number(form[key][1] || Infinity)
            );
          } else if (key === "liaoBenLv") {
            const liaoBenLv = !materialPrice
              ? 0
              : (item.priceInfo.price / materialPrice) * 100;
            return (
              liaoBenLv >= Number(form[key][0] || -Infinity) &&
              liaoBenLv <= Number(form[key][1] || Infinity)
            );
          } else {
            return (
              item[key] >= Number(form[key][0] || -Infinity) &&
              item[key] <= Number(form[key][1] || Infinity)
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
/deep/.hover-link {
  &:visited {
    color: #999;
  }
}
.column-table {
  td {
    line-height: 28px;
  }
}
</style>
