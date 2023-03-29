// 其它小功能
import $ from "jquery";
import { toFixed } from "@/utils";
import {
  LOGIN_COOKIE_DOMAIN,
  LOGIN_TOKEN_KEY,
  USER_NUMBER
} from "@/constants/token-key";
import Vue from "vue";
import Test from "./Test.vue";

const config = {
  //API_URL: 'https://uat01.tools-api.erp.bz-bss.com',
  API_URL: "https://tools-api.erp.bz-bss.com",
  API_URL2: "https://ebayplugin.bz-bss.com",
  TOKEN_PREFIX: "Basic "
};
const utils = {
  getToken: async () => {
    return await new Promise(resolve => {
      chrome.runtime.sendMessage(
        {
          action: "getCookie",
          domain: LOGIN_COOKIE_DOMAIN,
          name: LOGIN_TOKEN_KEY
        },
        cookie => {
          resolve(cookie);
        }
      );
    });
  },
  /**
   * @desc 封装post
   * @param { String } url
   * @param { Any } data
   * @return { Promise }
   */
  post: function(url, data) {
    return new Promise(async (resolve, reject) => {
      const cookie = await this.getToken();
      const token = cookie.value;
      console.log(token);
      $.ajax({
        url: config.API_URL2 + url,
        type: "POST",
        headers: { "User-Auth": config.TOKEN_PREFIX + token },
        contentType: false,
        processData: false,
        data,
        success(res) {
          // res = JSON.parse(res)
          resolve(res.data || res.result);
        },
        error(e) {
          reject(e.responseText);
        }
      });
    });
  },
  /**
   * @description 封装ajax请求
   * @return { Promise }
   */
  fetchList: function(items, keyword) {
    return new Promise((resolve, reject) => {
      $.ajax({
        // url: config.API_URL + "/ebay/ebay-rank-item-data",
        url: config.API_URL + "/ebay/ebay-rank-item-data-v2",
        type: "POST",
        // headers: { token: this.getToken() },
        headers: { token: "linshichulitigonggeichajiande" }, // 目前写死token了
        data: {
          data: JSON.stringify(items),
          key_words: keyword
        },
        success(res) {
          res = JSON.parse(res);
          resolve(res.data);
        },
        error(e) {
          reject(e.responseText);
        }
      });
    });
  },
  fetchSkuBindUsers: function(items) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: config.API_URL + "/ebay/sku-list-report",
        type: "POST",
        // headers: { token: this.getToken() },
        headers: { token: "linshichulitigonggeichajiande" }, // 目前写死token了
        data: {
          data: JSON.stringify(items)
        },
        success(res) {
          res = JSON.parse(res);
          resolve(res.data);
        },
        error(e) {
          reject(e.responseText);
        }
      });
    });
  },
  fetchStockAgeAndValues: function(items) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: config.API_URL + "/ebay/stock-age",
        type: "POST",
        // headers: { token: this.getToken() },
        headers: { token: "linshichulitigonggeichajiande" }, // 目前写死token了
        data: {
          data: JSON.stringify(items)
        },
        success(res) {
          res = JSON.parse(res);
          resolve(res.data);
        },
        error(e) {
          reject(e.responseText);
        }
      });
    });
  },
  /**
   * @desc 获取查询字符指定名称的值
   * @param { String } queryKey
   */
  getQueryKeyValue: function(queryKey) {
    const query = location.search.substr(1);
    const queryArr = query.split("&");
    let queryObj = {};
    queryArr.forEach(item => {
      const [key, value] = item.split("=");
      queryObj[key] = value;
    });
    return queryObj[queryKey];
  },
  /**
   * @create 2021/01/29 14:37
   * @desc 格式化数字成：123,456,789.12形式
   * @param { String|Number } num
   * @return { String }
   */
  formatNum(num) {
    let str = num + "";
    let dot = "";
    const hasDot = str.indexOf(".") > -1;
    const lastIndex = hasDot ? str.indexOf(".") : str.length;
    const intSum = str
      .substring(0, lastIndex)
      .replace(/\B(?=(?:\d{3})+$)/g, ","); //取到整数部分
    if (hasDot) {
      dot = str.substring(str.length, str.indexOf(".")); //取到小数部分搜索
    }
    return intSum + dot;
  },
  /**
   * @create 2021/01/20 10:05
   * @desc 显示关键字、费率等
   */
  addListInfo(domList, type = 1, keyword) {
    const itemIds = domList.map(v => v.itemId);

    // 模拟关键字显示
    // 调用关键字查询接口
    // 切割成COUNT条一组来请求，itemIds过多，一次请求耗时长
    // const COUNT = 22;
    // const paramsArr = [];
    // for (let i = 0; i < itemIds.length; i += COUNT) {
    //   paramsArr.push(itemIds.slice(i, i + COUNT));
    // }

    // 分两组查询
    const middleNumber = Math.ceil((itemIds.length - 1) / 2);
    const paramsArr = [
      itemIds.slice(0, middleNumber),
      itemIds.slice(middleNumber + 1)
    ];

    let domItem = null;
    paramsArr.forEach((params, i) => {
      utils
        .fetchList(params, keyword)
        .then(data => {
          // 数据格式
          // data: {
          //   link: 'xx',
          //   keyword: 'xx',
          //   suggestedRate: 'xx', // 建议费率
          //   settingRate: 'xxx', // 设置的费率
          //   skuList: [ // sku信息列表
          //     { sku: 'sku编号', bindingPerson: '绑定人名称', availableStock: '4个海外仓可用库存' },
          //   ]
          // }
          if (!Array.isArray(data) || data.length === 0) {
            return;
          }
          data.forEach(item => {
            domItem = domList.filter(v => v.itemId === item.itemId)[0];
            if (!domItem) {
              return;
            }

            //   // sku信息
            //   const list = item.skuList || [];
            //   // <span class="custom-sku-checklabel" style="font-size: 13px;">查看SKU信息</span>
            //   // class="custom-sku-table"
            //   const skuInfo = `
            //   <span class='s-item__detail s-item__detail--secondary custom-sku-wrapper tag-1'>
            //     <div class="ebay-list-sku-table">
            //       <table>
            //         <thead>
            //           <tr>
            //             <th>SKU</th>
            //             <th>绑定人</th>
            //             <th>海外仓可用库存</th>
            //             <th>可用天数</th>
            //             <th>到达时间/数量</th>
            //           </tr>
            //         </thead>
            //         <tbody>
            //           ${list
            //             .map(
            //               v =>
            //                 `<tr><td>${v.sku}</td><td>${
            //                   v.bindingPerson
            //                 }</td><td>${v.availableStock}</td><td>${
            //                   v.available_day
            //                 }</td><td>${v.arrival_time || "-"} / ${
            //                   v.arrival_number
            //                     ? toFixed(v.arrival_number, 2)
            //                     : "-"
            //                 }</td></tr>`
            //             )
            //             .join("")}
            //         </tbody>
            //       </table>
            //     </div>
            //   </span>
            // `;

            // 费率
            const feiLv = `
            <span class='s-item__detail s-item__detail--secondary tag-2' style="font-size: 13px;color: #7CCEF7; display: flex;">
              ${
                item.suggestedRate
                  ? `<span style="margin-right: 12px">建议费率：${item.suggestedRate ||
                      ""}</span>`
                  : ""
              }
              ${
                item.settingRate
                  ? `<a target="_blank" href="${
                      item.settingRateLink
                        ? item.settingRateLink
                        : "javascript:void(0)"
                    }" style="color: #7CCEF7; margin-right: 12px">设置的费率：${item.settingRate ||
                      ""}</a>`
                  : ""
              }
              ${
                item.profit
                  ? `<span style="margin-right: 12px">利润：${item.profit}</span>`
                  : ""
              }
              ${
                item.totalAmount
                  ? `<span style="margin-right: 12px">销售额：${item.totalAmount}</span>`
                  : ""
              }
            </span>
          `;

            // 历史费率排名
            const adlogList = item.adLog || [];
            const adlogInfo = `
              <span class='s-item__detail s-item__detail--secondary custom-sku-wrapper tag-1'>
                <span class="custom-sku-checklabel" style="font-size: 13px;">历史费率排名</span>
                <div class="custom-sku-table">
                  <table>
                    <thead>
                      <tr>
                        <th>费率</th>
                        <th>日期</th>
                        <th>排名</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${adlogList
                        .map(
                          v =>
                            `<tr><td>${v.bid_percentages}</td><td>${v.date}</td><td>${v.rank}</td></tr>`
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>
              </span>
            `;

            // 关键字
            // const keyword = `
            //   <span>
            //     <a href="${item.link}" target="_blank" style="margin-left: 10px;font-size: 13px;text-decoration: underline; color: red">${item.keyword || ''}</a>
            //   </span>
            // `
            const keyword = `
            <span class="tag-4 custom-keyword" style="margin-left: 10px;font-size: 13px;text-decoration: underline; color: red; cursor: pointer" data-link="${item.link}">${item.keyword}</span>
          `;

            // 广告排名和自然排名
            const rankInfo = `
            <span class='s-item__detail s-item__detail--secondary tag-5' style="font-size: 13px;color: blue; display: flex;">
              <span>广告排名: ${item.rankInfo.adRank}</span>
              <span style="margin-left: 15px">自然排名: ${item.rankInfo.normalRank}</span>
            </span>
          `;

            // fixed-bug: 重复获取接口时，往页面添加重复的信息
            // 先移除再添加，防止重复
            // $(domItem.dom)
            //   .parent()
            //   .find("tag-1")
            //   .remove();
            $(domItem.dom)
              .parent()
              .find("tag-2")
              .remove();
            $(domItem.dom)
              .parent()
              .find("tag-3")
              .remove();
            $(domItem.dom)
              .parent()
              .find("tag-4")
              .remove();
            $(domItem.dom)
              .parent()
              .find("tag-5")
              .remove();
            if (type === 1) {
              // 搜索列表页
              // if (list.length > 0) {
              //   $(domItem.dom)
              //     .parent()
              //     .after(skuInfo);
              // }

              if (adlogList.length > 0) {
                $(domItem.dom)
                  .parent()
                  .after(adlogInfo);
              }
              if (item.rankInfo !== "-") {
                $(domItem.dom)
                  .parent()
                  .after(rankInfo);
              }
              if (
                item.suggestedRate ||
                item.settingRate ||
                item.profit ||
                item.totalAmount
              ) {
                $(domItem.dom)
                  .parent()
                  .after(feiLv);
              }
              if (item.keyword) {
                $(domItem.dom)
                  .parent()
                  .append(keyword);
              }
            } else {
              // 查看更多列表页
              if (item.keyword) {
                $(domItem.dom).append(keyword);
              }
              if (item.rankInfo !== "-") {
                $(domItem.dom)
                  .parent()
                  .append(`<li>${rankInfo}</li>`);
              }
              $(domItem.dom)
                .parent()
                .append(`<li>${feiLv}</li>`);

              // if (list.length > 0) {
              //   $(domItem.dom)
              //     .parent()
              //     .append(`<li>${skuInfo}</li>`);
              // }
            }
          });

          $(".custom-keyword").on("click", function() {
            const keyword = $(this).text();
            // 打开购买历史页
            window.open($(this).attr("data-link"));

            // 打开ebay产品开发页，将keyword参数按空格切割带入标题条件，并设置审批流状态为初审
            const approval =
              "DevelopProductSpuSearch[approval_flow_status][]=8"; // 审核状态：初审
            const keywords = keyword.split(" ");
            const conditions = keywords.map((v, i) => {
              return `
                DevelopProductSpuSearch[titleArray][conditionChange][${i}]=like&
                DevelopProductSpuSearch[titleArray][value][${i}]=${v}&
                DevelopProductSpuSearch[titleArray][logicChange][${i}]=and
              `;
            });
            window.open(
              `https://erp.bz-bss.com/ebay/develop-product-spu/index?${approval}&${conditions.join(
                "&"
              )}`
            );
          });
        })
        .catch(err => {
          console.error(err);
        });
    });
    // sku绑定人构造
    this.makeSkuBindUsers(domList, itemIds, type);
    // 库龄/库值表格构造
    this.makeStockAgeAndValueInfo(domList, itemIds, type);
  },
  async makeSkuBindUsers(domList, itemIds, type) {
    try {
      const data = await utils.fetchSkuBindUsers(itemIds);
      let domItem = null;
      data.forEach(item => {
        domItem = domList.filter(v => v.itemId === item.itemId)[0];
        if (!domItem) {
          return;
        }
        // sku信息
        const list = item.skuList || [];
        // <span class="custom-sku-checklabel" style="font-size: 13px;">查看SKU信息</span>
        // class="custom-sku-table"
        const skuInfo = `
      <span class='s-item__detail s-item__detail--secondary s-item__detail--custom custom-sku-wrapper tag-1'>
        <div class="ebay-list-sku-table">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>绑定人</th>
                <th>可用库存</th>
                <th>可用天数</th>
                <th>日均/7天日均(销单数)</th>
                <th>到达时间/数量</th>
              </tr>
            </thead>
            <tbody>
              ${list
                .map(
                  v =>
                    `<tr>
                    <td>${v.sku}</td>
                    <td>${v.bindingPerson}</td>
                    <td>${v.availableStock}</td>
                    <td>${v.available_day}</td>
                    <td>
                            <span>
                              ${toFixed(
                                v.avg_day_sale_quantity,
                                3
                              )} / ${toFixed(v.avg_7days_sale_quantity, 2)}
                            </span>
                            <i style="color: ${
                              Number(v.avg_day_sale_quantity || 0) >
                              Number(v.avg_7days_sale_quantity || 0)
                                ? "#08f308"
                                : "red"
                            }; font-size: 15px; display: ${
                      Number(v.avg_day_sale_quantity || 0) ===
                      Number(v.avg_7days_sale_quantity || 0)
                        ? "none"
                        : ""
                    }">${
                      Number(v.avg_day_sale_quantity || 0) >
                      Number(v.avg_7days_sale_quantity || 0)
                        ? "↑"
                        : "↓"
                    }</i>
                          </td>
                    <td>${v.arrival_time || "-"} / ${
                      v.arrival_number ? toFixed(v.arrival_number, 2) : "-"
                    }</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </span>
    `;
        $(domItem.dom)
          .parent()
          .find("tag-1")
          .remove();
        if (type === 1) {
          if (list.length > 0) {
            $(domItem.dom)
              .parent()
              .after(skuInfo);
          }
        } else {
          if (list.length > 0) {
            $(domItem.dom)
              .parent()
              .append(`<li>${skuInfo}</li>`);
          }
        }
      });
      // console.log("sku 绑定人", data);
    } catch (err) {
      console.error(err);
    }
  },
  /**
   * @description 构造sku/库龄/库值表格构造
   * @param {Array} domList ebay列表页数据 [{itemId: xx, domItem: xx}]
   * @param {Array} itemIds itemId列表 [itemId1, itemId2, ...]
   * @param {Number} type 列表页面不同，根据类型来写入
   */
  async makeStockAgeAndValueInfo(domList, itemIds, type) {
    try {
      const data = await utils.fetchStockAgeAndValues(itemIds);
      let domItem = null;
      data.forEach(item => {
        domItem = domList.filter(v => v.itemId === item.itemId)[0];
        if (!domItem) {
          return;
        }
        const list = item.stockAgeList || [];
        const stockInfo = `
          <span class='s-item__detail s-item__detail--secondary s-item__detail--custom custom-stock-wrapper'>
            <div class="ebay-list-stock-table">
              <table>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>121-150天库值/数量</th>
                    <th>151-180天库值/数量</th>
                    <th>181-360天库值/数量</th>
                    <th>360+天库值/数量</th>
                  </tr>
                </thead>
                <tbody>
                  ${list
                    .map(
                      v =>
                        `<tr>
                          <td>${v.skuNumber}</td>
                          <td>${v.stockAgeTotal121to150AgeCost}/${v.stockAgeTotal121to150AgeQuantity}</td>
                          <td>${v.stockAgeTotal151to180AgeCost}/${v.stockAgeTotal151to180AgeQuantity}</td>
                          <td>${v.stockAgeTotal181to360AgeCost}/${v.stockAgeTotal181to360AgeQuantity}</td>
                          <td>${v.stockAgeTotal361AgeCost}/${v.stockAgeTotal361AgeQuantity}</td>
                        </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </span>
        `;
        $(domItem.dom)
          .parent()
          .find("custom-stock-wrapper")
          .remove();
        if (type === 1) {
          if (list.length > 0) {
            $(domItem.dom)
              .parent()
              .after(stockInfo);
          }
        } else {
          if (list.length > 0) {
            $(domItem.dom)
              .parent()
              .append(`<li>${stockInfo}</li>`);
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  },
  makeTable(items) {
    const itemIds = items.map(v => v.itemId);
    // /ebay/ebay-sales-to-item
    utils
      .post("/Ebay/ItemSalesData", JSON.stringify({ data: itemIds }))
      .then(res => {
        const data = res.data;
        items.forEach(item => {
          const arr = data[item.itemId];
          const table = `<div class="sales-info-table">
          <table>
            <thead>
              <th></th>
              ${arr.map(v => `<th>${v.label}</th>`).join("")}
              <th>近30天销售额</th>
              <th>是否实时获取</th>
            </thead>
            <tbody>
              <tr>
                <td>销量</td>
                ${arr
                  .map(v => `<td>${utils.formatNum(v.orders)}</td>`)
                  .join("")}
                <td>$${utils.formatNum(arr[arr.length - 1].sales)}</td>
                <td style="color: ${!arr[0].is_new ? "red" : "inherit"}">${
            arr[0].is_new ? "是" : "否"
          }</td>
              </tr>
            </tbody>
          </table>
        </div>`;
          // <tr>
          //   <td>销量额</td>
          //   ${arr.map(v => `<td>${utils.formatNum(v.sales)}</td>`).join('')}
          // </tr>

          if (item.hasItemId) {
            if (
              $(item.dom)
                .parent()
                .parent()
                .attr("class")
                .indexOf("s-item__details") > -1
            ) {
              $(item.dom)
                .parent()
                .parent()
                .after(table);
            } else {
              $(item.dom)
                .parent()
                .after(table);
            }
          } else {
            $(item.dom).append(table);
          }
        });
      });
  }
};

export default utils;
