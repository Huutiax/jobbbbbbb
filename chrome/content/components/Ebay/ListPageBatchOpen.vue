<template>
  <div v-if="list.length > 0">
    <RightPanel width="450px" height="580px">
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
              label="已打开数量"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="remainNumber"
              label="剩余数量"
              align="center"
            ></el-table-column>
          </el-table>
          <!-- item id 容器 -->
          <div style="padding: 0 10px 10px;">
            <div
              class="items-wrapper"
              :style="{ height: height.wrapper1 }"
              v-loading="loading"
            >
              <el-tag
                v-for="item in items"
                :key="item"
                @click="copyItem(item, $event)"
                style="cursor: pointer;"
                >{{ item }}</el-tag
              >
            </div>
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
                      <el-input
                        type="number"
                        v-model="form.interval"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div>
                  <el-button type="primary" size="mini" @click="batchOpen"
                    >批量打开Sold页面</el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    @click="copyItems($event)"
                    >复制所有Item</el-button
                  >
                </div>
              </el-form>
            </div>
          </div>

          <div style="border-bottom: 1px solid #ccc; margin: 5px 10px"></div>

          <!-- 关键字容器 -->
          <div style="padding: 0 10px 10px;">
            <el-table :data="keywordsData" size="mini">
              <el-table-column
                prop="total"
                label="关键字总数(已去重)"
                align="center"
                width="140px"
              ></el-table-column>
              <el-table-column
                prop="openNumber"
                label="已打开数量"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="remainNumber"
                label="剩余数量"
                align="center"
              ></el-table-column>
            </el-table>
            <div
              :style="{ height: height.wrapper1, overflowY: 'auto' }"
              v-loading="loading"
            >
              <el-tag
                v-for="item in keywords"
                type="danger"
                :key="item.id"
                style="margin-right: 5px; margin-bottom: 5px; cursor: pointer;"
                @click="copyItem(item.keyword, $event)"
                >{{ item.keyword }}</el-tag
              >
            </div>
            <div style="margin-top: 10px;">
              <el-form :model="form2" label-width="70px">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="每批数量" style="margin-bottom: 10px">
                      <el-input
                        type="number"
                        v-model="form2.eachNum"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="间隔(ms)" style="margin-bottom: 10px">
                      <el-input
                        type="number"
                        v-model="form2.interval"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div>
                  <el-button type="primary" size="mini" @click="batchOpenTp30"
                    >批量打开关键字30天TP销量页面</el-button
                  >
                </div>
              </el-form>
            </div>
            <div
              style="padding: 5px 0;font-size: 10px; color: #777;line-height: 1"
            >
              <span style="color: red">注：</span
              >以上'itemId'和'关键词'均按<el-tag type="primary"
                >近30天销售额</el-tag
              >降序排序显示。接口返回较慢，需要等待较长时间。
            </div>
          </div>
        </el-col>
      </el-row>
    </RightPanel>

    <!-- 固定到左侧的系统在售item快速锚点 -->
    <LeftPanel height="auto">
      <!-- class="left-anchor"  -->
      <el-table
        v-loading="loading"
        :data="inSalesList"
        size="mini"
        empty-text="无系统在售Item"
        :max-height="450"
      >
        <el-table-column prop="id" label="在售Item" align="center" width="110">
          <a slot-scope="{ row }" :href="row.href" class="anchor-item">{{
            row.itemId
          }}</a>
        </el-table-column>
        <el-table-column prop="skuList" label="SKU" align="center">
          <div slot-scope="{ row }">
            <div v-for="(item, index) in row.skuList" :key="index">
              {{ item.sku }}
            </div>
          </div>
        </el-table-column>
        <el-table-column prop="rank" label="排名" align="center" width="50px">
          <span slot-scope="{ row }" style="color: red">{{ row.rank }}</span>
        </el-table-column>
      </el-table>
    </LeftPanel>
  </div>
</template>

<script>
/**
 * @description Ebay 列表页批量打开item id的购买历史记录页
 * 1. item id 先通过接口按照近30天销售额排序
 * 2. 然后再显示在表格中
 */
import RightPanel from "@/components/RightPanel";
import LeftPanel from "@/components/LeftPanel";
import clip from "@/utils/clipboard";
import $ from "jquery";
import utils from "./utils";

export default {
  name: "ListPageBatchOpen",
  components: {
    LeftPanel,
    RightPanel
  },
  data() {
    return {
      list: [],
      items: [],
      loading: true,
      totalKeywordNumber: 0,
      form: {
        eachNum: 10,
        interval: 200
      },
      form2: {
        eachNum: 10,
        interval: 200
      },
      keywords: [],
      height: {
        wrapper1: "100px",
        wrapper2: "100px",
        wrapper3: "60px"
      },
      inSalesList: [] // 系统在售列表
    };
  },
  computed: {
    totalNumber() {
      return this.list.length;
    },
    remainNumber() {
      return this.items.length;
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
    },
    remainKeywordNumber() {
      return this.keywords.length;
    },
    openedKeywordNumber() {
      return this.totalKeywordNumber - this.remainKeywordNumber;
    },
    keywordsData() {
      return [
        {
          total: this.totalKeywordNumber,
          openNumber: this.openedKeywordNumber,
          remainNumber: this.remainKeywordNumber
        }
      ];
    }
  },
  mounted() {
    let itemIds = [];
    const list = $(".srp-list > .s-item");
    if (list.length > 0) {
      // 搜索列表页
      this.list = $(list).toArray();
      itemIds = this.list.map(item => {
        return $(item)
          .find(".s-item__link")
          .attr("href")
          .split("?")[0]
          .split("/")
          .reverse()[0];
      });
    } else if ($("#ListViewInner > .sresult").length > 0) {
      // 商品详情点击See more items链接时显示的商品列表
      this.list = $("#ListViewInner > .sresult").toArray();
      itemIds = this.list.map(item => {
        return $(item)
          .find(".lvpic.img")
          .attr("iid");
      });
    }
    if (this.list.length === 0) {
      return;
    } else {
      // 给item加上id属性，值为custom-itemId，锚点用
      this.makeId(itemIds);
    }
    // 获取接口数据，根据近30天销售额排序
    const len = itemIds.length / 5;
    Promise.all([
      utils.post("/Ebay/ItemSalesData", JSON.stringify({ data: itemIds })),
      utils.fetchList(itemIds),
      utils.fetchSkuBindUsers(itemIds)
      // 由于获取关键词列表接口返回较慢，所以切个5个itemId数组
      // utils.fetchList(itemIds.slice(0, len)),
      // utils.fetchList(itemIds.slice(len, len * 2)),
      // utils.fetchList(itemIds.slice(len * 2, len * 3)),
      // utils.fetchList(itemIds.slice(len * 3, len * 4)),
      // utils.fetchList(itemIds.slice(len * 4))
    ])
      .then(datas => {
        const [
          salesData,
          // keywordsData1,
          // keywordsData2,
          // keywordsData3,
          // keywordsData4,
          // keywordsData5
          keywordsData,
          skuBindUsers
        ] = datas;
        this.showItemIds(salesData.data);
        this.showKeywords(keywordsData);
        this.showAnchors(skuBindUsers);

        // this.showKeywords([
        //   ...keywordsData1,
        //   ...keywordsData2,
        //   ...keywordsData3,
        //   ...keywordsData4,
        //   ...keywordsData5
        // ]);
        // this.showAnchors([
        //   ...keywordsData1,
        //   ...keywordsData2,
        //   ...keywordsData3,
        //   ...keywordsData4,
        //   ...keywordsData5
        // ]);
      })
      .catch(err => {
        console.error(err);
        this.$message({
          type: "error",
          message: "接口获取失败，请尝试刷新页面！"
        });
        this.loading = false;
      });
  },
  methods: {
    /**
     * @description 显示所有itemId，根据近30天销售额进行排序
     */
    showItemIds(data) {
      let list = Object.keys(data).map(key => {
        return {
          key,
          value: Number(data[key].filter(v => v.label === "近30天")[0].sales)
        };
      });
      // 排序
      this.items = list.sort((a, b) => b.value - a.value).map(v => v.key);
      // console.log(list.sort((a, b) => b.value - a.value));
      // console.log(list.sort((a, b) => b.value - a.value));
      this.loading = false;
    },
    /**
     * @description 获取所有item的关键字，按近30天销售金额来排
     * 由于关键字和销售金额来源于不同接口
     * 需要通过itemId来关联排序
     */
    showKeywords(data) {
      const res = data
        .filter(v => !!v.keyword)
        .map(v => ({ id: v.itemId, keyword: v.keyword, link: v.link }));
      const keywords = [];
      // 按照排序后的itemId去排序关键字
      this.items.forEach(itemId => {
        keywords.push(...res.filter(v => v.id === itemId));
      });
      // 去重
      const keywordsObj = {};
      keywords.forEach(item => {
        if (!keywordsObj[item.keyword]) {
          keywordsObj[item.keyword] = item;
        }
      });
      this.keywords = Object.values(keywordsObj);
      this.totalKeywordNumber = this.keywords.length;
    },
    /**
     * @description 批量打开
     */
    batchOpen() {
      const interval = this.form.interval || 200;
      const openNum = this.form.eachNum || 10;
      const items = this.items.splice(0, openNum);

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
            `https://www.ebay.com.au/bin/purchaseHistory?item=${item}`
          );
        }
      }, interval);
    },
    /**
     * @description 批量打开关键字30天tp销量页面
     */
    batchOpenTp30() {
      const interval = this.form2.interval || 200;
      const openNum = this.form2.eachNum || 10;
      const keywords = this.keywords.splice(0, openNum);

      let count = 0;
      const len = keywords.length;
      let timer = setInterval(() => {
        if (count >= len) {
          clearTimeout(timer);
          timer = null;
        } else {
          const item = keywords[count++];
          // 链接形式如下
          window.open(item.link);
        }
      }, interval);
    },
    copyItem(item, e) {
      clip(item, e);
    },
    /**
     * @description 复制未打开的items
     */
    copyItems(e) {
      const text = this.items.join(",");
      if (text.trim().length === 0) {
        return;
      }
      clip(text, e);
    },
    /**
     * @description 给item加上id属性
     */
    makeId(itemIds) {
      this.list.forEach((item, index) => {
        $(item).prepend(
          `<div style="width: 0;height: 0;" id="custom-${itemIds[index]}"></div>`
        );
      });
    },
    /**
     * @description 显示系统在售item id和页面排名位置，点击锚点定位到该item
     */
    showAnchors(list) {
      // 给列表项加上id，值为custom-itemId
      // this.list.forEach(item => {

      // })
      // 筛选出系统在售的item
      const inSalesList = list.filter(
        item => item.skuList && item.skuList.length > 0
      );
      // 构造锚点
      // let html = ''
      // inSalesList.forEach(item => {
      //   html += `
      //     <a href="#custom-${item.itemId}" class="anchor-item">
      //       <span>${item.itemId}</span>
      //       <span>${$(`#custom-${item.itemId}`).parent().find('.s-item__num').text()}</span>
      //     </a>
      //   `
      // })
      this.inSalesList = inSalesList.map(item => ({
        itemId: item.itemId,
        skuList: item.skuList,
        href: `#custom-${item.itemId}`,
        rank: $(`#custom-${item.itemId}`)
          .parent()
          .find(".s-item__num")
          .text() // 当前页排名
      }));
    }
  }
};
</script>

<style lang="scss" scoped>
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

.left-anchor {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 200px;
  background-color: #fff;
  max-height: 500px;
  z-index: 10;

  /deep/ .el-card__header {
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  /deep/.el-card__body {
    padding: 10px;
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;

    .anchor-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      cursor: pointer;

      & + .anchor-item {
        margin-top: 10px;
      }
      &:hover {
        text-decoration: underline;
        color: blue;
      }
      > span {
        &:last-child {
          color: red;
        }
      }
    }
  }
}
</style>
