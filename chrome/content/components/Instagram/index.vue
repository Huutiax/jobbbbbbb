<template>
  <div>
    <el-button @click="getPosterInfo">getPosterInfo</el-button>
    <el-button @click="getUserAccountInfo('ameliezilber')"
      >getUserAccountInfoByUid</el-button
    >
    <el-button @click="doMission">init</el-button>
    <el-button @click="pollMission">pollMission</el-button>
  </div>
</template>

<script>
import $ from "jquery";
import { sleep, randomTime } from "@/utils";

const formatPostList = data => {
  return data
    .map(item => item.node)
    .map(item => {
      return {
        like_count: item.edge_media_preview_like.count, // 帖子点赞数  Number of like of the post
        comment_count: item.edge_media_to_comment.count, // 帖子评论数 Number of comments of the post
        shortcode: item.shortcode,
        link: `https://www.instagram.com/p/${item.shortcode}`, // 帖子链接 Link of the post
        location: (item.location || {}).name, // 帖子发布地点 Location of the post
        relatived_users: item.edge_media_to_tagged_user.edges.map(
          item => item.node.user
        ) // 关联的用户，帖子@到的用户或者tag到的用户信息列表，见下面的接口
      };
    });
};
const GET_MISSIONS = async () => {
  return Promise.resolve({
    list: [
      {
        id: 1,
        accountName: "alo"
      },
      {
        id: 2,
        accountName: "kiana700"
      }
    ]
  });
};

const EDIT_MISSION = async () => {
  return Promise.resolve(true);
};

export default {
  name: "Instagram",
  data() {
    return {
      count: 1,
      posterInfo: null,
      nextPageInfo: {} // 存储列表下一个信息，包括是否有下一页和下一个的hash值, {has_next_page, end_cursor}
    };
  },
  mounted() {
    // this.getPosterInfo();
    // this.getUserAccountInfoByUid("233224164");
    // this.getPosts();
    // this.getUserAccountInfo("narcitytoronto");
  },
  methods: {
    /**
     * @description 任务轮询
     * @param { number } interval 轮询间隔时间
     */
    pollMission(interval = 5000) {
      this.timer = setTimeout(async () => {
        try {
          const data = await GET_MISSIONS();
          const missions = data.list || [];
          console.log("missions", missions);
          if (missions.length === 0) {
            return;
          }
          // const mission = missions.shift();
          await this.executeMission(missions);
          console.log("完成列表任务");
          clearTimeout(this.timer);
          this.timer = null;
          // 执行任务
        } catch (err) {
          console.error(err);
        } finally {
          // this.pollMission();
        }
      }, interval);
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
        await this.doMission(mission);
        // 修改任务状态为完成
        await EDIT_MISSION({ id: mission.id, type: 2 });

        // 重置用户信息
        this.count = 1;
        this.posterInfo = null;

        // 随机延迟x秒继续执行任务
        await sleep(5000);
        await this.executeMission(missions);
      } catch (err) {
        console.error(err);
        // 修改任务状态为失败
        await EDIT_MISSION({ id: mission.id, type: -1 });
      }
      // 完成后继续轮询
      // this.pollMission();
    },
    async doMission(mission) {
      console.log("正在执行任务: ", JSON.stringify(mission));
      console.log(`正在爬取第${this.count++}页`);
      let rawData;
      // 没有博主信息时，需要通过其主页取拿用户数据
      if (!this.posterInfo) {
        console.time(`爬取${mission.accountName}`);
        const data = await this.getUserAccountInfo(mission.accountName);
        this.posterInfo = data.uploadUserInfo;
        rawData = data.rawData;
        // 初始化第一页的nextPageInfo信息
        this.nextPageInfo = rawData.edge_owner_to_timeline_media.page_info;
        console.log("博主信息：", this.posterInfo);
      }

      // console.log("格式化后的帖子列表：", firstPostList);
      try {
        const isDone = await this.getPosts("posts", rawData);

        if (isDone) {
          console.log(
            `======== 爬取博主（${this.posterInfo.account_name}）完成 ========`
          );
        } else {
          await sleep(randomTime(20, 40));
          // await this.getPosts();
          await this.doMission(mission);
        }
        // if ()
      } catch (err) {
        console.error(err);
      }
      console.timeEnd(`爬取${mission.accountName}`);
    },
    /**
     * @description 获取博主信息
     */
    getPosterInfo(html5) {
      let scripts = [];
      // 由于content script和原页面作用域隔离
      // window对象访问的是当前content script的
      // 所以采用这种hack方法来初始化初始数据

      if (html5) {
        scripts = $(html5)
          .find("script")
          .toArray();
      } else {
        scripts = $("script").toArray();
      }
      const initialDataScript = scripts.find(item =>
        $(item)
          .text()
          .includes("window._sharedData =")
      );
      eval(
        $(initialDataScript)
          .text()
          .trim()
      );

      const initialData = JSON.parse(JSON.stringify(window._sharedData)); // 初始化信息
      const posterInfo = initialData.entry_data.ProfilePage[0].graphql.user; // 博主信息

      // 上传到后台的博主数据
      const uploadUserInfo = {
        id: posterInfo.id, // 用户id（ins内部）
        // biography: posterInfo.biography, // 博主所在地 Location of the post？？？
        account_name: posterInfo.username, // 博主名称 Account name
        link: `https://www.instagram.com/${posterInfo.username}/`, // 账号链接 Link of the account
        post_count: posterInfo.edge_owner_to_timeline_media.count, // 帖子数量 Number of post of the account
        follower_count: posterInfo.edge_followed_by.count // 粉丝数量 Number offollowers of the account
      };
      return {
        rawData: posterInfo,
        uploadUserInfo
      };
    },
    /**
     * @description 根据用户名获取用户信息
     * @param {String} shortcode 用户短链代码或者用户名
     * @example https://www.instagram.com/kiana700/ shortcode为kiana700
     */
    async getUserAccountInfo(shortcode) {
      try {
        const data = await $.get(`https://www.instagram.com/${shortcode}/`);
        const html5 = document.createElement("div");
        html5.innerHTML = data;
        return this.getPosterInfo(html5);
      } catch (err) {
        console.error(err);
      }
    },
    /**
     * @description 根据用户id获取用户信息
     * @param {string} uid 用户id
     * @example https://i.instagram.com/api/v1/users/263372242/info/
     * @notice 注意：接口形式请求会报429，暂时不知道原因，请改用根据用户名获取用户信息
     */
    getUserAccountInfoByUid(uid) {
      $.get(`https://i.instagram.com/api/v1/users/${uid}/info/`).then(data => {
        console.log("用户信息：", data);
      });
      $.get(
        `https://i.instagram.com/api/v1/friendships/show/${uid}/`
      ).then(data => console.log("好友信息：", data));
    },
    /**
     * @description 获取博文列表
     * @param { string } type posts/tagged
     * @param {Array} firstPageList 首页数据
     */
    async getPosts(type = "posts", firstPageObj) {
      // 分析posts和tagged tab切换时接口传参获得
      const queryHash =
        type === "posts"
          ? "8c2a529969ee035a5063f2fc8602a0fd"
          : "be13233562af2d229b008d2976b998b5";
      let list;
      try {
        if (firstPageObj) {
          list = await this.makeRelativedInfo(
            firstPageObj.edge_owner_to_timeline_media.edges
          );
        } else {
          const res = await $.get("https://www.instagram.com/graphql/query/", {
            query_hash: queryHash, // 每一个博主的hash都不一样，需要再分析从何处取
            variables: JSON.stringify({
              id: this.posterInfo.id, // 博主id
              first: 12, // 每页条数，instagram默认12
              after: this.nextPageInfo.end_cursor // 下一个必填参数
            })
          });
          this.nextPageInfo =
            res.data.user.edge_owner_to_timeline_media.page_info;
          list = await this.makeRelativedInfo(
            res.data.user.edge_owner_to_timeline_media.edges
          );
        }
        // 上传博文列表
        await this.uploadPosts(type, list);
      } catch (err) {
        console.error(err);
      }

      return !this.nextPageInfo.has_next_page;
    },
    /**
     * @description 上传博文列表到后台
     * @param {String} type post/tagged
     * @param {Array} list 上传的列表
     */
    async uploadPosts(type, list) {
      console.log(`上传类型：${type}，上传数据：`);
      console.log(list);
      await sleep(1 * 1000);
      return true;
      try {
        await $.post("/", {
          posterInfo: this.posterInfo,
          postList: list
        });
      } catch (err) {
        console.error(err);
        throw new Error(err);
      }
    },
    /**
     * @description 构造关联用户信息列表
     * @param {Array} data 文章列表
     */
    async makeRelativedInfo(data) {
      const list = formatPostList(data);
      for (let i = 0; i < list.length; i++) {
        // 如果有关联用户，则构造数据
        if (list[i].relatived_users.length > 0) {
          // 并发多个查询用户请求
          const uInfo = await Promise.all(
            list[i].relatived_users
              .map(v => v.username)
              .map(v => this.getUserAccountInfo(v))
          );
          list[i].relatived_users = uInfo.map(v => v.uploadUserInfo);
          // 随机等待5-15秒，防止instagram检测
          await sleep(randomTime(5, 15));
        }
      }
      return list;
    },
    /**
     * @description posts上传处理
     * @param {Array} list 格式化后的帖子列表
     */
    /**
     * @description 获取单个博文评论列表
     */
    async getCommentsByPost(postInfo = {}) {
      $.get("https://www.instagram.com/graphql/query/", {
        query_hash: "2efa04f61586458cef44441f474eee7c",
        variables: JSON.stringify({
          shortcode: postInfo.shortcode,
          child_comment_count: 3,
          fetch_comment_count: 40,
          parent_comment_count: 24,
          has_threaded_comments: true
        })
      }).then(data => {
        console.log("评论数据", data); // 评论字段分析
        // 评论列表
        const list = data.edge_media_to_parent_comment.edges;
        // 筛选出被@的列表
        // 被@的判断逻辑：的posts的文本里@了的account的数据
        const quote_by_list = data.edge_media_to_caption.edges.filter(
          item => item.node.text
        );
        // 被@ 作者名称列表，只能拿到名称
        const quoteAccountList = [];
        quote_by_list.forEach(item => {
          const accounts = item.split(" ").filter(v => v.includes("@"));
          quoteAccountList.push(...accounts);
        });
        // 再通过名称列表去爬用户的信息
        // 爬完用户的信息再聚合到博文列表 quote_by_account_list 字段
      });
    }
  }
};
</script>

<style scoped></style>
