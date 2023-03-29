<template>
  <div v-if="number" class="serial-number">
    {{ number }}
  </div>
</template>

<script>
/**
 * @description 序号展示 page
 */
export default {
  name: "SerialNumber",
  props: {
    number: {
      type: [String, Number],
      defualt: null
    }
  }
};
</script>

<style lang="scss" scoped>
.serial-number {
  position: absolute;
  right: -18px;
  top: 120px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid red;
  background-color: #fff;
  color: red;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
</style>
