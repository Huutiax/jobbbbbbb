<template>
  <!-- <LeftPanel height="140px" width="140px">
    <div class="button-wrapper">
      <el-button :loading="loading" type="primary" @click="getInfo">
        手动获取
      </el-button>
    </div>
  </LeftPanel> -->
  <div></div>
</template>

<script>
// import LeftPanel from "@/components/LeftPanel";
import $ from "jquery";
import { fetchSkuBindUsers } from "@/api/ebay";
import { toFixed } from "@/utils";
import Vue from "vue";
import ShuZiQiuZhangPluginRender from "./Render";

export default {
  data() {
    return {
      COUNT: 17
    };
  },
  mounted() {
    console.log(">>>>>>>>>>>>>>>> 数字酋长插件 >>>>>>>>>>>>>>>>");
    // background 拦截请求，响应完成再更新
    chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
      if (request.apiStatus === "completed") {
        setTimeout(() => {
          this.injectInfo();
        }, 500);
      }
    });
  },
  methods: {
    /**
     * @date 2021/02/23 14:00
     * @author 潜
     * @desc 往表格注入内容
     * @url 需求链接 http://zentao.bz-bss.com/index.php?m=task&f=view&taskID=3506
     */
    injectInfo() {
      const list = $(".linkEbay.gDesc span");
      const domList = list.toArray().map(item => {
        return {
          itemId: $(item)
            .parent()
            .attr("href")
            .split("/")
            .reverse()[0],
          dom: item
        };
      });

      for (let i = 0; i < domList.length; i += this.COUNT) {
        const formData = new FormData();
        formData.append(
          "data",
          JSON.stringify(domList.slice(i, i + this.COUNT).map(v => v.itemId))
        );
        fetchSkuBindUsers(formData).then(data => {
          this.makeTableHtml(domList.slice(i, i + this.COUNT), data);
        });
      }
      // const formData = new FormData();
      // formData.append("data", JSON.stringify(domList.map(v => v.itemId)));
      // fetchSkuBindUsers(formData).then(data => {
      //   this.makeTableHtml(domList, data);
      // });
    },
    /**
     * @date 2021/02/23 16:00
     * @author 潜
     * @desc 构造注入内容
     * @param { Array } domList dom对象数组
     * @param { Array } data 接口返回内容
     */
    makeTableHtml(domList, data) {
      if (domList.length === 0 || !Array.isArray(data) || data.length === 0) {
        return;
      }

      let domItem = null;
      data.forEach(item => {
        domItem = domList.filter(v => v.itemId === item.itemId)[0];
        if (!domItem) {
          return;
        }
        const parent = $(domItem.dom)
          .parent()
          .parent()
          .parent();

        const el = document.createElement("div");
        el.setAttribute("class", "plugin-content-wrapper");
        $(parent).append(el);
        new Vue({
          data() {
            return {
              data: item.skuList
            };
          },
          render: h => h(ShuZiQiuZhangPluginRender)
        }).$mount(el);
      });
      return;
      // let domItem = null;
      // data.forEach(item => {
      //   domItem = domList.filter(v => v.itemId === item.itemId)[0];
      //   const parent = $(domItem.dom)
      //     .parent()
      //     .parent()
      //     .parent();
      //   if (!domItem) {
      //     return;
      //   }
      //   // sku信息
      //   const skuList = item.skuList || [];
      //   let skuInfo = "";
      //   if (skuList.length > 0) {
      //     skuInfo = `
      //       <div class='s-item__detail s-item__detail--secondary qiuzhang-table-wrapper' style="width: 100%">
      //         <div class="qiuzhang-table" style="width: 100%">
      //           <table>
      //             <thead>
      //               <tr>
      //                 <th>SKU</th>
      //                 <th>绑定人</th>
      //                 <th>可用库存</th>
      //                 <th>可用天数</th>
      //                 <th>日均/7天日均(销单数)</th>
      //                 <th>到达时间/数量</th>
      //                 <th>广告费率6%</th>
      //                 <th>广告费率8%</th>
      //                 <th>广告费率11%</th>
      //               </tr>
      //             </thead>
      //             <tbody>
      //               ${skuList
      //                 .map(v => {
      //                   return `
      //                   <tr>
      //                     <td>${v.sku}</td>
      //                     <td>${v.bindingPerson}</td>
      //                     <td>${v.availableStock}</td>
      //                     <td>${v.available_day}</td>
      //                     <td>
      //                       <span>
      //                         ${toFixed(
      //                           v.avg_day_sale_quantity,
      //                           3
      //                         )} / ${toFixed(v.avg_7days_sale_quantity, 2)}
      //                       </span>
      //                       <i style="color: ${
      //                         Number(v.avg_day_sale_quantity || 0) >
      //                         Number(v.avg_7days_sale_quantity || 0)
      //                           ? "#08f308"
      //                           : "red"
      //                       }; font-size: 15px; display: ${
      //                     Number(v.avg_day_sale_quantity || 0) ===
      //                     Number(v.avg_7days_sale_quantity || 0)
      //                       ? "none"
      //                       : ""
      //                   }">${
      //                     Number(v.avg_day_sale_quantity || 0) >
      //                     Number(v.avg_7days_sale_quantity || 0)
      //                       ? "↑"
      //                       : "↓"
      //                   }</i>
      //                     </td>
      //                     <td>
      //                       <div style="width: 100px">
      //                         ${v.arrival_time || "-"} / ${
      //                     v.arrival_number ? toFixed(v.arrival_number, 2) : "-"
      //                   }
      //                       </div>
      //                     </td>
      //                     <td>${v.break_ad_fee_rate6_price_6 || '-'}</td>
      //                     <td>${v.break_check_price_8 || ''}</td>
      //                     <td>${v.break_price_11 || ''}</td>
      //                   </tr>
      //                 `;
      //                 })
      //                 .join("")}
      //             </tbody>
      //           </table>
      //         </div>
      //       </div>
      //     `;
      //   }

      //   if ($(parent).find(".custom-info-wrapper").length > 0) {
      //     $(parent)
      //       .children(".custom-info-wrapper")
      //       .html(skuInfo);
      //   } else {
      //     $(parent).append(
      //       `<div class="custom-info-wrapper" style="width: 100%">${skuInfo}</div>`
      //     );
      //   }
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.button-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style lang="scss">
.qiuzhang-table-wrapper {
  position: relative;
}
.qiuzhang-table-wrapper:hover .qiuzhang-table {
  display: block;
}
.custom-sku-checklabel {
  color: #eeae62;
}
.qiuzhang-table {
  width: 360px;
  z-index: 20;
  /* display: none; */
  top: 0;
  left: 0;
  background-color: #fff;
  box-sizing: border-box;
  max-height: 300px;
  overflow-y: auto;
  display: block;
  position: inherit;
  padding: 0;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 2px 4px 0px;

  table {
    border-collapse: collapse;

    tr:not(:last-child) {
      border-bottom: 1px solid #f2f2f2;
    }

    th,
    td {
      border: 1px solid #ccc;
      text-align: center;
      width: 28%;
      padding: 2px !important;
      font-size: 12px !important;
      border: none;

      &:last-child {
        width: 100px;
      }
    }
  }
}
</style>
