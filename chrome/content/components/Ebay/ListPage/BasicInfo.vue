<template>
  <el-card v-if="!!data" shadow="hover" class="table-card basic-info-table">
    <ul class="keyword-list">
      <li>
        <em>Item ID</em>
        <span>
          <a href="javascript:void(null)" @click="handleItemLink">{{ data.itemId }}</a>
          <el-tag type="primary" v-if="data.suggestedRate && data.settingRate"
            >在售</el-tag
          >
        </span>
      </li>
      <li>
        <em>关键词</em>
        <span>
          <span v-if="!data.keyword">-</span>
          <a style="cursor: pointer;" v-else @click.stop="handleKeywordClick">{{
            data.keyword
          }}</a>
        </span>
      </li>
    </ul>

    <ul
      v-if="
        data.suggestedRate ||
          data.settingRate ||
          data.profit ||
          data.totalAmount
      "
      class="other-list"
    >
      <li>
        <em>建议费率</em>
        <span>{{ data.suggestedRate }}</span>
      </li>
      <li>
        <em>设置的费率</em>
        <span>
          <span v-if="!data.settingRateLink">{{ data.settingRate }}</span>
          <a v-else :href="data.settingRateLink" target="_blank">{{
            data.settingRate
          }}</a>
        </span>
      </li>
      <li>
        <em>利润</em>
        <span>
          <el-tag size="mini" :type="data.profit > 0 ? 'success' : 'danger'">
            {{ data.profit }}
          </el-tag>
        </span>
      </li>
      <li>
        <em>销售额</em>
        <span>
          {{ data.totalAmount }}
        </span>
      </li>
    </ul>

    <ul
      v-if="
        (Array.isArray(data.adLog) && data.adLog.length > 0) ||
          data.rankInfo !== '-'
      "
      class="other-list"
    >
      <li>
        <em>广告排名</em>
        <span>{{ data.rankInfo.adRank }}</span>
      </li>
      <li>
        <em>自然排名</em>
        <span>{{ data.rankInfo.normalRank }}</span>
      </li>
      <li
        style="width: 50%"
        v-if="Array.isArray(data.adLog) && data.adLog.length > 0"
      >
        <em>历史费率</em>

        <span>
          <el-popover
            placement="right-end"
            title="历史费率排名"
            trigger="hover"
            width="330"
          >
            <!-- class="custom-sku-checklabel" -->
            <el-button slot="reference" type="text">
              查看历史费率排名
            </el-button>
            <el-table :data="data.adLog" size="mini" max-height="600px">
              <el-table-column
                align="center"
                prop="bid_percentages"
                label="费率"
              />
              <el-table-column
                align="center"
                prop="date"
                label="日期"
                min-width="140px"
              />
              <el-table-column align="center" prop="rank" label="排名" />
            </el-table>
          </el-popover>
        </span>
      </li>
    </ul>
  </el-card>
</template>

<script>
export default {
  name: "BasicInfo",
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    handleKeywordClick() {
      打开购买历史页
      window.open(this.data.link);

      // 打开ebay产品开发页，将keyword参数按空格切割带入标题条件，并设置审批流状态为初审
      const approval = "DevelopProductSpuSearch[approval_flow_status][]=8"; // 审核状态：初审
      const keywords = this.data.keyword.split(" ");
      const conditions = keywords.map((v, i) => {
        return `
                DevelopProductSpuSearch[titleArray][conditionChange][${i}]=like&
                DevelopProductSpuSearch[titleArray][value][${i}]=${v}&
                DevelopProductSpuSearch[titleArray][logicChange][${i}]=and
              `;
      });
      const openLink = `https://erp.bz-bss.com/ebay/develop-product-spu/index?${approval}&${conditions.join(
"&")}`;
      console.log(openLink);
      window.open(openLink);
    },
    handleItemLink(){
      const openLink = 'https://www.ebay.com.au/bin/purchaseHistory?item=' + this.data.itemId;
      window.open(openLink);
    }
  }
};
</script>

<style lang="scss" scoped>
$em-width: 80px;
.basic-info-table {
  width: 100%;
  border-radius: 2px;
  border: 1px solid #f0f0f0;
  overflow: initial !important;
  font-size: 12px;
  line-height: 20px;

  ul {
    display: flex;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      width: 25%;
      > em {
        width: $em-width;
        text-align: right;
      }
      > span {
        flex: 1;
      }
    }

    &.keyword-list {
      > li {
        width: 50%;
        padding: 0 !important;
      }
    }

    &.other-list {
      > li {
        padding: 0 !important;
      }
    }
  }

  ul:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }

  li > em {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 400;
    text-align: start;
    padding: 4px 8px;
    border-right: 1px solid #f0f0f0;
    background-color: #fafafa;
    text-align: right;
    font-style: normal;
    font-weight: 500;
  }
  li > span {
    display: table-cell;
    flex: 1 1;
    color: rgba(0, 0, 0, 0.85);
    word-break: break-word;
    overflow-wrap: break-word;
    padding: 4px 6px;
    border-right: 1px solid #f0f0f0;
    text-align: center;
  }

  // .custom-sku-checklabel {
  //   color: #eeae62;
  //   &:hover {
  //     & + .custom-sku-table {
  //       display: block;
  //     }
  //   }
  // }
  // .custom-sku-table {
  //   display: none;
  // }
}
</style>
