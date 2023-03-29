<template>
  <el-card
    header="SKU库龄/数量信息"
    v-if="Array.isArray(data) && data.length > 0"
    class="table-card sku-stock-info"
    shadow="hover"
  >
    <el-table size="mini" :data="data">
      <el-table-column label="SKU" prop="skuNumber" align="center" />
      <el-table-column
        label="121-150天库值/数量"
        align="center"
        min-width="140px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.stockAgeTotal121to150AgeCost }}</span>
          /
          <span>{{ row.stockAgeTotal121to150AgeQuantity }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="151-180天库值/数量"
        align="center"
        min-width="140px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.stockAgeTotal151to180AgeCost }}</span>
          /
          <span>{{ row.stockAgeTotal151to180AgeQuantity }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="181-360天库值/数量"
        align="center"
        min-width="140px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.stockAgeTotal181to360AgeCost }}</span>
          /
          <span>{{ row.stockAgeTotal181to360AgeQuantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="360+天库值/数量" align="center" min-width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.stockAgeTotal361AgeCost }}</span>
          /
          <span>{{ row.stockAgeTotal361AgeQuantity }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "SkuStockAgeAndQuantityInfo",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$em-width: 80px;
.sku-stock-info {
  margin: 8px 0;
}
</style>
