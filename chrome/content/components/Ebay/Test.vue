<template>
  <div>
    <el-table :data="list">
      <el-table-column label="SKU" prop="skuNumber"></el-table-column>
      <el-table-column label="121-150天库值/数量">
        <span slot-scope="{ row }"
          >{{ row.stockAgeTotal121to150AgeCost }} /
          {{ row.stockAgeTotal121to150AgeQuantity }}</span
        >
      </el-table-column>
      <el-table-column label="151-180天库值/数量">
        <span slot-scope="{ row }"
          >{{ row.stockAgeTotal151to180AgeCost }} /
          {{ row.stockAgeTotal151to180AgeQuantity }}</span
        >
      </el-table-column>
      <el-table-column label="181-360天库值/数量">
        <span slot-scope="{ row }"
          >{{ row.stockAgeTotal181to360AgeCost }} /
          {{ row.stockAgeTotal181to360AgeQuantity }}</span
        >
      </el-table-column>
      <el-table-column label="360+天库值/数量">
        <span slot-scope="{ row }"
          >{{ row.stockAgeTotal361AgeCost }} /
          {{ row.stockAgeTotal361AgeQuantity }}</span
        >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Test",
  data() {
    return {
      list: this.$root.data
    };
  }
};
</script>

<style scoped></style>
