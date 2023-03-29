<template>
  <RightPanel height="200px" width="200px">
    <el-button type="primary" @click="reCrawl" :loading="isExecuting"
      >手动触发一次</el-button
    >
    <el-button type="warning" @click="crawlLiveRoomMission"
      >爬取直播间列表</el-button
    >
  </RightPanel>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import moment from "moment";
// import ajaxListener from "@/utils/ajax-listener";
// import LeftPanel from "@/components/LeftPanel";
import {
  FETCH_USER_INFO,
  FETCH_ORDER_LIST,
  UPLOAD_ORDER_LIST,
  FETCH_LIVE_ROOM_LIST,
  UPLOAD_LIVE_ROOM_LIST_DATA,
  FETCH_LIVE_ROOM_PRODUCT_DATA,
  UPLOAD_LIVE_ROOM_PRODUCT_DATA,
  FETCH_LIVE_ROOM_DASHBOARD_DATA,
  UPLOAD_LIVE_ROOM_DASHBOARD_DATA
} from "@/api/tiktok";
import { sleep } from "@/utils";

const ITEM_INTERVAL = 10000; // 接口时间间隔
const MISSION_INTERVAL = 240 * 60 * 1000; // 任务运行间隔时间
const LIVE_ROOM_LIST_SIZE = 14; // 爬取近14场直播数据
const ORDER_DAY_INTERVAL = 74; // 订单查询间隔天数
const ORDER_PAGE_SIZE = 100; // 每页订单数量
const TASK_EXECUTE_HOURS = [0, 12];

// ajaxListener();

const getFormData = (data, name = "rawData") => {
  const formData = new FormData();
  formData.append(name, JSON.stringify(data));
  return formData;
};

export default {
  name: "TiktokOrder",
  components: {
    RightPanel
  },
  data() {
    return {
      taskTimer: null,
      timer: null,
      count: 0,
      userId: undefined,
      authorAppId: undefined,
      isExecuting: false
    };
  },
  async mounted() {
    try {
      const userInfo = await FETCH_USER_INFO();
      this.authorAppId = userInfo.user_app;
      this.userId = userInfo.origin_uid;
      console.log(
        `========================================\n
        巨量百应拉单插件\n
        用户id: ${this.userId}\n
        App id: ${this.authorAppId}
        \n=========================================`
      );
      this.executeTask();
    } catch (err) {
      console.error(err);
    }
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    /**
     * @description 手动触发
     */
    reCrawl() {
      if (this.isExecuting) {
        return this.$message.warning("任务已在进行中，不能手动触发！");
      }
      // 终止任务轮询
      this.clearTimer();
      this.init();
      console.log(">>>>>>>>>>> 手动触发 >>>>>>>>>>>");
    },
    /**
     * @description 定时任务，每隔5分钟查一下当前时间
     * 每天0点执行一次
     * 每天12点执行一次
     */
    executeTask() {
      this.taskTimer = setInterval(() => {
        const hour = Number(new Date().getHours());
        if (TASK_EXECUTE_HOURS.includes(hour)) {
          this.init();
          this.clearTimer();
        }
      }, 5 * 60 * 1000);
    },
    clearTimer() {
      clearInterval(this.taskTimer);
      this.taskTimer = null;
    },
    async init() {
      this.isExecuting = true;
      console.log(
        `>>>>>>>> 第${++this.count}次任务开始执行，开始时间：${moment().format(
          "YYYY-MM-DD hh:mm:ss"
        )} >>>>>>>>`
      );
      try {
        console.time("执行时间");
        await this.crawlLiveRoomMission(); // 直播数据
        // 支付订单和结算订单分开爬，因为偶尔会有被封请求的问题
        await this.crawlOrderMisson(); // 支付订单
        await sleep(5 * 60 * 1000); // 5分钟后再次爬取
        // await this.crawlOrderMisson(3); // 结算订单
        console.timeEnd("执行时间");
        console.log(
          `>>>>>>>> 第${this.count}次执行完毕，结束时间：${moment().format(
            "YYYY-MM-DD hh:mm:ss"
          )} >>>>>>>>\n`
        );

        console.log(">>>>>>>> 空闲中 >>>>>>>>\n\n\n");
        // 等待1小时再执行任务，防止任务执行过快而多次执行
        await sleep(60 * 60 * 1000);
        this.executeTask();
      } catch (err) {
        console.log(
          `>>>>>>>> 第${this.count}次任务执行失败，失败时间：${moment().format(
            "YYYY-MM-DD hh:mm:ss"
          )} >>>>>>>>`
        );
        console.log(`------- 5小时后，重新执行任务 -------`);
        await sleep(5 * 60 * 60 * 1000);
        this.init();
      }
      this.isExecuting = false;
      // this.timer = setTimeout(() => {
      //   this.init();
      //   clearTimeout(this.timer);
      //   this.timer = null;
      // }, MISSION_INTERVAL);
    },
    /**
     * @description 爬取订单列表
     * 由于接口形式已被反扒，需要破解signature签名，所以更换成触发按钮点击的形式
     */
    async crawlOrderMisson(timeType = 1) {
      const now = moment();
      const end_time = parseInt(moment(now).valueOf() / 1000);
      const start_time = parseInt(
        moment(now)
          .subtract(ORDER_DAY_INTERVAL, "days")
          .valueOf() / 1000
      ); // 当前时间往前推75天
      const params = {
        author_app_id: this.authorAppId,
        user_id: this.userId,
        start_time,
        end_time,
        page: 0,
        pageSize: 10,
        time_type: timeType
      };

      try {
        // 获取总条数
        const { total } = await FETCH_ORDER_LIST(params);
        await this.crawlOrder(total, { ...params, pageSize: ORDER_PAGE_SIZE });
        console.log(
          `>>>>>>> 爬取${timeType === 1 ? "支付" : "结算"}订单列表成功 >>>>>>>`
        );
        return Promise.resolve();
      } catch (err) {
        console.log(
          `>>>>>>> 爬取${timeType === 1 ? "支付" : "结算"}订单列表失败 >>>>>>>`
        );
        console.error("失败原因: ", err);
        return Promise.reject(err);
      }
    },
    async crawlOrder(total, params) {
      try {
        params.page++;
        // 获取订单列表
        const data = await FETCH_ORDER_LIST(params);
        if (!data || !data.data) {
          return Promise.resolve();
        }
        // 入库
        await UPLOAD_ORDER_LIST(getFormData(data.data), this.userId);
        if (total <= params.pageSize + params.pageSize * (params.page - 1)) {
          return Promise.resolve();
        }
        await sleep(Math.max(15, Math.round(Math.random() * 40)) * 1000);
        await this.crawlOrder(total, params);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    /**
     * @description 爬取直播间数据任务
     */
    async crawlLiveRoomMission() {
      // 获取直播间列表
      try {
        const data = await FETCH_LIVE_ROOM_LIST({
          size: LIVE_ROOM_LIST_SIZE,
          page: 0
        });
        await UPLOAD_LIVE_ROOM_LIST_DATA(
          getFormData({ data, userId: this.userId }), // 这里加userId，查bug用
          this.userId
        );
        const rooms = (data || {}).rooms || [];
        await sleep(2000);
        await this.crawlDetails(rooms);
        console.log(`>>>>>>> 爬取直播间列表数据完成！ >>>>>>>`);
      } catch (err) {
        console.log(`>>>>>>> 爬取直播间列表数据失败！ >>>>>>>`);
        console.error("失败原因：", err);
      } finally {
        Promise.resolve();
      }
    },
    /**
     * @description 爬取直播间详情数据
     * 1. 爬取看板数据
     * 2. 爬取商品列表
     * @param { Array } rooms 直播间列表
     * @return { Promise }
     */
    async crawlDetails(rooms) {
      if (rooms.length === 0) {
        return Promise.resolve();
      }

      const room = rooms.splice(0, 1)[0];
      try {
        // 获取详情看板数据和商品列表数据
        const id = room.room_id;
        const [data1, data2] = await Promise.all([
          FETCH_LIVE_ROOM_DASHBOARD_DATA(id),
          FETCH_LIVE_ROOM_PRODUCT_DATA(id)
        ]);
        // 入库
        await Promise.all([
          UPLOAD_LIVE_ROOM_DASHBOARD_DATA(
            getFormData({
              data: { ...data1, room_id: id, userId: this.userId }
            }),
            this.userId
          ),
          UPLOAD_LIVE_ROOM_PRODUCT_DATA(
            getFormData({
              data: data2.products,
              room_id: id,
              userId: this.userId
            }),
            this.userId
          )
        ]);
        await sleep(ITEM_INTERVAL);
        await this.crawlDetails(rooms);
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
