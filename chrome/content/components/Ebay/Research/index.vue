<template>
  <RightPanel width="450px" height="500px">
    <div class="research-wrapper">
      <div class="sort-wrapper">
        <div class="sort-title">排序</div>
        <el-radio-group v-model="sort" @change="changeSort">
          <ul class="sort-list">
            <li class="sort-item" v-for="item in sortList" :key="item.name">
              <span class="sort-item__label">{{ item.name }}：</span>
              <el-radio
                v-for="radio in item.list"
                :key="radio.value"
                :label="radio.value"
                >{{ radio.label }}</el-radio
              >
            </li>
          </ul>
        </el-radio-group>
      </div>

      <el-table :data="salesData" size="mini">
        <el-table-column
          prop="salesAmount"
          label="总销售额"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="salesNumber"
          label="总销售数量"
          align="center"
        ></el-table-column>
      </el-table>

      <div>
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
        <div class="items-wrapper">
          <el-tag
            v-for="item in items"
            :key="item"
            @click="copyItem(item, $event)"
            style="cursor: pointer;"
            >{{ item }}</el-tag
          >
        </div>

        <div>
          <el-form :model="form" label-width="70px">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="每批数量" style="margin-bottom: 10px">
                  <el-input
                    readonly
                    type="number"
                    v-model="form.eachNum"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="间隔(ms)" style="margin-bottom: 10px">
                  <el-input type="number" v-model="form.interval"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div>
              <el-button type="primary" @click="batchOpen">批量打开</el-button>
              <el-button type="primary" @click="copyItems($event)"
                >复制所有Item</el-button
              >
              <el-button type="primary" @click="openProductDevelop(false)"
                >产品开发(初审)</el-button
              >
              <el-button type="primary" @click="openProductDevelop(true)"
                >产品开发</el-button
              >
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <div
      v-if="false"
      class="custom-popup-3 ${slideStatus === '0' ? 'popup-hide' : ''}"
    >
      <div class="custom-popup-3-total-info">
        <div>
          总销售额
          <p id="custom-popup-total-price">0</p>
        </div>
        <div>
          总销售数
          <p id="custom-popup-total-num">0</p>
        </div>
      </div>
    </div>

    <!-- <div style="text-align: center; margin-bottom: 10px;">
      <el-button type="danger" :loading="refreshing" @click="refresh">
        重新获取
      </el-button>
    </div> -->
  </RightPanel>
</template>

<script>
import RightPanel from "@/components/RightPanel";
// import ajaxListener from "@/utils/ajax-listener";
import $ from "jquery";
import moment from "moment";
import clip from "@/utils/clipboard";
import { getUrlParam, formatDate } from "./utils";
import { money, toThousandFilter } from "@/filters";
import {
  queryIfItemsInEbayProductDevelope,
  saveDateRange,
  fetchRankItemData2
} from "@/api/ebay";

// ajaxListener();
// 排序名称对应需要点击的元素
const sortElementObj = {
  avgsalesprice: ".research-table-header__avg-sold-price",
  "-avgsalesprice": ".research-table-header__avg-sold-price",
  itemssold: ".research-table-header__total-sold-count",
  "-itemssold": ".research-table-header__total-sold-count",
  totalsales: ".research-table-header__total-sales-value",
  "-totalsales": ".research-table-header__total-sales-value"
};

export default {
  components: {
    RightPanel
  },
  data() {
    return {
      salesData: [{ salesAmount: 0, salesNumber: 0 }],
      totalNumber: 0,
      sortList: [
        {
          name: "平均售价",
          list: [
            { value: "-avgsalesprice", label: "高到低" },
            { value: "avgsalesprice", label: "低到高" }
          ]
        },
        {
          name: "销售数量",
          list: [
            { value: "-itemssold", label: "高到低" },
            { value: "itemssold", label: "低到高" }
          ]
        },
        {
          name: "总销售额",
          list: [
            { value: "-totalsales", label: "高到低" },
            { value: "totalsales", label: "低到高" }
          ]
        }
      ],
      sort: "",
      form: {
        eachNum: 6,
        interval: 200
      },
      items: [],
      count: 12,
      refreshing: false,
      timer: null,
      pollCount: 0
    };
  },
  computed: {
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
    }
  },
  mounted() {
    console.log("======= Ebay Research页插件初始化 =======");
    this.init();
  },
  methods: {
    init() {
      // 初始值
      // if (localStorage.batchOpenForm) {
      //   this.form = JSON.parse(localStorage.batchOpenForm);
      // }
      // 购买搜索时间快捷按键
      this.makeLeftRightArrow();
      // setTimeout(() => {
      //   this.queryItemIdsAndMakeLink();
      //   this.statisticsSalesAmountAndNumber();
      // }, 500);

      // background 拦截请求，响应完成再更新
      this.poll();
      chrome.extension.onRequest.addListener(
        (request, sender, sendResponse) => {
          console.log("status", request.apiStatus);
          if (request.apiStatus === "completed") {
            setTimeout(() => {
              this.queryItemIdsAndMakeLink();
              this.statisticsSalesAmountAndNumber();
            }, 1000);
          }
        }
      );
    },
    /**
     * 初始时轮询获取列表，避免onRequest监听不到的问题
     */
    poll() {
      if (this.pollCount > 20) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.pollCount++;
      this.timer = setTimeout(() => {
        console.log(`执行次数：${this.pollCount}`);
        if (
          !$(".static-table__table-content .research-table-row") ||
          $(".static-table__table-content .research-table-row").length === 0
        ) {
          this.poll();
        } else {
          // 初始默认排序
          if (localStorage.researchSorting) {
            this.sort = localStorage.researchSorting;
            this.changeSort();
          } else {
            this.sort = (getUrlParam() || {}).sorting;
            console.log("sorting", this.sort);
          }
          this.queryItemIdsAndMakeLink();
          this.statisticsSalesAmountAndNumber();
          clearTimeout(this.timer);
          this.timer = null;
        }
      }, 500);
    },
    refresh() {
      this.refreshing = true;

      this.queryItemIdsAndMakeLink();
      this.statisticsSalesAmountAndNumber();

      setTimeout(() => {
        this.refreshing = false;
      }, 500);
    },
    /**
     * 新排序方法
     * 1. 排序时先调用ebay的搜索接口（这是因为ebay在后台记录了搜索历史，直接构造url跳转无法获取预期结果）
     * 2. 调用完成后，构造url，然后跳转url
     */
    async changeSort() {
      localStorage.researchSorting = this.sort;
      const urlQueryObj = getUrlParam();
      if (urlQueryObj.sorting == this.sort) {
        return;
      }
      urlQueryObj.sorting = this.sort;
      try {
        await $.ajax({
          method: "GET",
          url: "https://www.ebay.com.au/sh/research/api/search",
          data: { ...urlQueryObj, modules: "searchResults" }
        });
      } catch (err) {
        console.error(err);
      } finally {
        const url = `https://www.ebay.com.au/sh/research?${Object.keys(
          urlQueryObj
        )
          .map(key => `${key}=${urlQueryObj[key]}`)
          .join("&")}`;
        console.log("searchUrl: ", url);
        location.href = url;
      }
    },
    /**
     * @description 切换排序
     * 1. 判断当前排序和所选排序是否一致
     * - 如果一致则不操作
     * - 否则触发排序按钮点击事件
     * 2. 如果触发后的排序还是不一致，重复步骤1，最多重复10次，超过10次就还原
     */
    // async changeSort() {
    //   localStorage.researchSorting = this.sort;
    //   const sort = getUrlParam().sorting;

    //   if (sort == this.sort) {
    //     return;
    //   }
    //   // this.$message.warning("切换排序中，请勿操作！");

    //   const params = getUrlParam();
    //   params.sorting = this.sort;

    //   const triggerEl = $(sortElementObj[this.sort]);
    //   if (triggerEl.length === 0) {
    //     return;
    //   }

    //   $(triggerEl).trigger("click");
    //   this.count--;
    //   if (this.count <= 0) {
    //     this.count = 10;
    //     return;
    //   }
    //   return await new Promise(resolve => {
    //     setTimeout(async () => {
    //       resolve();
    //       await this.changeSort();
    //     }, 350);
    //   });
    //   // this.changeSort(); // 一直到sorting为选中的为止
    //   // 重载页面 -- 垃圾ebay，url sorting参数无效
    //   // const queryArr = [];
    //   // for (let key in queryObj) {
    //   //   queryArr.push(`${key}=${queryObj[key]}`);
    //   // }
    //   // location.href = `https://www.ebay.com.au/sh/research?${queryArr.join(
    //   //   "&"
    //   // )}`;
    // },
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
     * @create 2021/02/23 15:10
     * @desc 自定义时间左右加箭头，点击设置时间段删/增一个月
     */
    makeLeftRightArrow() {
      // 显示条件
      // 1. 当页面是dayRange=CUSTOM时，显示自定义操作
      // 2. 当切换页面的时间段选择切为自定义时显示
      // let defaultShow = location.search.includes("dayRange=CUSTOM"); // 有时候页面dayRange是30却显示CUSTOM
      // defaultShow = $(".date-range__textbox-row").length > 0 || defaultShow;
      // value="${(getUrlParam() || {}).categoryId}"
      const html = `
        <div class="arrow-container">
          <span id="leftArrow" class="custom-arrow"><</span>
          <div style="display: flex">
            <span id="rightArrow" class="custom-arrow">></span>

            <span class="custom-input">
              分类：<input value="0" id="custom-category" type="text" placeholder="请输入分类ID" />
            </span>
            <span class="custom-input">
              国家：
              <select id="custom-country" style="height: 40px; padding: 0 5px;border-color: #ccc;">
                <option value="">请选择国家</option>
                <option value="SellerLocation:::CN">中国</option>
                <option value="SellerLocation:::AU">澳大利亚</option>
              </select>
            </span>
            <span id="customSearch" class="custom-arrow" style="width: auto; padding: 0 10px; margin-left: 20px;">搜索</span>
            <span id="historyTrend" class="custom-arrow" style="width: auto; padding: 0 10px; margin-left: 20px;">历史趋势</span>
          </div>
        </div>
      `;
      // 新版已经无法在此插入，点击搜索栏附近，在panel内的东西都会被删除
      // $('.search-panel').after(`<div class="search-panel__row">${html}</div>`)
      // console.log($('.search-panel .search-panel__row'))

      // 放到外层容器

      $("#mainContent >section .research-container").before(html);

      $("#leftArrow").click(changeDate("subtract"));
      $("#rightArrow").click(changeDate("add"));

      // $().change(val => console.log(val))
      $(".listbox-button__listbox .listbox__option").on("click", function() {
        // $('.listbox-button__control').attr('value') == 'Custom'
        if ($(this).attr("data-makeup-index") == 4) {
          $(".arrow-container").removeClass("is-hidden");
        } else {
          $(".arrow-container").addClass("is-hidden");
        }
      });

      function changeDate(type = "subtract") {
        return function() {
          // 格式为dd/mm/yyyy形式，moment会将dd识别为月
          // 故需要格式化一下
          let startDate = formatDate(
            $(".date-range__textbox-start input").val()
          ); // params.startDate
          let endDate = formatDate($(".date-range__textbox-end input").val()); // params.endDate

          startDate = moment(startDate)
            [type](1, "months")
            .format("DD/MM/YYYY");
          endDate = moment(endDate)
            [type](1, "months")
            .format("DD/MM/YYYY");
          // start = moment(startDate)
          //   [type](1, "months")
          //   .valueOf();
          // end = moment(endDate)
          //   [type](1, "months")
          //   .valueOf();

          $(".date-range__textbox-start input").val(startDate);
          $(".date-range__textbox-start input").attr("value", startDate);
          $(".date-range__textbox-end input").val(endDate);
          $(".date-range__textbox-end input").attr("value", endDate);
        };
      }

      $("#customSearch").click(async () => {
        const params = getUrlParam();
        let startDate, endDate;
        try {
          // 修改时间
          startDate =
            formatDate($(".date-range__textbox-start input").val()) ||
            params.startDate; // params.startDate
          endDate =
            formatDate($(".date-range__textbox-end input").val()) ||
            params.endDate; // params.endDate

          startDate = moment(startDate).valueOf();
          endDate = moment(endDate).valueOf();

          params.startDate = startDate;
          params.endDate = endDate;
        } catch (err) {
          console.error(err);
        }

        const categoryId = $("#custom-category").val();
        if (categoryId) {
          params.categoryId = categoryId;
        }

        const country = $("#custom-country").val();
        if (country) {
          params.sellerCountry = country;
        }

        // 使用输入的关键词
        const keywords = $(".textbox.search-input-panel__inputBox input").val();
        if (keywords) {
          params.keywords = keywords;
        }

        const query = Object.keys(params).map(key => `${key}=${params[key]}`);

        this.$message.warning("加载中...，请勿再操作！");
        // 调用ebay自身保存最后一次查询时间段
        await saveDateRange(`${startDate}, ${endDate}`);
        // 再刷新页面

        location.replace(
          `${location.origin}${location.pathname}?${query.join("&")}`
        );
        // console.log(`?${query.join("&")}`)
        // history.replaceState(null, null, `?${query.join("&")}`)
        // console.log(`?${query.join("&")}`)
        // location.reload()
      });

      /**
       * 2022/11/11 11:22
       * 历史趋势
       * 跳转到当前搜索条件下、1、2、3月份的页面
       */
      $("#historyTrend").click(() => {
        const queryObj = getUrlParam();
        queryObj.dayRange = "CUSTOM";
        let href = location.href;
        // 1月
        const params1 = {
          ...queryObj,
          startDate: 1640966400000,
          endDate: 1643558400000
        };
        window.open(
          `${location.origin}${location.pathname}?${Object.keys(params1)
            .map(key => `${key}=${params1[key]}`)
            .join("&")}`
        );
        // 2月
        const params2 = {
          ...queryObj,
          startDate: 1643644800000,
          endDate: 1645977600000
        };
        window.open(
          `${location.origin}${location.pathname}?${Object.keys(params2)
            .map(key => `${key}=${params2[key]}`)
            .join("&")}`
        );
        // 3月
        const params3 = {
          ...queryObj,
          startDate: 1646064000000,
          endDate: 1648656000000
        };
        window.open(
          `${location.origin}${location.pathname}?${Object.keys(params3)
            .map(key => `${key}=${params3[key]}`)
            .join("&")}`
        );
      });
    },
    /**
     * @description 统计销售额、销量
     */
    statisticsSalesAmountAndNumber() {
      const soldsList = $("td.research-table-row__totalSoldCount").toArray(); // 销量列表
      const salesList = $("td.research-table-row__totalSalesValue").toArray(); // 销售额列表

      const solds = soldsList
        .map(item =>
          Number(
            $(item)
              .text()
              .replace(",", "")
          )
        )
        .reduce((a, b) => a + b);
      const sales = salesList
        .map(item => {
          let num = $(item)
            .text()
            .substr(4);
          num = Number(num.replace(",", ""));
          return isNaN(num) ? 0 : num; // 防止NaN
        })
        .reduce((a, b) => a + b);

      this.salesData = [
        {
          salesAmount: toThousandFilter(money(sales)),
          salesNumber: toThousandFilter(solds)
        }
      ];
    },
    /**
     * @description 批量打开item id
     */
    /**
     * @date 2020/07/16 09:32
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
          // https://www.ebay.com.au/itm/233662029450?_trkparms=itm%3A233662029450
          // window.open(
          //   `https://www.ebay.com.au/itm/${item}?_trkparms=itm%3A${item}`
          // );

          // 禅道4327 http://zentao.bz-bss.com/index.php?m=task&f=view&taskID=4327
          window.open(
            `https://www.ebay.com.au/bin/purchaseHistory?item=${item}`
          );
        }
      }, interval);
    },
    /**
     * @create 2021/03/03 16:37
     * @desc 默认显示每一行的itemId
     * itemId查ebay产品开发是否存在该itemId，有则显示链接跳转到产品开发页，itemId为参数
     * 注意：不能直接从a标签里取item，有些item没有链接的
     * hack方法，取到data-item-id 的div的上一个兄弟元素，再通过兄弟元素取出data-item-id的div
     */
    async queryItemIdsAndMakeLink() {
      // const itemIds = $(".listing-container .listing-text .gh-ar-hdn")
      //   .next()
      //   .toArray();
      const _this = this;
      const ids = $(
        "td .research-table-row__product-info-name .research-table-row__link-row-anchor span"
      )
        .toArray()
        .map(item => $(item).attr("data-item-id"));
      const parents = $(
        ".sold-result-table .research-table-row__product-info-name"
      ).toArray(); // [];

      // 统计item id
      this.items = ids;
      this.totalNumber = ids.length;
      const itemsObj = {};
      ids.forEach(id => (itemsObj[id] = false));
      try {
        const formData = new FormData();
        formData.append("data", JSON.stringify(ids));
        const data = await queryIfItemsInEbayProductDevelope(formData);
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(item => {
            if (item.bool === false) {
              return;
            }

            itemsObj[item.item_id] = true;
          });
        }

        Object.keys(itemsObj).forEach((itemId, i) => {
          // 父元素为class="listing-tex"的元素
          const isLink = itemsObj[itemId];
          const href = isLink
            ? `https://erp.bz-bss.com/ebay/develop-product-spu/index?DevelopProductSpuSearch[item_id]=${itemId}`
            : "javascript:void(0)";
          const className = isLink
            ? "append-item-id is-link"
            : "append-item-id";
          // 如果已经存在，则先移除
          if ($(`div[data-custom-id=${itemId}]`).length > 0) {
            $(parents[i])
              .find(".append-item-id")
              .remove();
          }
          $(parents[i]).append(`
            <div data-custom-id="${itemId}" class="${className}">
              <span>
                <${
                  isLink ? "a" : "span"
                } href="${href}" target="_blank">${itemId}</${
            isLink ? "a" : "span"
          }>
                <button class="el-button el-button--text copy-button" data-item="${itemId}">复制</button>
              </span>
            </div>
          `);
        });
        // 添加复制功能
        $(".copy-button").on("click", function(e) {
          const itemId = $(this).data("item");
          clip(itemId + "", e);
        });
      } catch (err) {
        console.error(err);
      }

      // 添加广告排名和自然排名
      this.addRankInfo(ids, parents);
    },
    async addRankInfo(itemIds, parents) {
      try {
        const formData = new FormData();
        formData.append("data", JSON.stringify(itemIds));
        formData.append(
          "key_words",
          $(".onboarding-tourtip__inner .textbox__control")
            .val()
            .trim()
        );
        const data = await fetchRankItemData2(formData);
        let itemId;
        data.forEach((item, index) => {
          itemId = itemIds[index];
          // 如果已经存在，则先移除
          if ($(`span[data-custom-rank-id=${itemId}]`).length > 0) {
            $(parents[index])
              .find(".append-rank-info")
              .remove();
          }
          $(parents[index]).find(".append-item-id").append(`
            <span data-custom-rank-id="${itemId}" class='append-rank-info' style="font-size: 13px;color: blue; display: flex;">
              <span>广告排名: ${item.rankInfo.adRank || "-"}</span>
              <span style="margin-left: 15px">自然排名: ${item.rankInfo
                .normalRank || "-"}</span>
            </span>
          `);
        });
        console.log("addRankInfo", data);
      } catch (err) {
        console.error(err);
      }
    },
    /**
     * @description 打开ebay产品开发列表页
     * 筛选条件：item id，审核状态为初审
     */
    openProductDevelop(withoutStatus = false) {
      window.open(
        `https://erp.bz-bss.com/ebay/develop-product-spu/index?DevelopProductSpuSearch[item_id]=${this.items.join(
          ","
        )}${!withoutStatus ? "&DevelopProductSpuSearch[map_status][]=7" : ""}`,
        "_blank",
        { self: false }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.research-wrapper {
  padding: 15px;
}
.sort-wrapper {
  margin-bottom: 5px;
}
.sort-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.sort-title {
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: bold;
}
.sort-item {
  display: flex;

  &__label {
    width: 70px;
    text-align: right;
    font-size: 13px;
  }
}
/deep/.el-form-item {
  margin-bottom: 5px;
}
.items-wrapper {
  height: 150px;
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

<style lang="scss">
.rs-date-picker {
  margin-left: 50px;
}

.arrow-container {
  display: flex;
  /* width: 550px; */
  /* width: 621px; */
  width: 990px; // 680px;
  justify-content: space-between;
  /* position: relative;
  top: 40px;
  margin-top: -40px;
  margin-bottom: 0; */
  position: absolute;
  // top: 151px;
  // left: 34px;
  top: 77px;
  left: 18px;

  &.is-hidden {
    // display: none;
    visibility: hidden;
    opacity: 0;
  }
}
.custom-arrow {
  position: relative;
  z-index: 10;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  background-color: #0654ba;
  border-radius: 3px;
  color: #fff;
  user-select: none;
}

.custom-arrow:hover {
  opacity: 0.8;
}

.custom-arrow:active {
  background-color: #00489f;
}

#mainContent > section {
  position: relative;
}
.search-panel .search-panel__row:nth-child(2) {
  padding-left: 57px;
}
.custom-input {
  display: flex;
  align-items: center;
  padding-left: 10px;
  z-index: 1;
}
.custom-input input {
  padding: 0 10px;
  width: 140px;
  background-color: #fff;
  background-color: var(--textbox-background-color, #fff);
  border-color: #ccc;
  border-color: var(--textbox-border-color, #ccc);
  color: #555;
  color: var(--textbox-foreground-color, #555);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;
  font-family: "Helvetica Neue", Helvetica, Arial, Roboto, sans-serif;
  font-size: 12px;
  height: 40px;
  margin: 0;
}
.append-item-id {
  font-size: 13px;
  color: #767676;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;

  &.is-link {
    a {
      // color: purple;
      text-decoration: underline;
    }
  }

  .el-button {
    margin-left: 0;
    font-size: 12px;
    margin-right: 10px;
  }
}
.sold-result-table .research-table-row .research-table-row__product-info-name {
  flex-direction: column;
  align-items: start;
}
</style>
