<template>
  <!-- <LeftPanel height="140px" width="200px">
    <div class="button-wrapper">
      <el-button
        :loading="loading"
        type="primary"
        style="margin-top: 40px;"
        @click="openUrls"
      >
        打开宝舟子公司页面
      </el-button>
    </div>
  </LeftPanel> -->
  <div></div>
</template>

<script>
import LeftPanel from "@/components/LeftPanel";
import { UPLOAD_COOKIE_INFO } from "@/api/info";
import { FETCH_USER_INFO } from "@/api/tiktok";
import Cookies from "js-cookie";
import { CookiePluginsHostWhiteNameList as activeHosts } from "@/constants";
// import $ from "jquery";
import axios from "axios";
// import moment from "moment";

const hostType = {
  "ad.oceanengine.com": 1,
  "union.bytedance.com": 2,
  "creator.douyin.com": 3,
  "buyin.jinritemai.com": 4,
  "compass.jinritemai.com": 5
};
const type = Number(hostType[location.host]);
// 如果是business.oceanengine.com网页，通过接口获取账号列表
// 固定吧，接口加密的，不想跳转到获取接口的页面再获取了，简单点
const oceanengineOpenList = [
  "https://ad.oceanengine.com/pages/promotion.html?aadvid=1678163417635848#/a", // 广州宝舟信息科技有限公司001
  "https://ad.oceanengine.com/pages/promotion.html?aadvid=1681334903556109#/a", // 广州宝舟信息科技有限公司002
  "https://ad.oceanengine.com/pages/promotion.html?aadvid=1681336292036616#/a", // 广州宝舟信息科技有限公司003
  "https://ad.oceanengine.com/pages/promotion.html?aadvid=1681336292502536#/a", // 广州宝舟信息科技有限公司004
  "https://ad.oceanengine.com/pages/promotion.html?aadvid=1681336292938759#/a" // 广州宝舟信息科技有限公司005
];
export default {
  components: {
    LeftPanel
  },
  data() {
    return {
      loading: true,
      type,
      params: {
        type, // 类型5其实跟4是一样的，需要多传一个compass_cookie
        cookie: null,
        user_agent: navigator.userAgent
      },
      url: "",
      timer: null,
      oceanengineOpenList,
      companyList: []
    };
  },
  created() {
    console.log(`>>>>>>>>>>>>>>>> 获取Cookie等信息插件 >>>>>>>>>>>>>>>>`);
  },
  async mounted() {
    // 其它页面不操作
    const host = location.host;
    if (!activeHosts.includes(host)) {
      return;
    }

    const compassOpenList = ["https://compass.jinritemai.com/talent"];

    // business.oceanengine.com获取公司列表
    // if (location.href.indexOf("business.oceanengine.com") > -1) {
    //   axios({
    //     url:
    //       "https://business.oceanengine.com/platform/api/v1/bp/statistics/promote/advertiser/stats_list/",
    //     method: "POST",
    //     headers: {
    //       "content-type": "application/json",
    //       "x-csrftoken": Cookies.get("csrftoken")
    //     },
    //     data: {
    //       start_time: moment().format("YYYY-MM-DD"),
    //       end_time: moment().format("YYYY-MM-DD"),
    //       page: 1,
    //       limit: 10,
    //       order_type: 1,
    //       order_field: "stat_cost",
    //       stats_fields: [
    //         "stat_cost",
    //         "show_cnt",
    //         "click_cnt",
    //         "ctr",
    //         "cpc_platform",
    //         "cpm_platform",
    //         "convert_cnt",
    //         "conversion_cost",
    //         "conversion_rate",
    //         "deep_convert_cnt",
    //         "deep_convert_cost",
    //         "deep_convert_rate"
    //       ],
    //       cascade_fields: [
    //         "advertiser_remark",
    //         "advertiser_status",
    //         "advertiser_budget",
    //         "advertiser_balance",
    //         "advertiser_valid_balance",
    //         "advertiser_followed",
    //         "group_id"
    //       ],
    //       filter: { advertiser: {}, campaign: {}, ad: {}, group: {} }
    //     }
    //   }).then(data => {
    //     // 公司列表
    //     this.companyList = data.data.data.stats_list.map(item => ({
    //       id: item.advertiser_id,
    //       name: item.advertiser_name
    //     }));
    //     console.log(this.companyList);
    //     this.loading = false;
    //   });
    // }

    if (!type) {
      return;
    }

    // 子公司账号列表
    if (type === 1) {
      const data = await axios.get(
        `https://ad.oceanengine.com/platform/api/v1/bp/multi_accounts/org_with_account_list/?search_key=&aadvid=${Cookies.get(
          "trace_log_adv_id"
        )}&org_limit=5&account_limit=10`
      );
      this.companyList = data.data.data.org_list[0].account_list;
    }

    if (type === 4) {
      chrome.runtime.sendMessage(
        {
          action: "getTab",
          // ① 类型1的cookie是在新页面获取到的，因为chrome.cookies可以跨域获取
          // 所有不需要打开新页面的方式
          // ...oceanengineOpenList,
          urls: [...compassOpenList]
        },
        tab => {
          if (tab) {
            return;
          }
          window.open(compassOpenList[0], "_blank");
        }
      );
    }

    // 通知background获取cookies
    // 此处为什么不用document.cookie获取内？
    // 因为站内有很多cookie设置了httpOnly = true参数，
    // 此参数会导致document.cookie无法读取到这部分cookie，
    // 但是浏览器插件的background内的chrome.cookies方法可以获取到完整的
    chrome.runtime.sendMessage(
      {
        action: "getCookies",
        // ① 类型1的cookie是在新页面获取到的，因为chrome.cookies可以跨域获取
        // 所有不需要打开新页面的方式
        domain: location.href
      },
      cookies => {
        this.params.cookie = cookies;
        console.log(cookies);
        this.getInfo();
      }
    );

    chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
      if (request.apiStatus === "completed") {
        this.url = request.details.url;
      }
    });
  },
  methods: {
    openUrls() {
      this.companyList.forEach(item => {
        window.open(
          `https://ad.oceanengine.com/pages/promotion.html?aadvid=${item.id}#/a`,
          "_blank"
        );
      });
    },
    async getInfo() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.type === 3 && !this.url) {
        this.timer = setTimeout(() => this.getInfo(), 1000);
        return;
      }
      const params = this.params;
      let data;
      try {
        switch (this.type) {
          // case 1:
          //   params.aadvid = location.search.substring(1).split("=")[1]; // "1681334903556109";
          //   // 获取公司列表
          //   params.x_csrftoken = Cookies.get("csrftoken");

          //   break;
          case 2:
            params.x_appid = "3000";
            break;
          case 3:
            // data = await $.get(this.url);
            data = await axios.get(this.url);
            params.uid = data.data.user.uid;
            break;
          case 4:
            data = await FETCH_USER_INFO();
            params.uid = data.origin_uid;
            break;
          case 5:
            // data = await $.get(
            //   "https://compass.jinritemai.com/business_api/home/track"
            // );
            data = await axios.get(
              "https://compass.jinritemai.com/business_api/home/track"
            );
            params.uid = data.data.data.author_id;
            break;
        }

        // type为1需要将所有子公司都保存
        if (type === 1) {
          const promises = [];
          const x_csrftoken = Cookies.get("csrftoken");
          this.companyList.forEach(item => {
            promises.push(
              UPLOAD_COOKIE_INFO({
                ...this.params,
                aadvid: item.id,
                x_csrftoken
              })
            );
          });
          await Promise.all(promises);
        } else {
          await UPLOAD_COOKIE_INFO(params);
        }

        this.$notify({
          type: "success",
          title: "提示",
          message: "更新cookie等信息成功！",
          duration: 0,
          position: "bottom-right"
        });
      } catch (err) {
        this.$notify({
          type: "warning",
          title: "提示",
          message: err,
          duration: 0,
          position: "bottom-right"
        });
      }
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
