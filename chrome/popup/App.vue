<template>
  <div class="popup-page" v-loading="pageLoading">
    <h3 style="margin-top: 0; text-align: center;">
      {{ pluginName }}(v{{ version }})
    </h3>
    <div v-if="!isLogin">
      <el-form :model="form" :rules="rules" label-width="60px">
        <el-form-item label="工号" prop="userNumber">
          <el-input
            v-model="form.userNumber"
            placeholder="请输入工号"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-else>
      <p>
        <i class="el-icon-circle-check" style="color: green;"></i>
        登录成功，欢迎使用海汇插件集！
      </p>
      <div>
        <el-button @click="logout">退出登录</el-button>
        <!-- <el-button type="primary" @click="openUrl"
          >去设置Postage rate tables</el-button
        > -->
      </div>
    </div>
  </div>
</template>

<script>
import { login, getUserInfo } from "@/api/user";
import {
  LOGIN_COOKIE_DOMAIN,
  LOGIN_TOKEN_KEY,
  USER_NUMBER
} from "@/constants/token-key";

const VERSION = require("../manifest-prod.json").version;

export default {
  name: "App",

  components: {},

  data() {
    return {
      pageLoading: true,
      isLogin: false,
      form: {
        userNumber: "",
        password: ""
      },
      rules: {
        userNumber: [
          { required: true, trigger: "blur", message: "请填写工号" }
        ],
        password: [{ required: true, trigger: "blur", message: "请填写密码" }]
      },
      loading: false,
      version: VERSION
    };
  },
  computed: {
    pluginName() {
      return process.env.VUE_APP_LIMIT === "on"
        ? "海汇插件集-试用期员工版"
        : "海汇插件集";
    }
  },
  mounted() {
    chrome.runtime.sendMessage(
      {
        action: "getCookie",
        domain: LOGIN_COOKIE_DOMAIN,
        name: LOGIN_TOKEN_KEY
      },
      cookie => {
        this.pageLoading = false;
        this.isLogin = !!cookie;
      }
    );
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      try {
        const data = await login(JSON.stringify(this.form));
        const token = data.token;
        console.log({
          action: "setCookie",
          domain: LOGIN_COOKIE_DOMAIN,
          cookie: {
            name: LOGIN_TOKEN_KEY,
            value: token,
            expirationDate: new Date().getTime() / 1000 + 3600 * 2 // 6小时候过期
          }
        });
        chrome.runtime.sendMessage(
          {
            action: "setCookie",
            domain: LOGIN_COOKIE_DOMAIN,
            cookie: {
              name: LOGIN_TOKEN_KEY,
              value: token,
              expirationDate: new Date().getTime() / 1000 + 3600 * 2 // 6小时候过期
            }
          },
          () => {
            this.loading = false;
            this.isLogin = true;
            this.$message.success("登录成功");
            chrome.tabs.getSelected(null, function(tab) {
              chrome.tabs.sendRequest(
                tab.id,
                { action: "login", tabid: tab.id },
                function(response) {
                  console.log(response.data);
                }
              );
            });
          }
        );
        chrome.runtime.sendMessage(
          {
            action: "setCookie",
            domain: LOGIN_COOKIE_DOMAIN,
            cookie: {
              name: USER_NUMBER,
              value: this.form.userNumber,
              expirationDate: new Date().getTime() / 1000 + 3600 * 2 // 6小时候过期
            }
          },
          () => {
            console.log("工号：", this.form.userNumber);
          }
        );
      } catch (err) {
        this.loading = false;
        this.$message({
          type: "error",
          message: err
        });
      }
    },
    logout() {
      chrome.runtime.sendMessage({
        action: "removeCookie",
        domain: LOGIN_COOKIE_DOMAIN,
        name: USER_NUMBER
      });
      chrome.runtime.sendMessage(
        {
          action: "removeCookie",
          domain: LOGIN_COOKIE_DOMAIN,
          name: LOGIN_TOKEN_KEY
        },
        () => {
          this.isLogin = false;
          // 通知页面
        }
      );
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(
          tab.id,
          { action: "logout", tabid: tab.id },
          function(response) {
            console.log(response.data);
          }
        );
      });
    },
    // async getUserInfo () {
    //   getUserInfo
    // }
    openUrl() {
      window.open("https://www.ebay.com.au/ship/rt");
    }
  }
};
</script>

<style lang="scss">
.popup-page {
  width: 300px;
  box-sizing: border-box;
  padding: 15px;
}
</style>
