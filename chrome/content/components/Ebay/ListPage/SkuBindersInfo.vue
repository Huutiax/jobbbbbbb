<template>
  <el-card
    header="SKU绑定人信息"
    v-if="Array.isArray(data) && data.length > 0"
    class="table-card sku-binders-info"
    size="mini"
    shadow="hover"
  >
    <el-table size="mini" :data="data">
      <el-table-column label="SKU" prop="sku" align="center" width="55px" />
      <el-table-column
        label="绑定人"
        prop="bindingPerson"
        align="center"
        width="55px"
      >
        <el-tag slot-scope="{ row }" type="primary">{{
          row.bindingPerson
        }}</el-tag>
      </el-table-column>
      <el-table-column
        label="可用库存"
        prop="availableStock"
        align="center"
        width="55px"
      />
      <el-table-column
        label="可用天数"
        prop="available_day"
        align="center"
        width="55px"
      />
      <el-table-column
        label="日均/7天日均(销单数)"
        min-width="90px"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.avg_day_sale_quantity | toFixed(3) }}
          /
          {{ row.avg_7days_sale_quantity | toFixed(2) }}
          <el-tag
            v-if="getDaysAverageCompareRes(row) !== 0"
            :type="getDaysAverageCompareRes(row) > 0 ? 'success' : 'danger'"
          >
            {{ getDaysAverageCompareRes(row) ? "↑" : "↓" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="到达时间/数量" width="100px" align="center">
        <template slot-scope="{ row }">
          {{ row.arrival_time || "-" }}
          /
          {{ row.arrival_number | toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column
        label="适用保本价/适用费率/是否RT"
        prop="break_ad_fee_rate6_price_6"
        min-width="170px"
        align="center"
      >
        <div slot-scope="{ row }">
          <el-tag
            style="padding: 0 3px"
            type="success"
            effect="plain"
            size="mini"
            >{{ row.suitable_break_even_price || "-" }}</el-tag
          >
          /
          <el-tag
            style="padding: 0 3px"
            type="primary"
            effect="plain"
            size="mini"
            >{{ row.suitable_fee_rate || "-" }}</el-tag
          >
          /
          <el-tag
            style="padding: 0 3px"
            type="warning"
            effect="plain"
            size="mini"
            >{{ row.is_rt || "-" }}</el-tag
          >
        </div>
      </el-table-column>
      <!-- <el-table-column
        label="广告费率6% / 8% / 11%"
        prop="break_ad_fee_rate6_price_6"
        min-width="150px"
        align="center"
      >
        <div slot-scope="{ row }">
          <el-tag type="info" effect="plain" size="mini">{{
            row.break_ad_fee_rate6_price_6 || "-"
          }}</el-tag>
          /
          <el-tag type="success" effect="plain" size="mini">{{
            row.break_check_price_8 || "-"
          }}</el-tag>
          /
          <el-tag type="primary" effect="plain" size="mini">{{
            row.break_price_11 || "-"
          }}</el-tag>
        </div>
      </el-table-column> -->
      <!-- <el-table-column
        label="广告费率6%"
        prop="break_ad_fee_rate6_price_6"
        width="75px"
        align="center"
      />
      <el-table-column
        label="广告费率8%"
        prop="break_check_price_8"
        width="75px"
        align="center"
      />
      <el-table-column
        label="广告费率11%"
        prop="break_price_11"
        width="75px"
        align="center"
      /> -->
    </el-table>
  </el-card>
</template>

<script>
import { toFixed } from "@/utils";

export default {
  name: "SkuBindersInfo",
  props: {
    width: String,
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  filters: {
    toFixed
  },
  methods: {
    getDaysAverageCompareRes(row) {
      return (
        Number(row.avg_day_sale_quantity || 0) -
        Number(row.avg_7days_sale_quantity || 0)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
$em-width: 80px;
.sku-binders-info {
  margin: 10px 0;

  /deep/div.cell {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  /deep/th div.cell {
    line-height: 14px;
  }
}
</style>
