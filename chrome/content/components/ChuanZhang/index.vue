<template>
  <div></div>
</template>

<script>
import $ from "jquery";

function copyText(value) {
  const input = document.createElement("textarea");
  document.body.appendChild(input);
  input.innerHTML = value;
  input.select();
  if (document.execCommand("copy")) {
    document.execCommand("copy");
  }
  document.body.removeChild(input);
}

export default {
  name: "ChuanZhang",
  data() {
    return {
      pollCount: 0,
      timer: null
    };
  },
  mounted() {
    console.log("========== 初始化船长插件 ===========");
    this.poll();

    chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
      if (request.apiStatus === "completed") {
        setTimeout(() => {
          this.init();
        }, 2000);
      }
    });
  },
  methods: {
    async poll() {
      if (this.pollCount > 20) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.pollCount++;
      this.timer = setTimeout(async () => {
        console.log(`执行次数：${this.pollCount}`);
        try {
          const len = $(
            $("iframe#iframe_926")[0].contentWindow.document.body
          ).find("#list tbody tr").length;
          if (len === 0) {
            await this.poll();
          } else {
            this.init();
            clearTimeout(this.timer);
            this.timer = null;
          }
        } catch (err) {
          await this.poll();
        }
      }, 1000);
    },
    init() {
      let actionTrs = [];
      if (!$("iframe#iframe_926") || $("iframe#iframe_926").length === 0) {
        return;
      }
      try {
        actionTrs = $(
          $("iframe#iframe_926")[0].contentWindow.document.body
        ).find("#list tbody tr");
      } catch (err) {
        console.error(err);
      }

      if (actionTrs.length === 0) {
        return;
      }
      console.log("[actionTrs]: ", actionTrs);
      actionTrs.toArray().forEach(item => {
        if ($(item).find("td:last-child .custom-claim-btn").length === 0) {
          $(item)
            .find("td:last-child")
            .append(
              `<span class="custom-claim-btn" style="color: red; margin-top: 10px; display: inline-block; cursor: pointer;">复制索赔模板</span>`
            );
        }
      });

      $($("iframe#iframe_926")[0].contentWindow.document.body).off(
        "click",
        ".custom-claim-btn"
      );
      $($("iframe#iframe_926")[0].contentWindow.document.body).delegate(
        ".custom-claim-btn",
        "click",
        this.copy
      );
    },
    copy(e) {
      const tr = $(e.target)
        .parent()
        .parent();
      const fnsku = $(tr)
        .find(".asin p:first-child a.light-green")
        .text();
      const quantity = parseInt(
        $(tr)
          .children("td:nth-child(3)")
          .text()
      );
      // const itemIds = $(tr)
      //   .find(".sexs .boxs span:first-child")
      //   .toArray()
      //   .map(item =>
      //     $(item)
      //       .text()
      //       .substring(3)
      //   );
      const itemIds = $(tr)
        .find("td:nth-child(4) >div >span:nth-child(2)")
        .text()
        .split(" ")
        .map(item => item.split(",")[0].split(":")[1])
        .filter(item => !!item);

      copyText(`
Hi Amazon Seller Support,
Based on my inventory adjustment and reimbursements report, one of FNSKU have lost inventory,
FNSKU: ${fnsku}, quantity ${quantity},transaction item id:${itemIds.join(",")};
Could you please help investigate the condition of the shipment and make compensation?
Thank you in advance for your supporting.

Best regards.
uniquebella
      `);

      // clip在使用iframe时有问题
      //       clip(
      //         `
      // Hi Amazon Seller Support,
      // Based on my inventory adjustment and reimbursements report, one of FNSKU have lost inventory,
      // FNSKU: ${fnsku}, quantity ${quantity},transaction item id:${itemIds.join(",")};
      // Could you please help investigate the condition of the shipment and make compensation?
      // Thank you in advance for your supporting.

      // Best regards.
      // uniquebella
      //       `,
      //         e
      //       );
      this.$message.success("复制成功！");
    }
  }
};
</script>

<style lang="scss" scoped></style>
