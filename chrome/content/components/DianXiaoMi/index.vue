<template>
  <RightPanel width="150px" height="150px">
    <div style="text-align: center">
      <el-button
        style="margin-top: 50px;"
        size="large"
        type="primary"
        v-loading="loading"
        @click="getPrintInfo"
        >拉取面单</el-button
      >
    </div>
  </RightPanel>
</template>

<script>
/**
 * @description 店小秘拉面单插件
 * ① 查询单号列表，有单则逐个上传面单，每个面单之间间隔6-20秒上传。
 * ② 所有面单上传完毕后，等待1分钟再次查询单号列表，如此反复。
 */
import RightPanel from "@/components/RightPanel";
import $ from "jquery";
import axios from "axios";
import { getOrderList } from "@/api/dianxiaomi.js";
import { sleep } from "@/utils";

export default {
  name: "DianXiaoMi",
  components: {
    RightPanel
  },
  data() {
    return {
      timer: null,
      loading: false
    };
  },
  mounted() {
    console.log(
      "%c==================== 店小秘拉取面单插件 ====================",
      "color: green"
    );
  },
  methods: {
    /**
     * @create 2021/09/10 11:00
     * @creator 潜
     * @description 订单号查询面单列表，再将面单上传给后台
     */
    async getPrintInfo() {
      this.loading = true;
      this.$loading({
        lock: true,
        text: "拉取面单插件运行中，请勿操作/关闭页面...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)"
      });
      try {
        // 获取需要查询的订单号列表
        const data = await getOrderList();
        const list = data.numbers || [];
        // const list = [
        //   "299813362104355",
        //   "299723845142155",
        //   "299698692253566",
        //   "299683498475560",
        //   "299889243891961"
        // ];
        if (list.length === 0) {
          return true;
        }
        // 订单号查询面单列表html页面
        const html = await $.get(
          `https://www.dianxiaomi.com/package/searchPackage.htm?pageNo=1&pageSize=100&state=allocated_has&shopId=-1&history=&searchType=orderId&content=${list.join(
            ","
          )}&isVoided=0&isRemoved=0&commitPlatform=&platform=&isGreen=0&isYellow=0&isOrange=0&isRed=0&isViolet=0&isBlue=0&cornflowerBlue=0&pink=0&teal=0&turquoise=0&unmarked=0&isSearch=0&isFree=0&isBatch=0&isOversea=-1&forbiddenStatus=-1&forbiddenReason=0&orderField=order_pay_time&behindTrack=-1&storageId=0&timeOut=0&orderSearchType=1`
        );
        // 构建虚拟dom
        let div = document.createElement("div");
        $(div).html(html);
        // 筛选出面单列表元素
        const orderList = $(div)
          .find(".xianshishujudate tr[class^=orderId_]")
          .toArray();
        // 上传面单
        await this.uploadPrintInfos(orderList);
        // 上传完，释放内存
        div = null;
      } catch (err) {
        console.error(err);
      } finally {
        // 等待60秒继续下一批
        await sleep(60000);
        this.getPrintInfo();
      }
    },
    /**
     * @create 2021/09/10 14:13
     * @creator 潜
     * @description 上传面单
     */
    async uploadPrintInfos(list) {
      if (list.length === 0) {
        return true;
      }
      const item = list.pop();
      const url =
        "https://www.dianxiaomi.com/" +
        $(item)
          .children("td:last-child")
          .find("a:first-child")
          .attr("href");
      const order_number = $(item)
        .find(".tableOrderId a")
        .text();
      const logistics_number = $(item)
        .find(".limingcentUrlpicson a[data-as]")
        .text();
      // 模拟打印面单点击事件
      // 打印面单 按钮执行性一个调用接口的逻辑
      // 故模拟事件只需要调用这个接口
      this.mockPrintEvent(url);

      try {
        await new Promise(resolve => {
          chrome.runtime.sendMessage(
            {
              action: "uploadPrintPdf",
              pdfData: {
                url,
                order_number,
                logistics_number
              }
            },
            cookie => {
              resolve(cookie);
            }
          );
        });
        // 等待 6-20秒
        await sleep(Math.max(6000, Math.ceil(Math.random() * 20000)));
        return await this.uploadPrintInfos(list);
      } catch (err) {
        console.error(err);
      }
    },
    /**
     * @create 2021/09/10 16:20
     * @creator 潜
     * @description 模拟打印面单 事件内容
     * @param {string} url 面单url
     */
    mockPrintEvent(url) {
      if (typeof url !== "string") {
        return;
      }
      const queryParams = url.split("?")[1];
      const queryObj = {};
      queryParams.split("&").forEach(query => {
        const [key, value] = query.split("=");
        queryObj[key] = value;
      });
      // 调用检查打印状态接口
      $.ajax({
        type: "POST",
        url: "checkPrint.json",
        data: { packageIds: queryObj.packageIds, authId: queryObj.authId },
        dataType: "json"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .rightPanel {
  min-height: 100px;
}
</style>
