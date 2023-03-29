<template>
  <div></div>
</template>

<script>
import $ from "jquery";
import utils from "./utils";

export default {
  name: "ListPage",
  data() {
    return {
      keyword: "", // 搜索关键词
      href: location.href,
      list: [], // 搜索商品列表
      list2: [] // 查看更多商品时的列表
    };
  },
  mounted() {
    this.keyword = $(".gh-tb.ui-autocomplete-input").val();
    this.init();
  },
  methods: {
    /**
     * @create 2020/12/26 15:20
     * @desc 插件，功能如下描述，每个功能对应一个方法，如：功能1 => func1，功能2 => func2 ...
     * 功能1：列表显示下标，详见../img/F5BA54A6-A4B5-4D2B-9AE6-19EB2E300B9B.png
     * 示例地址：https://www.ebay.com.au/sch/i.html?_from=R40&_sacat=0&_oac=1&_clu=2&_fcid=15&_localstpos=&_stpos=&gbr=1&_nkw=Car%20Air%20Compressor&rt=nc&LH_BIN=1
     *
     * 功能2：列表显示关键字，点击关键字跳转链接，点击设置的费率跳转等，详见../img/F5BA54A6-A4B5-4D2B-9AE6-19EB2E300B9B.png
     * 示例地址：https://www.ebay.com.au/sch/i.html?_from=R40&_sacat=0&_oac=1&_clu=2&_fcid=15&_localstpos=&_stpos=&gbr=1&_nkw=Car%20Air%20Compressor&rt=nc&LH_BIN=1
     *
     * 功能3： 商品详情页分类名称后加id显示，点击跳转到erp对应页，详见../img/2209AB27-40FD-44EE-A469-F587817A983D.png
     * 示例地址：https://www.ebay.com.au/itm/Ultra-Clear-Shockproof-Bumper-Case-Cover-for-iPhone-12-mini-11-Pro-MAX-XS-XR/401456409894
     *
     * 功能4： 购买历史页在item id后显示关键字，点击关键字跳转，详见../img/A84E5A2C-5DBF-4A44-899C-A29FEB21F3C9.png ../img/482369DC-79FB-4EE9-8308-AD561E3F587F.png
     * 示例地址：
     * 情景1：https://offer.ebay.com.au/ws/eBayISAPI.dll?ViewBidsLogin&item=401456409894&rt=nc&_trksid=p2047675.l2564
     * 情景2：https://offer.ebay.com.au/ws/eBayISAPI.dll?ViewBidsLogin&_trksid=p2047675.l2564&rt=nc&item=293903507916&ViewBidsLogin=&__HPAB_token_text__=393143&__HPAB_token_string__=N8Cs%2FS4AAAA%3D
     *
     * 功能5：
     * 功能6：
     * 上述功能重复功能1和功能2，在查看更多items列表页内展示
     * 图片：../img/382DFA5E-205E-4a96-A055-8AF1DBAEB243.png
     * 示例地址：https://www.ebay.com.au/sch/m.html?item=264916568624&hash=item3dae420a30%3Ag%3A1kAAAOSwwO9fmmEM&amdata=enc%3AAQAFAAACcBaobrjLl8XobRIiIML1V4Imu%252Fn%252BzU5L90Z278x5ickkXKoKcbeZcOrOku%252BoOBl%252BSzuXYgcIaJgOmnH7%252BEVqLk2YVY%252BQv4N6UQiIW%252B6LAR9ZcTWaJX0CY3BOad8RphAPoK%252FDfMlnxrKm0boT1z29aFsbHsfPClWgB%252BNL8v5Cz38OSMQcpGMXGNc9RGuieO0J0oRLow0vPz60ymO0KwmCL1OqCvZYdNGLAf1ZGwY2EcDcLVynZVTzP8dU3rFi1m5XDfQ%252BznoN3Cp%252B6%252BXePWXsU2HCFvSAjP5lsAaYUa%252FUT2bX0p7jbmFBdXc9ebJmmoBixsxQyD6cck2KM74BCE5BH8%252FOY76M2GLCTNJvYVuefBwJRfo42YXnQKjqq3tRJuDziu45D%252BwciKxryhmS4Wr%252BPJLe55q%252FZQqb8mhlbzLoU8jnmQiqdgeu9vXn2PnKwmDS5%252BlukeGqs%252FSaxOHqP734bJn8RVkRXRQVrtrN7KTiZhlxC7bReP8CqDZjottjqTn3sv%252F8qIsQHwSUDXB%252F15dY3pzXJeNxv1%252FEudqKiA80651ETUY5jcAm%252FYL9Qihvov%252FFfgCvQaW6xCwcpzXeIfRVUdZ57ArNwm5ccPeBjfs%252FlVfaN353vgYhePp3IBZQnrckH0P5l2VnAuTQjTDEZpVzgRrgjet0ZzvfSyFfaaogd0Moyxm7ceUH5EyxkD5wr5dpMJlYwD2LMASgS76qbPi34EmG9UWzn6%252Bn8YP%252B3bG1UCOmrhQkQ5tlwv1JVy%252FmX%252Bec2UiA2qGik1115R3fGtLVIv4ZnE8%252Fo1f%252BQhPnc7O3oHQhdhUFoQP2HyUTMsVQ%252Fj0kaw%253D%253D%7Ccksum%3A264916568624ba33af7686334a35a56a4c44b264e99a%7Campid%3APL_CLK%7Cclp%3A2334524&_ssn=wallartfamily&_ipg=25&rt=nc
     *
     * 功能7：../img/1611882247212.jpg
     * 禅道任务：3397
     * 列表页，加上销量表格
     * 示例地址: https://www.ebay.com.au/sch/i.html?_from=R40&_sacat=0&_oac=1&_clu=2&_fcid=15&_localstpos=&_stpos=&gbr=1&_nkw=Car%20Air%20Compressor&rt=nc&LH_BIN=1
     */
    init() {
      const list = $(".srp-list > .s-item");
      if (list.length > 0) {
        // 搜索列表页初始化功能1、2和7
        this.list = list;
        console.log("[list]: ", this.list);
        this.func1();
        const domList = this.func2();
        this.func7(domList);
      } else if ($("#ListViewInner > .sresult").length > 0) {
        // 商品详情点击See more items链接时显示的商品列表
        this.list2 = $("#ListViewInner > .sresult");
        this.func5();
        const domList = this.func6();
        this.func7(domList);
      }
      // 购买历史页初始化功能4
      if (this.href.indexOf("offer.ebay.com.au") > -1) {
        this.func4();
      }
    },
    func1() {
      const list = this.list;

      const pageSize = Number(
        $(
          ".fake-menu-button[aria-labelledby=srp-ipp-label-text] .expand-btn__cell span.expand-btn__cell span"
        ).text()
      );
      const page = Number(
        $(".pagination__item[aria-current=page]").text() || 1
      );
      let itemId = "";
      for (let i = 0, len = list.length; i < len; i++) {
        itemId = $(list[i])
          .find(".s-item__itemID")
          .text()
          .substr(6);

        $(list[i]).append(`
          <div class="s-item__num">${(page - 1) * pageSize + i + 1}</div>
        `);
        // $(list[i]).find('.s-item__details').append(`
        //   <div class="s-item__detail s-item__detail--secondary">
        //     <a href="https://offer.ebay.com.au/ws/eBayISAPI.dll?ViewBidsLogin&item=${itemId}&rt=nc&_trksid=p2047675.l2564" target="_blank">View Solds</a>
        //   </div>
        // `)
      }
    },
    func2() {
      const list = this.list;

      const domList = [];
      // let item = null;
      // let itemId = "";
      // for (let i = 0; i < list.length; i++) {
      //   item = $(list[i]).find(".s-item__itemID");
      //   itemId = $(item)
      //     .text()
      //     .substr(6);
      //   domList.push({
      //     itemId,
      //     dom: item
      //   });
      // }

      $(list)
        .toArray()
        .forEach(item => {
          const hasItemId = $(item).find(".s-item__itemID").length > 0;
          domList.push({
            hasItemId,
            itemId: $(item)
              .find(".s-item__link")
              .attr("href")
              .split("?")[0]
              .split("/")
              .reverse()[0],
            dom: hasItemId
              ? $(item).find(".s-item__itemID")
              : $(item).find(".s-item__details")
          });
        });

      utils.addListInfo(domList, 1, this.keyword);
      return domList;
    },
    func4() {
      const itemId = utils.getQueryKeyValue("item");
      // 查找关键字
      utils.fetchList([itemId]).then(data => {
        data = data || [];
        const obj = data[0] || {};
        if (!obj.keyword) {
          return;
        }

        // class="keyword-link-item"
        const link = `<a target="_blank" href="${obj.link}" style="margin-left: 15px; text-decoration: underline; color: #dd1e31; ">${obj.keyword}</a>`;
        if ($(".BHitemNo").length > 0) {
          $(".BHitemNo").append(link);
        } else if ($("td.BHCtBidLabel").length > 0) {
          const tds = $("td.BHCtBidLabel");
          $.each(tds, function(index, td) {
            if (
              $(td)
                .text()
                .indexOf("Item number") > -1
            ) {
              console.log(link, $(td).siblings());
              $(td)
                .siblings()
                .append(link);
            }
          });
        }
      });
    },
    func5() {
      const list = this.list2;

      const pageSize = Number(
        $(".sel > .dropdown.small > a.dropdown-toggle").text()
      );
      const page = Number($("a.pg.curr").text() || 1);

      for (let i = 0, len = list.length; i < len; i++) {
        $(list[i]).append(`
          <div class="s-item__num">${(page - 1) * (pageSize + 13) + i + 1}</div>
        `);
      }
    },
    func6() {
      const list = this.list2;

      const domList = [];
      let item = null;
      let itemId = "";
      for (let i = 0; i < list.length; i++) {
        item = $(list[i]).find(".lvdetails li:last-child");
        itemId = $(item)
          .text()
          .trim()
          .substr(6);
        domList.push({
          itemId,
          dom: item
        });
      }

      utils.addListInfo(domList, 2, this.keyword);
      return domList;
    },
    func7(domList) {
      // let length = domList.length;
      // const COUNT = 30; // 并发量
      // const IS_DEV = false; // 此值为true时，只发送第一组itemId请求，避免请求过多，仅测试用，生产模式请改为false

      // // 分组：每COUNT个一组并发，间隔INTERVAL
      // // let tempArr = []
      // for (let i = 0; i < length; i += COUNT) {
      //   // tempArr.push(domList.slice(i, i + COUNT))
      //   if (IS_DEV && i === 0) {
      //     utils.makeTable(domList.slice(i, i + COUNT));
      //   } else {
      //     utils.makeTable(domList.slice(i, i + COUNT));
      //   }
      // }

      // 由于接口速度优化后非常快，此处不再分批获取
      utils.makeTable(domList);
    }
  }
};
</script>

<style lang="scss" scoped></style>
