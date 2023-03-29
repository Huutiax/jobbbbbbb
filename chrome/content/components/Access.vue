<template>
  <div v-if="accessible">
    <slot></slot>
  </div>
</template>

<script>
// 权限组件
export default {
  name: "Access",
  props: {
    accessible: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped></style>
