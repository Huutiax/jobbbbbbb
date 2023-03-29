<template>
  <el-card
    header="Ebay Item销售信息"
    v-if="Array.isArray(data) && data.length > 0"
    class="table-card sku-stock-info"
    shadow="hover"
  >
    <el-table size="mini" :data="dataSource">
      <el-table-column
        v-for="(columnText, index) in columns"
        :key="index"
        :label="`${columnText}销量`"
        :prop="columnText"
        :min-width="columnText.includes('SI60Days') ? '90px' : ''"
        align="center"
      />
      <el-table-column
        label="近30天销售额"
        prop="近30天销售额"
        align="center"
        min-width="85px"
      />
      <el-table-column label="实时获取" prop="is_new" align="center">
        <el-tag
          slot-scope="{ row }"
          :type="row.is_new ? 'primary' : 'danger'"
          >{{ row.is_new ? "是" : "否" }}</el-tag
        >
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "ItemSalesInfo",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    columns() {
      return this.data.map(item => item.label);
    },
    dataSource() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      const obj = {};
      this.data.forEach(item => {
        obj[item.label] = item.orders;
      });
      obj.is_new = this.data[0].is_new;
      obj["近30天销售额"] = this.data.find(item =>
        item.label.includes("30天")
      ).sales;
      return [obj];
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
