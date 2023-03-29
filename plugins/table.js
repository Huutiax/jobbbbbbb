// import Vue from 'vue'
// import 'xe-utils'
// import VXETable from 'vxe-table'
// import 'vxe-table/lib/style.css'

// Vue.use(VXETable)

/**
 * @description 按需加载vxe-table
 * @see https://xuliangzhan_admin.gitee.io/vxe-table/#/table/start/use
 */

import Vue from "vue";
/* eslint-disable-next-line */
import XEUtils from 'xe-utils'
import { toThousandFilter, money } from "@/filters";
import zhCN from "vxe-table/lib/locale/lang/zh-CN";
import {
  VXETable,
  Grid,
  Icon,
  Header,
  Footer,
  Column,
  Table,
  Menu,
  Tooltip,
  Checkbox,
  CheckboxGroup,
  Filter
} from "vxe-table";

// 先按需导入依赖的模块
Vue.use(Grid)
  .use(Icon)
  .use(Header)
  .use(Filter)
  .use(Footer)
  .use(Column)
  .use(Menu)
  .use(Tooltip)
  .use(Checkbox)
  .use(CheckboxGroup)

  // 最后安装核心库
  .use(Table);

// 全局空内容渲染
VXETable.renderer.add("Empty", {
  renderEmpty(h, renderOpts) {
    return [
      <div>
        <svg
          style="margin: auto"
          width="64"
          height="40"
          viewBox="0 0 64 41"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
            <ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse>
            <g stroke="#d9d9d9" fill-rule="nonzero">
              <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
              <path
                d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                fill="#fafafa"
              ></path>
            </g>
          </g>
        </svg>
        <p style="color: rgba(0, 0, 0, .25)">暂无数据</p>
      </div>
    ];
  }
});

// 自定义全局的格式化处理函数
VXETable.formats.mixin({
  toThousandFilter({ cellValue }) {
    return toThousandFilter(money(cellValue));
  },
  money({ cellValue }) {
    return "¥" + toThousandFilter(money(cellValue));
  },
  number({ cellValue }) {
    return toThousandFilter(money(cellValue));
  },
  rate({ cellValue }, type) {
    return (
      toThousandFilter(money(cellValue * (type === "x100" ? 100 : 1))) + "%"
    );
  },
  formatEmpty({ cellValue }) {
    if (cellValue === null || cellValue === undefined || cellValue === "") {
      return "-";
    }
    return cellValue;
  }
});

VXETable.setup({
  // 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args),
  table: {
    // highlightHoverColumn: true,
    highlightHoverRow: true,
    highlightCurrentRow: true,
    highlightCurrentColumn: true,
    border: "inner",
    resizable: true,
    treeConfig: {
      children: "children"
    },
    emptyRender: { name: "Empty" }
  }
});
