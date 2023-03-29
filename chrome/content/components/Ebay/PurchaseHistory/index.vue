<template>
  <RightPanel width="460px" height="auto">
    <div class="search-wrapper">
      <el-form :model="form" label-width="60px">
        <el-form-item label="属性匹配" v-if="showVariation">
          <el-select
            v-model="selectVariations"
            multiple
            popper-class="custom-select"
            collapse-tags
            clearable
            size="small"
            ref="select"
          >
            <div style="padding: 8px 20px;">
              <el-checkbox v-model="checkAll" @change="changeCheckAll"
                >全选</el-checkbox
              >
            </div>
            <el-option
              v-for="(item, i) in variationOpts"
              :key="i"
              :value="item.value"
            >
              <div v-html="item.label"></div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间匹配">
          <!-- <el-input
            v-model="form.date"
            @keypress.native.enter="search"
            placeholder="多个条件用两个英文下划线隔开: __"
            type="textarea"
            rows="3"
          ></el-input> -->
          <div>
            <el-row :gutter="5">
              <el-col
                :span="12"
                v-for="(item, i) in dates"
                :key="item.id"
                :style="{
                  marginLeft: i === 0 ? '-5px' : '',
                  marginBottom: '5px'
                }"
              >
                <el-row>
                  <el-col :span="21">
                    <el-input
                      type="text"
                      v-model="item.date"
                      placeholder="输入单个条件"
                      clearable
                    ></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-button
                      type="text"
                      style="width: 100%;"
                      @click="deleteDate(item, i)"
                    >
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <div>
              <el-button type="text" @click="addDate">
                +新增时间匹配条件
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleClear">重置</el-button>
          <el-button type="primary" :loading="loading" @click="search">
            确定
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 搜索结果 -->
      <div class="search-result">
        <el-table :data="data" :loading="loading" :max-height="400">
          <el-table-column
            prop="keyword"
            label="匹配字符"
            align="left"
            min-width="130px"
          >
            <span slot-scope="{ row }" v-html="row.keyword"></span>
          </el-table-column>
          <el-table-column
            prop="type"
            label="匹配类型"
            align="center"
            min-width="74px"
          ></el-table-column>
          <el-table-column
            prop="count"
            label="总数"
            align="center"
            min-width="45px"
          ></el-table-column>
          <el-table-column
            prop="totalPrice"
            label="总价"
            align="center"
            min-width="75px"
          >
            <span slot-scope="{ row }">{{
              row.totalPrice | toThousandFilter
            }}</span>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 时间段匹配，暂时隐藏 -->
    <div style="padding: 0 10px 10px;">
      <p
        style="margin: 0; padding: 10px 0; border-top: 1px solid #ccc; color: #333; font-size: 13px;"
      >
        按时间段匹配(注: 无法高亮时间)
      </p>
      <el-form :model="form2">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item>
              <el-date-picker
                v-model="form2.startDate"
                placeholder="开始时间"
                popper-class="date-picker"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2">至</el-col>
          <el-col :span="11">
            <el-form-item>
              <el-date-picker
                v-model="form2.endDate"
                placeholder="结束时间"
                popper-class="date-picker"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button @click="clearDateRange">重置</el-button>
          <el-button type="primary" @click="dateRangeSearch">确定</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table :data="dateRangeTableData" :loading="loading" :height="60">
          <el-table-column
            prop="range"
            label="时间段"
            align="left"
            min-width="180px"
          >
          </el-table-column>
          <el-table-column
            prop="count"
            label="总数"
            align="center"
            min-width="45px"
          ></el-table-column>
          <el-table-column
            prop="totalPrice"
            label="总价"
            align="center"
            min-width="75px"
          >
            <span slot-scope="{ row }">{{
              row.totalPrice | toThousandFilter
            }}</span>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </RightPanel>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { guid } from "@/utils";
import moment from "moment";
import { toThousandFilter } from "@/filters";

// import clip from "@/utils/clipboard";
let count = 0;
let totalPrice = 0;
const SPLIT_SYMBOL = "__"; // 属性选择多个条件切割符

import $ from "jquery";
window.$ = $;

export default {
  name: "PurchaseHistory",
  components: {
    RightPanel
  },
  data() {
    return {
      loading: false,
      showVariation: false,
      form: {
        variation: "",
        date: ""
      },
      selectVariations: [],
      checkAll: false,
      data: [],
      table: null,
      date: {
        tds: [],
        htmls: []
      },
      variation: {
        tds: [],
        htmls: []
      },
      variationOpts: [],
      priceList: [],
      dates: [
        {
          id: guid(),
          date: ""
        }
      ],
      form2: {
        startDate: "",
        endDate: ""
      },
      dateRangeTableData: []
    };
  },
  filters: {
    toThousandFilter
  },
  watch: {
    selectVariations(newV) {
      this.form.variation = newV.join(SPLIT_SYMBOL);
      this.checkAll = newV.length === this.variationOpts.length;
      console.log(this.form.variation);
    },
    form2: {
      deep: true,
      handler(newV) {
        localStorage.ebayPurchaseHistorySearchDateRange = JSON.stringify(newV);
      }
    }
  },
  mounted() {
    console.log("======= ebay购买历史页插件初始化成功 =======");

    // 在item number旁边加按钮
    this.addButtonsBesideItemId();

    this.table = $(".app-table.fixed-price table");

    let variationIndex, dateIndex, priceIndex;
    let text = "";
    const ths = $(this.table).find("tr th");

    // 因为列的位置不固定，需要通过字符去匹配各列的位置，通过位置去找到对应的内容
    // 为了应对ebay多语言版本，不能再通过header的标题来判断了
    // 现在通过header th个数判断，5个为有属性，4个为没有属性
    if (ths.length >= 5) {
      variationIndex = 2;
      dateIndex = 5;
      priceIndex = 3;
    } else {
      dateIndex = 4;
      priceIndex = 2;
    }
    // $(ths).each((index, th) => {
    //   text = $(th).text();
    //   if (!text) {
    //     return;
    //   }
    //   if (text.match(/variation/gi)) {
    //     variationIndex = index + 1;
    //   } else if (text.match(/date of purchase/gi)) {
    //     dateIndex = index + 1;
    //   } else if (text.match(/price/gi)) {
    //     priceIndex = index + 1;
    //   }
    // });

    // 属性列
    if (variationIndex) {
      this.showVariation = true;
      this.variation.tds = $(this.table)
        .find(`tr td:nth-child(${variationIndex})`)
        .toArray();
      this.variation.tds.forEach(td =>
        $(td).html(
          $(td)
            .html()
            .replace(/<b>|<\/b>/g, "")
        )
      );
      this.variation.htmls = this.variation.tds.map(td => $(td).html());
      this.variation.text = this.variation.tds.map(td => $(td).text());
      let obj = {};
      this.variation.htmls.forEach(v => {
        if (!(v in obj)) {
          obj[v] = {
            label: v,
            value: v.replace(/<br>/gi, "\n")
          };
        }
      });
      this.variationOpts = Object.values(obj);
    }
    // 日期列
    this.date.tds = $(this.table)
      .find(`tr td:nth-child(${dateIndex})`)
      .toArray();
    this.date.htmls = this.date.tds.map(td => $(td).html());

    // 价格列
    /* eslint-disable */
    this.priceList = $(this.table)
      .find(`tr td:nth-child(${priceIndex})`)
      .map((i, td) =>
        Number(
          $(td)
            .html()
            .replace(/[^\d\.]/g, "")
        )
      )
      .toArray();

    // 初始搜索结果
    if (localStorage.ebayPurchaseHistorySearchKeyword) {
      this.form = JSON.parse(localStorage.ebayPurchaseHistorySearchKeyword);
      this.selectVariations = this.form.variation.split(SPLIT_SYMBOL)
      if (!!this.form) {
        this.dates = this.form.date.split(SPLIT_SYMBOL).map(v => {
          return {
            id: guid(),
            date: v
          }
        })
      }
      this.search();
    }

    // 初始时间段结果
    if (localStorage.ebayPurchaseHistorySearchDateRange) {
      this.form2 = JSON.parse(localStorage.ebayPurchaseHistorySearchDateRange)
      this.dateRangeSearch()
    }
  },
  methods: {
    addButtonsBesideItemId () {
      const itemId = location.search.substring(1).split('=')[1]
      $('#mainContent > div.ph-main-container > div.app-item-card.ph > div.app-item-card__data-items > dl > div:nth-child(4) > dd > div > span > span').append(`
      <a style="margin-left: 5px; color: #ff5600; font-size: 14px;" href="https://erp.bz-bss.com/pivot/view?id=304&match[ITEM_ID]=${itemId}" target="_blank">304报表</a>
      `)
    },
    changeCheckAll (val) {
      this.selectVariations = !val ? [] : this.variationOpts.map(v => v.value)
    },
    /**
     * @description 添加日期条件
     */
    addDate () {
      this.dates.push({
        id: guid(),
        date: ''
      })
    },
    /**
     * @description 移除日期条件
     */
    deleteDate (item, index) {
      if (this.dates.length === 1) {
        return this.$message.warning('请至少保持一个日期条件')
      }
      this.dates.splice(index, 1)
    },
    search() {
      this.form.date = this.dates.filter(v => !!v.date.trim()).map(v => v.date).join('__')

      localStorage.ebayPurchaseHistorySearchKeyword = JSON.stringify(this.form);
      // 注意判断条件：由于"".trim()会返回String{""}类型（object），所以不能用!"".trim()判断
      if (!this.form.date && !this.form.variation) {
        // 初始统计
        this.handleClear();
        return;
      }
      // localStorage.ebayTimeSearchKeyword = value
      const { variation, date } = this.form;

      this.data = [
        ...this.formatMoreConditionRes(
          "variation",
          variation,
          this.countAndHighlight(variation, "variation")
        ),
        ...this.formatMoreConditionRes(
          "date",
          date,
          this.countAndHighlight(date, "date")
        )
      ];
      // const res = this.countAndHighlight(value);
      // this.formatMoreConditionRes(value, res);
    },
    /**
     * @description 构造多条件结果显示
     */
    formatMoreConditionRes(type = "date", value) {
      // 按逗号切割的条件分开匹配，有多个条件时才执行
      const queryList = value.split(SPLIT_SYMBOL);

      const { htmls } = this[type];

      const obj = {};
      let reg = "";
      try {
        if (queryList.length === 0) {
          return;
        }
        // 筛选符合条件内容
        queryList.forEach(item => {
          if (!item) {
            return;
          }
          reg = new RegExp(
            type === "date" ? item : item.split("\n").join(".*").replace(/\/|\(|\)/g, $1 => '\\' + $1),
            "ig"
          );
          obj[item] = {
            total: 0,
            count: 0,
            list: []
          }
          htmls.forEach((v, i) => {
            if (!v.match(reg)) { return }
            obj[item].list.push(v)
            obj[item].count += 1;
            obj[item].total += this.priceList[i]
          })
        });
      } catch (err) {
        console.error(err);
      }
      // 构造html
      const data = Object.keys(obj).map(key => {
        return {
          keyword: key.split("\n").join("<br>"),
          totalPrice: Number(obj[key].total.toFixed(2)),
          count: obj[key].count,
          type: type === "date" ? "时间" : "属性"
        };
      });
      return data;
    },
    /**
     * @description 单个字符查找
     */
    countAndHighlight(query, type = "date") {
      if (query === "") {
        return;
      }

      // 多个条件，__隔开
      const symbolReg = new RegExp(SPLIT_SYMBOL, 'gi')
      query = query.replace(symbolReg, "|");

      const { tds, htmls } = this[type];

      count = 0;
      totalPrice = 0;
      let html = "";
      // 属性有多个情况，需要将回车转化为且符号（|）
      const reg = new RegExp(
        type === "date" ? query : query.split("\n").join(".*").replace(/\/|\(|\)/g, $1 => '\\' + $1),
        "gi"
      );

      tds.forEach((td, i) => {
        html = htmls[i];
        if (reg.test(html)) {
          count++;
          $(td).html(
            html.replace(reg, res => {
              // 注意：此处res不能使用query，否则原文本会随着query变化
              return '<div style="background: red; color: #fff; font-size: 12px;">' + res + "</div>";
            })
          );
          totalPrice += this.priceList[i];
        } else {
          $(td).html(htmls[i]);
        }
      });

      return { total: totalPrice, count };
    },
    /**
     * @description 清空按钮事件
     */
    handleClear() {
      this.form.date = "";
      this.form.variation = "";
      this.selectVariations = []
      localStorage.ebayPurchaseHistorySearchKeyword = JSON.stringify(this.form);
      count = 0;
      totalPrice = 0;
      this.data = [];
      this.clear('date')
      this.clear('variation')
      this.dates = [{id: guid(), date: ''}]
    },
    clear (type) {
      const { tds, htmls } = this[type];
      for (let i = 0; i < tds.length; i++) {
        $(tds[i]).html(htmls[i]);
      }
    },
    /**
     * @description 时间段选择搜索
     */
    dateRangeSearch () {
      const message = !this.form2.startDate ? '请选择开始时间' :
        !this.form2.endDate ? '请选择结束时间' : ''
      if (message) {
        this.$message.warning(message)
        return
      }
      
      const startTimestamp = new Date(this.form2.startDate).getTime() 
      const endTimestamp = new Date(this.form2.endDate).getTime() 
      let dateStr = '', currentTimestamp = 0;
      let count = 0, totalPrice = 0;
      this.date.tds.forEach((td, index) => {
        dateStr = $(td).text().split(' at ')[0]
        currentTimestamp = new Date(dateStr).getTime() 
        // 筛选出在起止时间段内的商品
        if (currentTimestamp >= startTimestamp && currentTimestamp <= endTimestamp) {
          count += 1;
          totalPrice += this.priceList[index]
        }
      })

      // 构造表格数据
      this.dateRangeTableData = [
        {
          range: `${moment(this.form2.startDate).format('YYYY-MM-DD')} 至 ${moment(this.form2.endDate).format('YYYY-MM-DD')}`,
          count,
          totalPrice: Number(totalPrice.toFixed(2))
        }
      ]
    },
    /**
     * @description 清空时间段
     */
    clearDateRange () {
      this.form2.startDate = ''
      this.form2.endDate = ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/var.scss";

/deep/ textarea {
  font-family: $font-family;
}
.search-wrapper {
  box-sizing: border-box;
  padding: 15px;
  width: 100%;
}
/deep/.el-form {
  .el-form-item {
    margin-bottom: 10px;

    .el-form-item__label {
      font-size: 12px;
    }
  }
}

/deep/ .el-table {
  width: 100%;
  .cell {
    line-height: 1.2;
  }
}
/deep/ .el-textarea__inner {
  line-height: 1.2;
}

/deep/ .el-select {
  width: 100%;
  .el-input__inner {
    // height: 54px;
    // line-height: 1.3;
    width: 100%;
  }
  .el-select__tags {
    >span {
      display: flex;
      width: 100%;
    }
    .el-tag:first-child {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
/deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100% !important;
}
</style>

<style lang="scss">
.date-picker {
  z-index: 99999999 !important;
}
.variationContentValueFont {
  position: relative;
}
.custom-copy {
  position: absolute;
  right: 0;
  bottom: 5px;
  font-size: 12px;
  padding: 5px;
  cursor: pointer;
}
.custom-select {
  z-index: 40001 !important;

  .el-select-dropdown__item {
    height: auto;
    line-height: 1.3;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .el-select-dropdown__item.selected::after {
    top: 50%;
    margin-top: -6px;
  }

  .el-select-dropdown__item {
    &+.el-select-dropdown__item {
      border-top: 1px solid #f7f7f7;
    }
  }
}
</style>
