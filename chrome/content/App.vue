<template>
  <div>
    <!-- <Instagram /> -->
    <template v-if="isLogin">
      <!-- 所有插件调整为都需要登录才能使用的插件 -->
      <!-- 抖音巨量百应拉单和拉取直播记录插件 -->
      <!-- <TiktokOrder v-if="showTiktokOrder"></TiktokOrder> -->

      <!-- 人事需求插件（个性化定制），51job搜索历史记录插件 -->
      <Job51 v-if="show51Job" />

      <!-- 禅妈妈爬虫插件，爬取达人信息 -->
      <ChanMaMa v-if="showChanMaMa" />

      <!-- 数字酋长插件 -->
      <ShuZiQiuZhang v-if="showShuZiQiuZhang" />

      <Ebay />

      <Shopee v-if="showShopee" />

      <!-- shopee以图搜图补充功能 -->
      <!-- <ShopeeSearchByImage /> -->
    </template>
    <template>
      <!-- 洋桃爬虫插件，获取各平台的cookie信息 -->
      <GetCookieInfo v-if="showGetCookieInfo" />
      <!-- 店小秘拉取面单 -->
      <DianXiaoMi v-if="showDianXiaoMi" />
      <!-- 船长FBA索赔页面复制邮件模板插件 -->
      <ChuanZhang v-if="showChuanZhang" />
    </template>
  </div>
</template>

<script>
import Ebay from "./components/Ebay";
import TiktokOrder from "./components/TiktokOrder";
import Job51 from "./components/Job51";
import ChanMaMa from "./components/ChanMaMa";
import GetCookieInfo from "./components/GetCookieInfo";
import ShuZiQiuZhang from "./components/ShuZiQiuZhang";
import Shopee from "./components/Shopee";
import DianXiaoMi from "./components/DianXiaoMi";
import Instagram from "./components/Instagram";
// import SearchByImage from "./components/Shopee/SearchByImage.vue";
import ChuanZhang from "./components/ChuanZhang";

import { CookiePluginsHostWhiteNameList } from "@/constants";
import { ProbationaryStaff } from "@/constants/index";
import {
  LOGIN_COOKIE_DOMAIN,
  LOGIN_TOKEN_KEY,
  USER_NUMBER
} from "@/constants/token-key";
import $ from "jquery";

/* eslint-disable */
export default {
  name: "App",
  components: {
    Ebay,
    TiktokOrder,
    Job51,
    ChanMaMa,
    GetCookieInfo,
    ShuZiQiuZhang,
    Shopee,
    DianXiaoMi,
    Instagram,
    ChuanZhang
    // ShopeeSearchByImage: SearchByImage
},
  data() {
    return {
      isLogin: false,
    };
  },
  mounted() {
    this.checkIsLogin();

    chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
      const action = request.action;
      console.log("action", action);
      if (action === "logout") {
        this.isLogin = false;
        location.reload()
      } else if (action === "login") {
        this.checkIsLogin();
      }
      sendResponse({ hasRecieved: true });
    });
  },
  computed: {
    showTiktokOrder() {
      return location.href.indexOf("buyin.jinritemai.com") > -1;
    },
    show51Job() {
      return (
        location.href.indexOf(
          "https://ehire.51job.com/Candidate/SearchResumeLatestVersion.aspx"
        ) > -1
      );
    },
    showChanMaMa() {
      return location.href.indexOf("https://www.chanmama.com") > -1;
    },
    showGetCookieInfo() {
      return CookiePluginsHostWhiteNameList.includes(location.host);
    },
    showShuZiQiuZhang() {
      return location.host === "erp.datacaciques.com";
    },
    showShopee () {
      const href = location.href
      // return (href.includes("https://shopee") && href.includes('/search')) || href.includes('https://br.xiapibuy.com/search') || href.includes("https://s.1688.com/youyuan/index.htm")
      return href.includes("https://shopee") || href.includes('https://br.xiapibuy.com') || href.includes("https://s.1688.com/youyuan/index.htm")
    },
    showDianXiaoMi () {
      return location.href === 'https://www.dianxiaomi.com/order/index.htm'
    },
    showChuanZhang () {
      return location.href === 'https://console.captainbi.com/app/#/amz/FBA/fba_claim/fbaClaimDetail'
    }
  },
  methods: {
    /**
     * @description 检查token是否过期
     */
    checkIsLogin() {
      chrome.runtime.sendMessage(
        {
          action: "getCookies",
          domain: LOGIN_COOKIE_DOMAIN,
        },
        (cookies) => {
          if (!cookies) {
            return;
          }
          const obj = {};
          cookies.split(";").forEach((v) => {
            const [key, value] = v.split("=");
            obj[key] = value;
          });
          const token = obj[LOGIN_TOKEN_KEY];
          $.ajax({
            url: "https://ebayplugin.bz-bss.com/Ebay/GetUserData",
            method: "get",
            headers: {
              "User-Auth": "Basic " + token,
            },
            onSuccess: () => console.log(1),
            success: () => {
              this.isLogin = true;
              const userNumber = obj[USER_NUMBER];
              this.$store.commit("setUserNumber", userNumber);
              // 保存是否是试用期员工，做权限用
              this.$store.commit(
                "setIsProbationaryStaff",
                ProbationaryStaff.includes(userNumber)
              );

              console.log(this.isLogin, ProbationaryStaff, this.$store.state);
            },
            error: (e) => {
              // token过期
              if (e.responseJSON.code === 40005) {
                this.isLogin = false;
                chrome.runtime.sendMessage({
                  action: "removeCookie",
                  domain: LOGIN_COOKIE_DOMAIN,
                  name: LOGIN_TOKEN_KEY,
                });
                chrome.runtime.sendMessage({
                  action: "removeCookie",
                  domain: LOGIN_COOKIE_DOMAIN,
                  name: USER_NUMBER,
                });
                this.$message.error("插件登录状态已过期，请重新登录！");
              }
            },
          });
        }
      );
    },
  },
};
</script>
