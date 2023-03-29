<template>
  <LeftPanel height="200px" width="200px">
    <Login ref="login" :login-function="handleLogin"></Login>
    <div v-if="isLogin" class="button-wrapper">
      <el-button @click="makeAddButton">重载插件</el-button>
    </div>
  </LeftPanel>
</template>

<script>
import LeftPanel from "@/components/LeftPanel";
import Login from "@/components/Login";
import $ from "jquery";
import {
  LOGIN,
  ADD_MISSION,
  EDIT_MISSION,
  GET_MISSIONS,
  ADD_BASIC_DATA,
  ADD_LIVE_DATA,
  ADD_VIDEO_DATA,
  ADD_PRODUCT_DATA,
  ADD_FANS_DATA
} from "@/api/chanmama.js";
import http from "@/utils/request";
// import ajaxListener from "@/utils/ajax-listener";
import moment from "moment";
import { getToken } from "@/utils/auth";
import { ERPBI_TOKEN_KEY } from "@/constants/token-key";
// ajaxListener();

function makeSelectText(list, text = "筛选条件", prefix = "") {
  const filterCondition = list.filter(
    item =>
      $(item)
        .children(".origin-tit")
        .text() === text
  )[0];
  return $(filterCondition)
    .find(".condition-item")
    .toArray()
    .map(item => {
      return `${prefix +
        $(item)
          .children("label")
          .text()}: ${$(item)
        .find(".el-input__inner")
        .val()}`;
    });
}

const days = {
  seven: `start_date=${moment()
    .subtract(7, "days")
    .format("YYYY-MM-DD")}&end_date=${moment()
    .subtract(1, "days")
    .format("YYYY-MM-DD")}`,
  fifteen: `start_date=${moment()
    .subtract(15, "days")
    .format("YYYY-MM-DD")}&end_date=${moment()
    .subtract(1, "days")
    .format("YYYY-MM-DD")}`,
  thirty: `start_date=${moment()
    .subtract(30, "days")
    .format("YYYY-MM-DD")}&end_date=${moment()
    .subtract(1, "days")
    .format("YYYY-MM-DD")}`
};
function getDay(dateStr, index) {
  return dateStr.split("&")[index].split("=")[1];
}

export default {
  components: {
    LeftPanel,
    Login
  },
  data() {
    return {
      searchUrl: "",
      searchText: "", // 筛选条件文本
      missions: [],
      timer: null,
      isLogin: false
    };
  },
  mounted() {
    if (getToken(ERPBI_TOKEN_KEY)) {
      console.log("<<<<<<<<<<< 禅妈妈插件 <<<<<<<<<<<<");
      this.init();
      this.isLogin = true;
    }
    chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
      if (request.apiStatus === "completed") {
        if (getToken(ERPBI_TOKEN_KEY)) {
          this.makeAddButton();
        }
      }
    });
  },
  methods: {
    init() {
      // 表格添加加入爬虫任务按钮
      this.makeAddButton();
      // 轮询任务
      this.pollMission();

      // this.fetchDetails({
      //   author_id: "61070806273",
      //   author_name: "朱瓜瓜"
      // });
    },
    async handleLogin(form) {
      try {
        const data = await LOGIN(form);
        this.init();
        return Promise.resolve(data.token);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    /**
     * @description 任务轮询
     * @param { number } interval 轮询间隔时间
     */
    pollMission(interval = 5000) {
      this.timer = setTimeout(async () => {
        try {
          const data = await GET_MISSIONS();
          const missions = data.list || [];
          if (missions.length === 0) {
            this.pollMission();
            return;
          }
          // const mission = missions.shift();
          await this.executeMission(missions);
          console.log("完成列表任务");
          clearTimeout(this.timer);
          this.timer = null;

          this.pollMission();
          // 执行任务
        } catch (err) {
          console.error(err);
          if (err === "登录token已失效") {
            this.logout();
          } else {
            this.pollMission();
          }
        }
      }, interval);
    },
    /**
     * @description 构造添加任务按钮
     */
    makeAddButton() {
      $(".blogger")
        .children("td:last-child")
        .children("div")
        .find(".custom-add-button")
        .remove();

      $(".blogger")
        .children("td:last-child")
        .children("div").append(`
        <div data-v-4c3fc3f2 class="custom-add-button fav-box flex align-items-center justify-content-center cursor-pointer ml5" style="font-size: 18px;">
          +
        </div>
      `);

      $(".custom-add-button").click(e => {
        this.handleAddMission(e);
      });
    },
    /**
     * @description 执行任务
     * @param { Array } missions 任务列表
     */
    async executeMission(missions) {
      if (missions.length === 0) {
        return Promise.resolve(true);
      }
      const mission = missions.splice(0, 1)[0];
      try {
        // 修改任务状态为执行中
        await EDIT_MISSION({ id: mission.id, type: 1 });
        // 获取详情内容
        await this.fetchDetails(mission);
        // 修改任务状态为完成
        await EDIT_MISSION({ id: mission.id, type: 2 });
        // 随机延迟x秒继续执行任务
        await this.sleep(5000);
        await this.executeMission(missions);
      } catch (err) {
        console.error(err);
        // 修改任务状态为失败
        await EDIT_MISSION({ id: mission.id, type: -1 });
      }
      // 完成后继续轮询
      // this.pollMission();
    },
    /**
     * @description 获取详情内容
     * @param { object } mission 任务对象
     * @return { Promise }
     */
    fetchDetails(mission) {
      return new Promise(async (resolve, reject) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(`爬取任务: ${JSON.stringify(mission)}`);
        console.time(`${mission.id}耗时`);
        // 基础分析
        await this.basicAnalysis(mission);
        await this.sleep();
        // 直播分析
        await this.liveAnalysis(mission);
        await this.sleep();
        // 视频分析
        await this.videoAnalysis(mission);
        await this.sleep();
        // 电商分析
        await this.productAnalysis(mission);
        await this.sleep();
        // 粉丝分析
        await this.fansAnalysis(mission);
        console.timeEnd(`${mission.id}耗时`);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");
        resolve(true);
      });
    },
    /**
     * @description 基础分析
     * @param { object } mission 任务对象
     * @return { Promise }
     */
    async basicAnalysis(mission) {
      const id = mission.author_id;
      try {
        const [basic_data, xintu_data] = await Promise.all([
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/info?author_id=${id}`
          ), // 达人基础信息
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/getAllStarAuthorScore?author_id=${id}`
          ) // 星图指数
        ]);
        await this.sleep(500);

        const [koubei_data, pinlei_data] = await Promise.all([
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/reputation/charts?author_id=${id}`
          ), // 带货口碑，半年内按月统计达人带货口碑柱状图
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/topProductTags?author_id=${id}`
          ) // 带货品类
        ]);
        await this.sleep(500);

        const [shipin_data, zhibo_data, dianshang_data] = await Promise.all([
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/awemeOverview?author_id=${id}`
          ), // 视频概览
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/liveOverview?author_id=${id}`
          ), // 直播概览
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/businessOverview?author_id=${id}`
          ) // 电商概览
        ]);

        // 入库
        const data = {
          author_id: id,
          basic_data,
          xintu_data,
          koubei_data,
          pinlei_data,
          zhibo_data,
          shipin_data,
          dianshang_data
        };
        return new Promise(async (resolve, reject) => {
          try {
            await ADD_BASIC_DATA(data);
            setTimeout(() => resolve(), 2000);
          } catch (err) {
            console.error("基础分析入库失败", err);
            reject(err);
          }
        });
      } catch (err) {
        console.error("基础分析入库失败：", err);
      }
    },
    /**
     * @description 直播分析
     * @param { object } mission 任务对象
     * @return { Promise }
     */
    async liveAnalysis(mission) {
      const id = mission.author_id;
      try {
        // 避免并发太多请求，以免被检测到，将请求切割
        const data1 = await Promise.all([
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/liveAnalysisV2?author_id=${id}&${days.seven}`
          ), // 直播时长分布，开播时间统计
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/room?author_id=${id}&page=1&size=10&sort=begin_time&order=desc&keyword=&has_warm_aweme=0&is_take_product=0&${days.seven}`
          ) // 直播记录
        ]);
        await this.sleep(500);
        const data2 = await Promise.all([
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/liveAnalysisV2?author_id=${id}&${days.fifteen}`
          ), // 直播时长分布，开播时间统计
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/room?author_id=${id}&page=1&size=10&sort=begin_time&order=desc&keyword=&has_warm_aweme=0&is_take_product=0&${days.fifteen}`
          ) // 直播记录
        ]);
        await this.sleep(500);
        const data3 = await Promise.all([
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/liveAnalysisV2?author_id=${id}&${days.thirty}`
          ), // 直播时长分布，开播时间统计
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/room?author_id=${id}&page=1&size=10&sort=begin_time&order=desc&keyword=&has_warm_aweme=0&is_take_product=0&${days.thirty}`
          ) // 直播记录
        ]);

        const postData = {
          author_id: mission.author_id,
          seven: {
            statistical_data: data1[0],
            record_data: data1[1]
          },
          fifteen: {
            statistical_data: data2[0],
            record_data: data2[1]
          },
          thirty: {
            statistical_data: data3[0],
            record_data: data3[1]
          }
        };
        // 入库
        return new Promise(async (resolve, reject) => {
          try {
            await ADD_LIVE_DATA(postData);
            setTimeout(() => resolve(), 2000);
          } catch (err) {
            console.error("直播分析入库失败", err);
            reject(err);
          }
        });
      } catch (err) {
        console.error("直播分析入库失败：", err);
      }
    },
    /**
     * @description 视频分析
     * @param { object } mission 任务对象
     * @return { Promise }
     */
    async videoAnalysis(mission) {
      const id = mission.author_id;
      try {
        const params = {
          author_id: id,
          goods_relatived: 0,
          has_warm_live: 0,
          sort: "time",
          keyword: "",
          page: 1,
          category: "",
          orderby: "desc",
          page_size: 8,
          filter_delete: 0
        };

        const data1 = await Promise.all([
          // 视频统计、视频时长发布、视频发布时间统计
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/awemeAnalysis?author_id=${id}&${days.seven}`
          ),

          // 点赞数据、评论数据、转发数据图表
          http.get(
            `https://api-service.chanmama.com/v1/home/author/multiDataChart?author_id=${id}&${days.seven}`
          ),

          // Ta的视频
          http.post(
            `https://api-service.chanmama.com/v1/author/detail/awemeList`,
            {
              ...params,
              start_time: getDay(days.seven, 0),
              end_time: getDay(days.seven, 1)
            }
          )
        ]);
        await this.sleep(500);
        const data2 = await Promise.all([
          // 视频统计、视频时长发布、视频发布时间统计
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/awemeAnalysis?author_id=${id}&${days.fifteen}`
          ),

          // 点赞数据、评论数据、转发数据图表
          http.get(
            `https://api-service.chanmama.com/v1/home/author/multiDataChart?author_id=${id}&${days.fifteen}`
          ),

          // Ta的视频
          http.post(
            `https://api-service.chanmama.com/v1/author/detail/awemeList`,
            {
              ...params,
              start_time: getDay(days.fifteen, 0),
              end_time: getDay(days.fifteen, 1)
            }
          )
        ]);
        await this.sleep(500);
        const data3 = await Promise.all([
          // 视频统计、视频时长发布、视频发布时间统计
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/awemeAnalysis?author_id=${id}&${days.thirty}`
          ),

          // 点赞数据、评论数据、转发数据图表
          http.get(
            `https://api-service.chanmama.com/v1/home/author/multiDataChart?author_id=${id}&${days.thirty}`
          ),

          // Ta的视频
          http.post(
            `https://api-service.chanmama.com/v1/author/detail/awemeList`,
            {
              ...params,
              start_time: getDay(days.thirty, 0),
              end_time: getDay(days.thirty, 1)
            }
          )
        ]);
        const postData = {
          author_id: mission.author_id,
          seven: {
            statistical_data: data1[0],
            chart_data: data1[1],
            video_data: data1[2]
          },
          fifteen: {
            statistical_data: data2[0],
            chart_data: data2[1],
            video_data: data2[2]
          },
          thirty: {
            statistical_data: data3[0],
            chart_data: data3[1],
            video_data: data3[2]
          }
        };

        // 入库
        return new Promise(async (resolve, reject) => {
          try {
            await ADD_VIDEO_DATA(postData);
            setTimeout(() => resolve(), 2000);
          } catch (err) {
            console.error("视频分析入库失败", err);
            reject(err);
          }
        });
      } catch (err) {
        console.error("视频分析入库失败：", err);
      }
    },
    /**
     * @description 电商分析
     * @param { object } mission 任务对象
     * @return { Promise }
     */
    async productAnalysis(mission) {
      const id = mission.author_id;
      try {
        const data = await Promise.all([
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/productAnalysis?author_id=${id}&sort=amount&keyword=&page=1&size=50&platform=&product_type=0&price=&brand=&big_category=&first_category=&second_category=&orderby=desc&${days.seven}`
          ),
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/productAnalysis?author_id=${id}&sort=amount&keyword=&page=1&size=50&platform=&product_type=0&price=&brand=&big_category=&first_category=&second_category=&orderby=desc&${days.fifteen}`
          ),
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/productAnalysis?author_id=${id}&sort=amount&keyword=&page=1&size=50&platform=&product_type=0&price=&brand=&big_category=&first_category=&second_category=&orderby=desc&${days.thirty}`
          )
        ]);

        // 入库
        return new Promise(async (resolve, reject) => {
          try {
            await ADD_PRODUCT_DATA({
              author_id: mission.author_id,
              seven: data[0],
              fifteen: data[1],
              thirty: data[2]
            });
            setTimeout(() => resolve(), 2000);
          } catch (err) {
            console.error("电商分析入库失败", err);
            reject(err);
          }
        });
      } catch (err) {
        console.error("电商分析入库失败：", err);
      }
    },
    /**
     * @description 粉丝分析
     * @param { object } mission 任务对象
     * @return { Promise }
     */
    async fansAnalysis(mission) {
      const id = mission.author_id;
      try {
        const data1 = await Promise.all([
          // 粉丝趋势、
          http.get(
            `https://api-service.chanmama.com/v1/home/author/multiDataChart?author_id=${id}&${days.seven}`
          ),

          // 粉丝团趋势
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/fansClubDataChart?author_id=${id}&${days.seven}`
          )
        ]);
        await this.sleep(500);
        const data2 = await Promise.all([
          // 粉丝趋势
          http.get(
            `https://api-service.chanmama.com/v1/home/author/multiDataChart?author_id=${id}&${days.fifteen}`
          ),

          // 粉丝团趋势
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/fansClubDataChart?author_id=${id}&${days.fifteen}`
          )
        ]);
        await this.sleep(500);
        const data3 = await Promise.all([
          // 粉丝趋势
          http.get(
            `https://api-service.chanmama.com/v1/home/author/multiDataChart?author_id=${id}&${days.thirty}`
          ),

          // 粉丝团趋势
          http.get(
            `https://api-service.chanmama.com/v1/author/detail/fansClubDataChart?author_id=${id}&${days.thirty}`
          )
        ]);
        const data4 = await Promise.all([
          // 粉丝性别分布、粉丝地域分布、粉丝年龄分布、粉丝活跃时间分布
          http.get(
            `https://api-service.chanmama.com/v1/author/fansDataAnalyse?author_id=${id}`
          )
        ]);

        // 入库
        return new Promise(async (resolve, reject) => {
          try {
            await ADD_FANS_DATA({
              author_id: mission.author_id,
              seven: {
                trend_data: data1[0],
                ff: data1[1]
              },
              fifteen: {
                trend_data: data2[0],
                ff: data2[1]
              },
              thirty: {
                trend_data: data3[0],
                ff: data3[1]
              },
              fans_data_analyse: data4
            });
            setTimeout(() => resolve(), 2000);
          } catch (err) {
            console.error("粉丝分析入库失败", err);
            reject(err);
          }
        });
      } catch (err) {
        console.error("粉丝分析入库失败：", err);
      }
    },
    /**
     * @description 添加任务
     * @param { object } e 按钮dom对象
     */
    async handleAddMission(e) {
      // 找出达人id
      const td = $(e.target)
        .parent()
        .parent()
        .parent()
        .children()
        .find("a.text-decoration-none");

      // 调接口添加任务
      try {
        const formData = new FormData();
        formData.append(
          "author_id",
          $(td) //达人id
            .attr("href")
            .split("/")
            .reverse()[0]
        );
        const searchText = this.getSearchCondition();
        formData.append("author_name", $(td).text());
        formData.append("seartch_text", searchText);
        await ADD_MISSION(formData);
        $(e.target).remove();
        this.$message.success("任务添加成功");
      } catch (err) {
        if (err === "登录token已失效") {
          this.logout();
        } else {
          console.error("添加任务失败", err);
          this.$message({
            type: "error",
            message: `任务添加失败，失败原因：${err}`
          });
        }
      }
    },
    /**
     * @description 组装搜索条件文本（中文）
     */
    getSearchCondition() {
      let condition = [];
      // 分类
      const activeCategory = $(".category-list .category-item").find(
        ".active"
      )[0];
      const cateArr = [
        $(activeCategory)
          .children(".cursor-pointer")
          .text()
      ]; // 只选中一级分类

      // 选中了二级分类
      const subCate = $(activeCategory)
        .next()
        .find(".children-item.active")[0];
      if (subCate) {
        cateArr.push($(subCate).text());
      }
      condition.push(`分类: ${cateArr.join("-")}`);

      // 筛选条件
      const conditions = $(".condition-box").toArray();
      condition.push(...makeSelectText(conditions, "筛选条件"));

      // 粉丝画像
      condition.push(...makeSelectText(conditions, "粉丝画像", "粉丝"));

      // 高级筛选
      condition.push(
        ...$(".condition-box.flex.align-items-center.mt15.mb15")
          .find(".el-checkbox.is-checked .el-checkbox__label")
          .toArray()
          .map(item => $(item).text())
      );

      // 搜索文本
      condition.push(`关键字: ${$("#e2e-common-search-input").val() || ""}`);

      return condition.join(";");
    },
    async sleep(interval = 2000) {
      return new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
          resolve();
          clearTimeout(timer);
          timer = null;
        }, interval);
      });
    },
    logout() {
      this.$message({
        type: "error",
        message: "登录token已失效，请重新登录！"
      });
      this.$refs.login.logout(false);
      this.isLogin = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
