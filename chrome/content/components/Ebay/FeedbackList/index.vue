<template>
  <RightPanel width="450px" height="550px">
    <el-row :gutter="15">
      <el-col :span="24">
        <el-table :data="itemsData" size="mini">
          <el-table-column
            prop="total"
            label="Item总数"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="openNumber"
            label="已打开数量123"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="remainNumber"
            label="剩余数量45"
            align="center"
          ></el-table-column>
        </el-table>
        <!-- item id 容器 -->
        <div style="padding: 0 10px 10px;">
          <el-row
            :gutter="8"
            style="height: 350px; padding-top: 10px; overflow-y: auto;"
            v-loading="loading"
          >
            <el-col
              v-for="item in data"
              :key="item.label"
              :span="8"
              style="margin-bottom: 8px"
            >
              <el-tag
                @click="copyItem(item.label, $event)"
                style="cursor: pointer; width: 100%;"
                >{{ item.label }} - {{ item.value }}次</el-tag
              >
            </el-col>
          </el-row>
          <div style="margin-top: 10px;">
            <el-form :model="form" size="mini" label-width="70px">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item
                    size="mini"
                    label="每批数量"
                    style="margin-bottom: 10px"
                  >
                    <el-input type="number" v-model="form.eachNum"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    size="mini"
                    label="间隔(ms)"
                    style="margin-bottom: 10px"
                  >
                    <el-input type="number" v-model="form.interval"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div>
                <el-button type="primary" size="mini" @click="batchOpen"
                  >批量打开Sold页面</el-button
                >
                <el-button type="primary" size="mini" @click="copyItems($event)"
                  >复制所有Item</el-button
                >
              </div>
            </el-form>
          </div>

          <div
            style="padding: 5px 0;font-size: 10px; color: #777;line-height: 1"
          >
            <span style="color: red">注：</span>以上'itemId'按<el-tag
              type="primary"
              >当前页出现次数</el-tag
            >降序排序显示。
          </div>
        </div>
      </el-col>
    </el-row>
  </RightPanel>
</template>

<script>
/**
 * @description ebay feedback页面插件
 * 1. 统计itemId出现次数
 * 2. 按次数降序排序itemId
 * 3. 批量复制itemId
 * 4. 批量打开sold记录页
 */
import RightPanel from "@/components/RightPanel";
import $ from "jquery";
import utils from "../utils";
import clip from "@/utils/clipboard";

export default {
  name: "FeedbackList",
  components: {
    RightPanel
  },
  data() {
    return {
      data: [],
      form: {
        eachNum: 10,
        interval: 200
      },
      loading: true,
      totalNumber: 0
    };
  },
  computed: {
    remainNumber() {
      return this.data.length;
    },
    openedNumber() {
      return this.totalNumber - this.remainNumber;
    },
    itemsData() {
      return [
        {
          total: this.totalNumber,
          openNumber: this.openedNumber,
          remainNumber: this.remainNumber
        }
      ];
    }
  },
  beforeMount() {
    chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
      console.log("status", request.apiStatus);
      this.loading = true;
      if (request.apiStatus === "completed") {
        setTimeout(() => {
          this.init();
        }, 1500);
      }
    });

    /**
     * 进入页面时，大概率不会触发 onRequest 事件，导致无法初始数据，
     * 所以，这里通过定时器来触发一次
     */
    let timer = null;
    timer = setInterval(() => {
      try {
        // 如果已经选择了 每页200条，停止操作
        if (
          document
            .querySelector(
              '.itemsPerPage .item[data-test-id="pagination-item-page-4"]'
            )
            .getAttribute("selected") === "true"
        ) {
          clearInterval(timer);
          timer = null;
          return;
        }
        // 页面自动切换到 每页200条 的模式
        $(".itemsPerPage .item:last-child").trigger("click");
      } catch (err) {
        console.error(err);
      }
    }, 1000);
  },
  methods: {
    init() {
      this.loading = true;
      const itemIdCountMap = {};
      const list = $("#feedback-cards tbody tr td:first-child").toArray();
      let itemId, temp;
      list.forEach(item => {
        /**
         * 这里有两种情况：
         * 1. a链接包着itemId
         * 2. 商品标题包着itemId
         */
        if ($(item).find(".card__item a").length > 0) {
          itemId = $(item)
            .find(".card__item a")
            .text();
        } else {
          temp = $(item)
            .find(".card__item")
            .text();
          temp.replace(/(.+\(#)(\d+)(\))/gi, (str, $1, $2, $3) => {
            itemId = $2;
          });
        }
        if (!itemId.trim()) {
          return;
        }
        if (!itemIdCountMap[itemId]) {
          itemIdCountMap;
        }
        itemIdCountMap[itemId] = !itemIdCountMap[itemId]
          ? 1
          : itemIdCountMap[itemId] + 1;
      });

      console.log(itemIdCountMap);
      this.data = Object.keys(itemIdCountMap)
        .map(item => ({
          label: item,
          value: itemIdCountMap[item]
        }))
        .sort((a, b) => b.value - a.value);
      this.totalNumber = this.data.length;
      this.loading = false;
    },
    copyItem(item, e) {
      clip(item, e);
    },
    /**
     * @description 复制未打开的items
     */
    copyItems(e) {
      const text = this.data.map(item => item.label).join(",");
      if (text.trim().length === 0) {
        return;
      }
      clip(text, e);
    },
    /**
     * @description 批量打开
     */
    batchOpen() {
      const interval = this.form.interval || 200;
      const openNum = this.form.eachNum || 10;
      const items = this.data.splice(0, openNum);

      let count = 0;
      const len = items.length;
      let timer = setInterval(() => {
        if (count >= len) {
          clearTimeout(timer);
          timer = null;
        } else {
          const item = items[count++];
          // 链接形式如下
          window.open(
            `https://www.ebay.com.au/bin/purchaseHistory?item=${item.label}`
          );
        }
      }, interval);
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-button--mini,
.el-button--mini.is-round {
  padding: 6px 12px;
}
.items-wrapper {
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  padding: 5px 0;

  span {
    margin: 3px;
    flex: 1;
    max-width: 33.33%;
  }
}
</style>
