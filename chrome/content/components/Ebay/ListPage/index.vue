<template>
  <div></div>
</template>

<script>
import $ from "jquery";
import utils from "../utils";
import Vue from "vue";
import { getQueryObject } from "@/utils";
import ListPagePluginRender from "./Render";
import {
  fetchRankItemData2,
  fetchSkuBindUsers,
  fetchSkuStockAgeAndQuantity
} from "@/api/ebay";

const queryObj = getQueryObject();

// https://www.ebay.com.au/sch/protec.online/m.html?item=124383096391&amdata=enc%3AAQAGAAAA4MBw8jXf7xlfnL4TZSiZNqJDXZ7pVz7DLgSe3LdDCWDCL706s8eAzXOwDyuOUY1hpQXhRCCTLRkARBvZyYS9MQfEC2RieSJjXO%2FuLLwvkvDIbtAI%2FLykVbp522gVGVzvrB1iFi37%2FI81KDRn%2BhWHUrkbZK%2BBzxeYvDtrz62Ma8aAfzTFiOBvAJOeGkTd82n4vzI2ceIk3f%2FH8YiBk3Qomqg1QW4eO41nqPbxhUE49FW2zxMqIAWAhxDBKi4LedQqv1XtyOZdcHmwt3DZZvCFJKfNTzeLP5MvCh5Jk9QkOSLK%7Ctkp%3ABFBMov_gn_tf&siteoverride=15&hash=item1cf5cf6e47%3Ag%3AGyoAAOSwOF9fj3q7&rt=nc&_trksid=p2047675.l2562

export default {
  name: "ListPage",
  data() {
    return {
      keyword: queryObj._nkw, // 搜索关键词
      href: location.href,
      list: {}, // 搜索商品列表
      list2: [] // 查看更多商品时的列表
    };
  },
  mounted() {
    // this.keyword = $(".gh-tb.ui-autocomplete-input").val();
    // this.init();
    this.init();
  },
  methods: {
    init() {
      // ebay.com.au/sch/i.html 搜索页面
      // 如果是 see other items www.ebay.com.au/sch/protec.online/m.html页面，取后者
      let list = $(
        ".srp-list .s-item .s-item__wrapper .s-item__info"
      ).toArray();

      list = list.length > 0 ? list : $("#ListViewInner > .sresult").toArray();
      if (list.length === 0) {
        return;
      }

      this.list = {};
      // 给列表项添加插件内容容器，提前布局，合理分配
      list.forEach(item => {
        const el = document.createElement("div");

        el.setAttribute("class", "plugin-content-wrapper");
        $(item).append(el);

        const vm = new Vue({
          render: h => h(ListPagePluginRender)
        }).$mount(el);

        const itemId = ($(item).find("a.s-item__link").length > 0
          ? $(item).find("a.s-item__link")
          : $(item).find(".lvtitle a")
        )
          .attr("href")
          .replace(/\?.+/gi, "")
          .split("/")
          .reverse()[0];
        this.list[itemId] = {
          vm,
          domItem: item
        };
      });
      console.log(this.list);

      // 初始化序号展示
      this.initSerialNumber();
      // 初始化基本数据：关键词、利润率等
      this.initBasicInfo();
      // 初始化sku绑定人信息
      this.initSkuBindersInfo();
      // 初始化库龄/数量信息
      this.initStockAgeAndQuantityInfo();
      // 初始化销售数据信息
      this.initSalesInfo();
    },
    /** 初始化序号展示 */
    initSerialNumber() {
      // 页数，默认1
      const page = queryObj._pgn || 1;
      // 每页条数，默认60
      const pageSize = queryObj._ipg || 60;
      Object.keys(this.list).forEach((itemId, index) => {
        this.list[itemId].vm.$children[0].number =
          (page - 1) * pageSize + index + 1;
      });
    },
    /** 初始化基本数据：关键词、利润率等 */
    initBasicInfo() {
      const itemIds = Object.keys(this.list);
      // 分两组查询
      // fixed: length为1的情况，取值为0，itemIds.length - 1 => itemIds.length
      const middleNumber = Math.ceil(itemIds.length / 2);
      const paramsArr = [
        itemIds.slice(0, middleNumber),
        itemIds.slice(middleNumber + 1)
      ];

      paramsArr.forEach(itemIdParams => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(itemIdParams));
        formData.append("key_words", this.keyword);
        fetchRankItemData2(formData).then(data => {
          data.forEach(item => {
            // if (item.itemId === "363556091063") {
            //   console.log(item, this.list[item.itemId].vm.$children[0]);
            // }
            this.list[item.itemId].vm.$children[0].basicInfoData = item;
          });
        });
      });
    },
    /** 初始化sku绑定人信息 */
    initSkuBindersInfo() {
      const formData = new FormData();
      formData.append("data", JSON.stringify(Object.keys(this.list)));
      fetchSkuBindUsers(formData).then(data => {
        // console.log("sku绑定人", data);
        data.forEach(item => {
          this.list[item.itemId].vm.$children[0].skuBindersInfoData =
            item.skuList;
        });
      });
    },
    /** 初始化库龄/数量信息 */
    initStockAgeAndQuantityInfo() {
      const formData = new FormData();
      formData.append("data", JSON.stringify(Object.keys(this.list)));
      fetchSkuStockAgeAndQuantity(formData).then(data => {
        // console.log("库龄、数量", data);
        data.forEach(item => {
          this.list[
            item.itemId
          ].vm.$children[0].skuStockAgeAndQuantityInfoData = item.stockAgeList;
        });
      });
    },
    /** 初始化销售数据信息 */
    initSalesInfo() {
      utils
        .post(
          "/Ebay/ItemSalesData",
          JSON.stringify({ data: Object.keys(this.list) })
        )
        .then(({ data }) => {
          // console.log("item销售数据", data);
          Object.keys(data).forEach(itemId => {
            this.list[itemId].vm.$children[0].itemSalesInfoData = data[itemId];
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
