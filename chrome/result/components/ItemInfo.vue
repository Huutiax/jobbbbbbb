<template>
  <el-card>
    <div class="item-info">
      <div v-if="dataSource.imgUrl" class="item-info__img">
        <el-image
          style="width: 100px; height: 100px"
          :src="dataSource.imgUrl"
          :preview-src-list="[dataSource.imgUrl]"
        />
      </div>
      <el-row class="item-info__wrapper" :gutter="20">
        <el-col :span="24">
          <ul class="info-list">
            <li>
              <span>产品名称：</span>
              <span v-if="dataSource.title">
                <a :href="dataSource.link" target="_blank">{{
                  dataSource.title
                }}</a>
              </span>
              <span v-else>-</span>
            </li>
            <li>
              <span>站点：</span>
              <span>{{ siteName }}</span>
            </li>
            <li>
              <span>平台分类：</span>
              <span>{{ dataSource.categoryName || "-" }}</span>
            </li>
            <!-- <li>
              <span>关键词：</span>
              <span>{{ item.keyword }}</span>
            </li> -->
            <li>
              <span>item：</span>
              <span>{{ dataSource.itemId || "-" }}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { SHOPEE_PLAFORMS } from "@/constants";

export default {
  name: "ItemInfo",
  props: {
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    siteName() {
      return (
        SHOPEE_PLAFORMS.find(item => item.code === this.dataSource.code) || {}
      ).name;
    }
  }
};
</script>

<style lang="scss" scoped>
.item-info {
  display: flex;

  &__img {
    width: 110px;
    height: 110px;

    // img {
    //   width: 110;
    //   height: 100%;
    //   object-fit: contain;
    // }
  }

  &__wrapper {
    flex: 1;
  }

  .info-list {
    font-size: 13px;
    margin: 0;
    padding: 0;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
    // height: 120px;

    > li {
      width: 100%;
      // position: relative;
      // padding-left: 70px;
      line-height: 22px;
      height: 22px;
      list-style: none;
      display: flex;

      > span {
        &:first-child {
          width: 70px;
          // position: absolute;
          // left: 0;
          // top: 0;
          // width: 70px;
          // color: #666;
          text-align: right;
        }
        &:last-child {
          // width: 100%;
          flex: 1;
        }
      }
    }
  }
}
</style>
