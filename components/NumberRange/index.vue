<template>
  <div class="number-range">
    <!-- <el-popover
      v-model="visible"
      placement="bottom"
      width="200"
      trigger="manual"
      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
    >
      <el-input
        slot="reference"
        v-model="startVal"
        placeholder="开始值"
        type="number"
        @focus="visible = !visible"
        @blur="visible = !visible"
      />
    </el-popover> -->
    <el-dropdown
      v-if="options.ranges"
      trigger="click"
      placement="bottom"
      @command="handleSelect"
    >
      <span style="display: flex">
        <el-input
          v-model="ranges[0]"
          placeholder="开始值"
          type="number"
          :clearable="options.clearable !== false"
          @change="handleChange"
        />
        <span style="padding: 0 10px">-</span>
        <el-input
          v-model="ranges[1]"
          placeholder="结束值"
          type="number"
          :clearable="options.clearable !== false"
          @change="handleChange"
        />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, i) in options.ranges"
          :key="i"
          :command="item.value"
          :class="{ 'is-active': item.value === ranges }"
          style="min-width: 250px"
          >{{ item.label }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <template v-else>
      <el-input
        v-model="ranges[0]"
        placeholder="开始值"
        type="number"
        :clearable="options.clearable !== false"
        @change="handleChange"
      />
      <span style="padding: 0 10px">-</span>
      <el-input
        v-model="ranges[1]"
        placeholder="结束值"
        type="number"
        :clearable="options.clearable !== false"
        @change="handleChange"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: "NumberRange",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: [Array, String, null],
      default: () => []
    },
    options: {
      // vue2-datepicker Props，参考文档https://www.npmjs.com/package/vue2-datepicker
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      ranges: Array.isArray(this.value) ? this.value : [],
      visible: false
    };
  },
  watch: {
    value(newV) {
      this.ranges = Array.isArray(newV) ? this.value : [];
    },
    ranges(newV) {
      this.handleChange();
    }
  },
  methods: {
    handleSelect(item) {
      this.ranges = item;
    },
    handleChange() {
      this.$emit("change", this.ranges);
    }
  }
};
</script>

<style lang="scss">
.number-range {
  display: flex;

  .el-dropdown {
    display: flex;
  }
}
.el-dropdown-menu__item {
  &.is-active {
    color: rgb(16, 106, 223);
    font-weight: 600;
  }
}
</style>
