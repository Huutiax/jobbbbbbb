<template>
  <div class="popup-page">
    <h3 style="margin-top: 0; text-align: center;">{{ title }}</h3>
    <el-form :model="form" :rules="rules" label-width="40px" v-if="!isLogin">
      <el-form-item label="工号">
        <el-input v-model="form.userNumber" placeholder="请输入工号"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="login">
          登录
        </el-button>
      </el-form-item>
    </el-form>
    <div v-else class="result-wrapper">
      <div>登录成功~</div>
      <div>
        <el-button type="primary" @click="logout">重新登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ERPBI_TOKEN_KEY } from "@/constants/token-key";
import { getToken, setToken, removeToken } from "@/utils/auth";

export default {
  name: "App",
  components: {},
  props: {
    title: {
      type: String,
      default: "天拓海汇插件集"
    },
    tokenKey: {
      type: String,
      default: ERPBI_TOKEN_KEY
    },
    loginFunction: {
      type: Function,
      default: async () => {}
    }
  },
  data() {
    return {
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
      loading: false
    };
  },
  created() {
    if (getToken(this.tokenKey)) {
      this.isLogin = true;
    }
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        const token = await this.loginFunction(this.form);
        setToken(this.tokenKey, token);
        this.isLogin = true;
        this.$message.success("登录成功！");
      } catch (err) {
        removeToken(this.tokenKey);
        this.isLogin = false;
        this.$message({
          type: "error",
          message: `登录失败，失败原因：${err}`
        });
      } finally {
        this.loading = false;
      }
    },
    logout(canReload = true) {
      removeToken(this.tokenKey);
      this.isLogin = false;
      if (canReload) {
        location.reload();
      }
    }
  }
};
</script>

<style lang="scss">
.popup-page {
  width: 200px;
  box-sizing: border-box;
  padding: 15px;
}
.result-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}
</style>
