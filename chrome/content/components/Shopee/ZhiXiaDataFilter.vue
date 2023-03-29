<template>
  <RightPanel v-if="visible" width="500px" height="450px">
    <el-form
      ref="form"
      :model="form"
      label-width="140px"
      style="padding: 10px;"
    >
      <el-form-item prop="sales30Day" label="近30天销量">
        <NumberRange v-model="form.sales30Day" />
      </el-form-item>
      <el-form-item prop="sales30Rate" label="近30天销量增长率">
        <NumberRange v-model="form.sales30Rate" />
      </el-form-item>
      <el-form-item prop="gmv30Day" label="近30天销售额">
        <NumberRange v-model="form.gmv30Day" />
      </el-form-item>
      <el-form-item prop="salesTotal" label="总销量">
        <NumberRange v-model="form.salesTotal" />
      </el-form-item>
      <el-form-item prop="gmvTotal" label="总销售额">
        <NumberRange v-model="form.gmvTotal" />
      </el-form-item>
      <el-form-item prop="avgTransformRate" label="商品平均转化率">
        <NumberRange v-model="form.avgTransformRate" />
      </el-form-item>
      <el-form-item prop="onShelfTime" label="上架时间">
        <el-date-picker
          v-model="form.onShelfTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          popper-class="shopee-sort-select"
          value-format="timestamp"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-select
          v-model="form.sort"
          popper-class="shopee-sort-select"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in sortList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </el-form-item>
    </el-form>
  </RightPanel>
</template>

<script>
/**
 * @description 根据知虾插件的数据做数据过滤、排序
 * ① 筛选到的数据显示，没筛选到的隐藏 利用display: none
 * ② 在元素上显示排序的序号，利用flex的order特性排序
 */

/**
 * @description 格式化search result list数据
 * @param {Array} itemList
 * @return {Array} [{itemDom: x, sales30Day: x, gmv30Day: x, sales30Rate: x, salesTotal, gmvTotal: x, avgTransformRate }]
 */
function formatData(itemList) {
  const arr = [];
  itemList.forEach((item, index) => {
    arr.push({
      dom: item,
      zhixiaDom: $(item).find(".el-card.is-always-shadow .el-card__body"),
      index, // 原始位置
      // 这里有坑，不能用下标形式，位置有些变化，但是#gmv30DayClick以下固定顺序
      sales30Day: parseFloat(
        $(item)
          .find("span:contains('30天销量：')")
          .next()
          .text()
      ),
      gmv30Day: parseFloat(
        $(item)
          .find("span:contains('30天销售额：')")
          .next()
          .text()
      ),
      sales30Rate: parseFloat(
        $(item)
          .find("span:contains('30天销量增长率：')")
          .next()
          .text()
      ),
      salesTotal: parseFloat(
        $(item)
          .find("span:contains('总销量：')")
          .next()
          .text()
      ),
      gmvTotal: parseFloat(
        $(item)
          .find("span:contains('总销售额：')")
          .next()
          .text()
      ),
      avgTransformRate: parseFloat(
        $(item)
          .find("span:contains('商品平均转化率：')")
          .next()
          .text()
      ),
      onShelfTime: new Date(
        $(item)
          .find("span:contains('上架时间：')")
          .next()
          .text()
      ).getTime()
    });
  });
  return arr;
}

const getDateQuickItem = days => {
  return {
    text: `近${days}天`,
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
      picker.$emit("pick", [start, end]);
    }
  };
};

import RightPanel from "@/components/RightPanel";
import NumberRange from "@/components/NumberRange";
import $ from "jquery";
import { sleep } from "@/utils";
import { LOGIN_COOKIE_DOMAIN } from "@/constants/token-key";

const CACHE_KEY = "shopeeFilterForm";

export default {
  name: "ZhiXiaDataFilter",
  components: {
    RightPanel,
    NumberRange
  },
  data() {
    return {
      visible: false,
      timer: null,
      form: {},
      sortList: [
        { value: "sales30Day", label: "近30天销量从高到低" },
        // { value: "-sales30Day", label: "近30天销量从低到高" },
        { value: "gmv30Day", label: "近30天销售额从高到低" },
        // { value: "-gmv30Day", label: "近30天销售额从低到高" },
        { value: "sales30Rate", label: "近30天销量增长率从高到低" },
        // { value: "-sales30Rate", label: "近30天销量增长率从低到高" },
        { value: "salesTotal", label: "总销量从高到低" },
        // { value: "-salesTotal", label: "总销量从低到高" },
        { value: "gmvTotal", label: "总销售额从高到低" },
        // { value: "-gmvTotal", label: "总销售额从低到高" },
        { value: "avgTransformRate", label: "商品平均转化率从高到低" }
        // { value: "-avgTransformRate", label: "商品平均转化率从低到高" }
      ],
      itemList: [],
      pickerOptions: {
        shortcuts: [
          getDateQuickItem(3),
          getDateQuickItem(7),
          getDateQuickItem(14),
          getDateQuickItem(30),
          getDateQuickItem(60),
          getDateQuickItem(90)
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      chrome.extension.onRequest.addListener(async request => {
        console.log(request.apiStatus);
        if (request.apiStatus === "completed") {
          await sleep(1500);
          // 缓存itemList，还原用
          const itemList = $(
            ".shopee-search-item-result__items .shopee-search-item-result__item"
          ).toArray();
          if (itemList.length === 0) {
            this.visible = false;
            return;
          }
          this.visible = true;
          this.itemList = itemList;
          const cacheForm = await new Promise(resolve => {
            chrome.runtime.sendMessage(
              {
                action: "getCookie",
                domain: LOGIN_COOKIE_DOMAIN,
                name: CACHE_KEY
              },
              cookie => {
                resolve(cookie.value);
              }
            );
          });
          if (cacheForm && typeof cacheForm === "string") {
            this.form = JSON.parse(cacheForm);
            this.handleFilterAndSort(this.form);
          }
          console.log("[cacheForm]: ", cacheForm, this.form);
        }
      });
    },
    /** @description 点击表单确定 */
    submitForm() {
      const form = {};
      Object.keys(this.form).forEach(key => {
        if (
          !this.form[key] ||
          (Array.isArray(this.form[key]) && this.form[key].every(v => !v))
        ) {
          return;
        }
        form[key] = this.form[key];
      });
      localStorage.shopeeFilterForm = JSON.stringify(form);
      chrome.runtime.sendMessage(
        {
          action: "setCookie",
          domain: LOGIN_COOKIE_DOMAIN,
          cookie: {
            name: CACHE_KEY,
            value: JSON.stringify(form)
          }
        },
        () => {
          console.log("background缓存内容：", form);
        }
      );
      this.handleFilterAndSort(form);
    },
    /** @description 重置表单 */
    resetForm() {
      this.$refs.form.resetFields();
      this.form = {};
    },
    /** @description 处理筛选和排序 */
    async handleFilterAndSort(form) {
      if (typeof form !== "object") {
        return;
      }
      const msgInstance = this.$message({
        duration: 0,
        type: "warning",
        message: "正在进行筛选和排序，请稍等片刻..."
      });

      let time = 0;
      try {
        const zhixiaList = await findZhiXiaContent();
        if (!zhixiaList || zhixiaList.length === 0) {
          throw new Error("找不到知虾插件数据，请确认知虾插件是否开启！");
        }
      } catch (err) {
        console.error(err);
        this.$message.error(err.message);
        msgInstance.close();
        return;
      }

      // 格式化数据
      // [{itemDom: x, sales30Day: x, sales30Rate: x, gmv30Day: x, gmvTotal: x, avgTransformRate }]
      const formatList = formatData(this.itemList);
      const sort = form.sort;
      const filterFormKeys = Object.keys(form).filter(key => key !== "sort");
      const hasFilterForm = filterFormKeys.length > 0;
      let isShow = false;

      console.log("filterFormKeys", filterFormKeys);
      // 筛选
      formatList.forEach(item => {
        isShow = true;
        if (hasFilterForm) {
          // 可以显示的情况为：
          // item项对应key的值必须在form[key]区间内
          isShow = filterFormKeys.every(key => {
            return (
              item[key] >= Number(form[key][0] || -Infinity) &&
              item[key] <= Number(form[key][1] || Infinity)
            );
          });
        }
        item.isShow = isShow;
        $(item.dom).css("display", isShow ? "" : "none");
        $(item.zhixiaDom)
          .parent()
          .find(".shopee-list-sort-index")
          .remove();
      });

      // 排序：显示排序序号
      // css排序
      // 利用flex 的 order排序，越小越靠前
      let sortList = (sortList = formatList.filter(item => item.isShow));
      if (sort) {
        sortList = sortList.sort((a, b) => (b[sort] || 0) - (a[sort] || 0));
      }
      console.log("[sortList]: ", sort, sortList);
      sortList.forEach((item, index) => {
        $(item.zhixiaDom).parent().prepend(`
              <div class="shopee-list-sort-index">${index + 1}</div>
            `);
        $(item.dom).css("order", index + 1);
      });
      msgInstance.close();

      // this.$message.success("操作成功！");
      async function findZhiXiaContent() {
        if (time > 10) {
          return Promise.reject("超过10次未获取到知虾插入的内容，取消任务！");
        }
        time++;
        const zhixiaList = $(
          ".shopee-search-item-result__items .shopee-search-item-result__item > .el-card.is-always-shadow"
        );
        if (!zhixiaList || zhixiaList.length === 0) {
          await sleep(1500);
          return await findZhiXiaContent();
        }
        return zhixiaList;
      }
    }
  }
};
</script>

<style lang="scss">
.shopee-sort-select {
  z-index: 99999999999999 !important;
}
.shopee-search-item-result__items {
  margin-top: 30px !important;
  margin-bottom: 0 !important;

  .shopee-search-item-result__item {
    padding-bottom: 0 !important;
    min-height: 380px;
    height: auto !important;
    margin-top: 0 !important;
    margin-bottom: 10px !important;

    display: flex;
    flex-direction: column;
    > .el-card.is-always-shadow {
      order: 1; // 确保知虾的数据显示最下面（修复知虾插件显示问题）
    }
    > a {
      display: block;
      height: 380px;
    }
    .el-card {
      position: relative;
    }
    .shopee-list-sort-index {
      position: absolute;
      left: 50%;
      top: 5px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      z-index: 10;
      text-align: center;
      margin-left: -15px;
      border-radius: 50%;
      border: 1px solid #409eff;
      font-size: 16px;
      font-weight: 500;
      color: #409eff;
    }
  }
}
</style>
