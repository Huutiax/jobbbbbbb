<template>
  <LeftPanel height="480px" className="job51">
    <div class="wrapper">
      <h3>
        <span>我的收藏</span>
        <!-- <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon="el-icon-info"
          icon-color="red"
          title="确定要清空收藏内容吗？"
          popper-class="custom-confirm-popover"
          @confirm="clearLikes"
        >
          <el-button
            type="text"
            icon="el-icon-delete"
            slot="reference"
          ></el-button>
        </el-popconfirm> -->
      </h3>
      <div>
        <template v-if="likeList.length > 0">
          <el-tag
            type="primary"
            size="small"
            v-for="(item, i) in likeList"
            :key="i"
            closable
            @click="handleTagClick(item)"
            @close="deleteLikeItem(item, i)"
          >
            {{ item }}
          </el-tag>
        </template>
        <Empty v-else empty-text="暂无收藏记录哦~"></Empty>
      </div>
    </div>
    <div class="wrapper">
      <h3>
        <span>搜索历史</span>
        <!-- <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon="el-icon-info"
          icon-color="red"
          title="确定要清空搜索历史吗？"
          popper-class="custom-confirm-popover"
          @confirm="clearHistories"
        >
          <el-button
            type="text"
            icon="el-icon-delete"
            slot="reference"
          ></el-button>
        </el-popconfirm> -->
      </h3>
      <div>
        <template v-if="historyList.length > 0">
          <el-tag
            type="info"
            size="small"
            v-for="(item, i) in historyList"
            :key="i"
            closable
            @click="handleTagClick(item)"
            @close="deleteHistoryItem(item, i)"
          >
            <span>
              <i class="el-icon-plus" @click.stop="addLikeItem(item)"></i>
              {{ item }}
            </span>
          </el-tag>
        </template>
        <Empty
          v-else
          empty-text="暂无搜索历史记录哦~"
          style="padding: 10px 0"
        ></Empty>
      </div>
    </div>
  </LeftPanel>
</template>

<script>
import LeftPanel from "@/components/LeftPanel";
import Empty from "@/components/Empty";

export default {
  name: "Job51",
  components: {
    LeftPanel,
    Empty
  },
  data() {
    return {
      historyList: [],
      likeList: [],
      companyDom: null
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    // 缓存公司搜索输入框
    this.companyDom = document.getElementById("search_company_txt");

    // 关键逻辑，监听搜索方法调用
    // 此页面调用搜索的逻辑为：调用$('#btnSearch_submit')[0]元素的click方法
    // 搜索按钮也是通过直接调用此元素的方法，故监听该元素点击事件就可以完全覆盖按钮点击、键盘enter事件
    document
      .querySelectorAll("#btnSearch_submit")[0]
      .addEventListener("click", this.handleSearch);
  },
  methods: {
    /**
     * @description 处理搜索历史/我的收藏项点击，赋值到公司输入框内
     * @param { string } item
     */
    handleTagClick(item) {
      this.companyDom.value = item;
    },
    /**
     * @description 监听搜索触发的逻辑，保存搜索历史
     */
    handleSearch() {
      let value = this.companyDom.value;
      value = value.trim();
      //  || this.historyList.includes(value)
      if (!value) {
        return;
      }
      this.historyList.unshift(value);
      // 只保留10条
      if (this.historyList.length > 10) {
        this.historyList.pop();
      }
      this.saveData();
    },
    /**
     * @description 删除单个搜索历史项
     * @param { string } item
     * @param { number } index
     */
    deleteHistoryItem(item, index) {
      this.historyList.splice(index, 1);
      this.saveData();
    },
    /**
     * @description 清空所有搜索记录
     */
    clearHistories() {
      this.historyList = [];
      this.saveData();
    },
    /**
     * @description 删除单个收藏项
     * @param { string } item
     * @param { number } index
     */
    deleteLikeItem(item, index) {
      this.likeList.splice(index, 1);
      this.saveData();
    },
    /**
     * @description 清空收藏项
     */
    clearLikes() {
      this.likeList = [];
      this.saveData();
    },
    /**
     * @description 将单个历史记录项添加到收藏项，移除该历史记录项
     * @param { string } item
     */
    addLikeItem(item) {
      const index = this.likeList.findIndex(v => v === item);
      // 如果收藏内存在该历史记录，则把该条置顶
      if (index > -1) {
        this.likeList.splice(index, 1);
        this.likeList.unshift(item);
      } else {
        this.likeList.unshift(item);
        // 限制100条
        if (this.likeList.length > 100) {
          this.likeList.pop();
        }
      }
      this.deleteHistoryItem(item);
    },
    /**
     * @description 获取缓存的历史记录和收藏项
     */
    getData() {
      localStorage.job51SearchHistoryList &&
        (this.historyList = JSON.parse(localStorage.job51SearchHistoryList));
      localStorage.job51SearchLikeList &&
        (this.likeList = JSON.parse(localStorage.job51SearchLikeList));
    },
    /**
     * @description 将历史记录和收藏项存到本地缓存
     */
    saveData() {
      localStorage.job51SearchHistoryList = JSON.stringify(
        this.historyList.slice(0, 10)
      ); // 只保留10条
      localStorage.job51SearchLikeList = JSON.stringify(
        this.likeList.slice(0, 100)
      ); // 限制100条
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.job51 {
  padding: 15px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;

  .wrapper {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &:first-child {
      margin-bottom: 10px;
      flex: 1;
    }
    &:last-child {
      flex: 1;
      height: 120px;
    }

    > h3 {
      flex-shrink: 0;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .el-icon-delete {
        font-size: 14px;
      }
    }
    > div {
      flex: 1;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #dcdfe6; // #c9cdd4;
        outline: none;
        // border-radius: 3px;
      }
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: none;
        box-shadow: none;
        // border-radius: 3px;
      }
    }

    .el-tag {
      margin: 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        cursor: pointer;
        background-color: #409eff;
        border-color: #409eff;
        color: #fff;

        .el-tag__close {
          background-color: #fff;
          color: #409eff;
        }
      }

      &.el-tag--info {
        &:hover {
          background-color: #909399;
          border-color: #909399;
          color: #fff;

          .el-tag__close {
            background-color: #fff;
            color: #909399;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.custom-confirm-popover {
  z-index: 99999 !important;
}
</style>
