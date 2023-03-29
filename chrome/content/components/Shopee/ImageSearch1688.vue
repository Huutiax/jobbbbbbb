<template>
  <div>
    <!-- test -->
    <!-- <img :src="pic" alt="" /> -->
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import { sleep } from "@/utils";
import { debounce } from "throttle-debounce";
import { getCurrencyRate } from "@/api/shopee";

export default {
  name: "ImageSearch1688",
  data() {
    return {
      price: 0,
      isProcessing: false,
      rateList: {}
    };
  },
  mounted() {
    // 1. 拉马来汇率
    // 2. 价格区间段的，按最低价来算料本率
    // 3. shopee商品列表增加1688页面跳转 https://shopee.com.my/search?category=11000587&keyword=tv%20box
    // 4. 跳转的时候把 商品的图片链接 和 最低价格 带过去
    // 5 1688搜索页，按图搜索，显示料本率，增加按钮爬取1688商品信息
    // https://s.1688.com/youyuan/index.htm?tab=imageSearch&imageAddress=O1CN01DmhKdr1yjGGrH1XUk_!!14446614-0-1688search.jpeg&spm=a26352.13672862.searchbox.input

    if (
      location.href.includes("https://shopee.com.my/search") ||
      location.href.includes("https://shopee.co.th/search")
    ) {
      // shopee列表
      setTimeout(() => this.formatList(), 5000);
      this.initShopeeList();
    } else if (
      location.href.includes("https://s.1688.com/youyuan/index.htm") &&
      location.href.includes("tab=imageSearch")
    ) {
      // 1688图片搜索
      const searchs = location.search.split("&");
      const imgStr = searchs.find(v => v.includes("imgUrl"));
      if (imgStr) {
        const imgUrl = imgStr.substring(7);
        this.searchByImg(imgUrl);
      }
      const priceStr = searchs.find(v => v.includes("price"));
      console.log("price", priceStr);
      if (priceStr) {
        this.price = priceStr.substring(6);
        this.show1688Info();
        // 监听子元素插入事件
        $("#sm-offer-list").bind(
          "DOMNodeInserted",
          debounce(1000, true, e => {
            // 处理中，不操作
            if (this.isProcessing) {
              return;
            }
            // console.log("dom 变化了");
            console.log(e);
            // 合并执行事件
            this.show1688Info();
          })
        );
      }
    }

    // const url =
    //   "https://stream-upload.taobao.com/api/upload.api?appkey=1688search&folderId=0&_input_charset=utf-8&useGtrSessionFilter=false&_bx-v=1.1.20";
  },
  methods: {
    /**
     * @description shopee商品列表初始一些功能
     * 1. 增加按钮，跳转到1688图片搜索页面，带上当前商品图链接和最低价格（汇率转换）
     */
    initShopeeList() {
      chrome.extension.onRequest.addListener(async request => {
        console.log(request.apiStatus);
        if (request.apiStatus === "completed") {
          await sleep(1000);
          this.formatList();
        }
      });
    },
    /**
     * @description 列表内显示1688跳转链接
     * 注意：由于整个列表采用的是懒加载形式，无法构造视口以下的产品数据
     * 解决方法1：监听元素出现在视口的事件 https://blog.csdn.net/weixin_43837268/article/details/91347372
     * 解决方法2：重新调用一次接口，从接口内拿到数据，匹配itemId形式去渲染
     */
    async formatList() {
      const list = $(
        ".shopee-search-item-result__items .shopee-search-item-result__item"
      ).toArray();
      // 获取汇率
      const rateList = await getCurrencyRate();
      console.log("汇率", rateList);
      let currentRate = 1;
      if (location.host.includes(".my")) {
        // 马来
        currentRate = Number(rateList.MYR);
      } else if (location.host.includes(".th")) {
        currentRate = Number(rateList.THB);
      }
      // 解决方法1：监听视窗
      var io = new IntersectionObserver(entries => {
        // entries：进入视窗的元素集
        // 移除监听
        entries.forEach(entry => {
          // 可视状态
          // console.log(entry.target);
          const item = $(entry.target);
          io.unobserve(entry.target);
          if ($(item).find(".search-button-1688").length > 0) {
            return;
          }
          // style="position: absolute;bottom:5px;left: 10px;z-index: 10; padding: 3px 5px"
          // $(item).find('a[data-sqe="link"] > div >div:last-child')
          $(item).append(`
              <div class="search-button-1688">
                <span class="el-button el-button--text 1688-btn" target="_blank">1688搜索</span>
              </div>
            `);
        });
        // 1688搜索按钮添加点击事件
        $(".1688-btn").on("click", e => {
          const item = $(e.target)
            .parent()
            .parent();

          const priceItem = $(item)
            .find("._3c5u7X")
            .toArray()[0];
          // 对于 12,345这种类型的价格，需要去除,
          const lowPrice = (
            $(priceItem)
              .text()
              .replace(/,/g, "") * currentRate
          ).toFixed(2);
          const imgUrl = $(item)
            .find("._2GchKS")
            .attr("src");
          const href = `https://s.1688.com/youyuan/index.htm?tab=imageSearch&price=${lowPrice}&imgUrl=${imgUrl}`;
          console.log(lowPrice, imgUrl, href, 1);
          window.open(href, "_blank");
        });
      });
      list.forEach(item => {
        io.observe(item);
      });
    },
    /**
     * @description 将shopee传过来的图片链接下载并上传到1688，并构造图片查询链接
     * @param {string} imgUrl
     */
    searchByImg(imgUrl) {
      axios.get(imgUrl, { responseType: "blob" }).then(res => {
        console.log(324324, res);
        let reader = new FileReader();
        // reader.onload = e => {
        //   console.log(e, e.target);
        //   this.pic = e.target.result;
        //   // console.log(this.pic);
        // };
        reader.readAsDataURL(res.data);
        const formData = new FormData();
        formData.append("name", imgUrl.split("/").reverse()[0]);
        formData.append("file", res.data);
        axios.defaults.withCredentials = true;
        axios
          .post(
            "https://stream-upload.taobao.com/api/upload.api?appkey=1688search&folderId=0&_input_charset=utf-8&useGtrSessionFilter=false&_bx-v=1.1.20",
            formData
          )
          .then(res => {
            console.log(res);
            // 登录失效
            if (
              res.data.url &&
              res.data.url.includes("https://login.taobao.com/member")
            ) {
              // 提示重新登录
              return this.$notify({
                type: "info",
                title: "1688登录失效",
                message: "1688登录状态已失效，插件无法使用，请重新登录1688！",
                duration: 0,
                position: "top-right"
              });
            }
            const fileObj = res.data.object;
            const imgName = fileObj.url.split("/").reverse()[0];
            const href = `https://s.1688.com/youyuan/index.htm?tab=imageSearch&price=${this.price}&imageAddress=${imgName}&spm=a26352.13672862.searchbox.input&isDone=true`;
            location.replace(href);
          })
          .catch(err => console.error(err));
      });
    },
    /**
     * @description 构建料本率显示 + 新建商品开发按钮
     * 料本率 = 1688最低采购价 / shopee最低售价
     * 注意：由于1688搜索列表没有采取分页器的形式分页，而是使用滚动到最底部加载下一页
     * 并且会重刷整个商品列表，原来向页面添加的内容会被抹掉；
     * 所以，
     * 方案一：需要通过监听接口的形式去重新添加信息
     * 方案二：通过监听视口的形式
     */
    async show1688Info() {
      this.isProcessing = true;
      await sleep(2000);
      const list = $("#sm-offer-list .space-offer-card-box").toArray();

      list.forEach(item => {
        if ($(item).find(".custom-item").length > 0) {
          return;
        }
        const price = $(item)
          .find(".mojar-element-price .price")
          .text();
        // 在销量后插入新行，显示料本率和按钮
        $(item).find(".sale").after(`
          <div class="custom-item" style="display: flex; justify-content: space-between; padding:0 10px;margin-top: 10px;">
            <span class="el-button el-button--text" style=" font-size: 14px;">料本率：${(
              (price / this.price) *
              100
            ).toFixed(2)}%</span>
            
          </div>
        `);
        // <span class="el-button el-button--text" style="font-size: 14px; padding: 0;">+开发新品</span>
      });

      this.isProcessing = false;
    }
  }
};
</script>

<style lang="scss">
.shopee-search-item-result__items .shopee-search-item-result__item {
  // > a > div > div:last-child {
  //   position: relative;
  // }
  .search-button-1688 {
    position: absolute;
    // bottom: 28px;
    left: 30%;
    top: 0;
    z-index: 10;
    // left: 50%;
    // transform: translateX(-50%);
    margin-top: 0 !important;
  }
}
</style>
