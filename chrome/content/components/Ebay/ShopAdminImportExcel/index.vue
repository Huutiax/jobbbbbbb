<template>
  <RightPanel height="560px" width="600px" max-width="600px">
    <!-- <Login ref="login" :login-function="handleLogin"></Login> -->
    <div style="text-align: center; padding-top: 10px;">
      当前店铺：{{ shopName }}
    </div>
    <div class="button-wrapper">
      <UploadExcel :on-success="handleSuccess" :before-upload="beforeUpload" />
      <div class="button-wrapper__result">
        已选择文件：{{ fileName }}
        <el-button type="primary" :loading="loading" @click="handleImport"
          >确定导入</el-button
        >
        <el-button @click="reset">重置</el-button>

        <el-button
          v-show="failedData.length > 0"
          type="error"
          style="margin-left: 20px"
          @click="downloadFailedReasons"
          >导出失败结果</el-button
        >
      </div>

      <el-table v-if="!showResult" :data="data" :height="320">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column
          prop="tableName"
          label="tableName"
          width="90"
          align="center"
        ></el-table-column>
        <el-table-column prop="region" label="region"></el-table-column>
        <el-table-column
          prop="cost"
          label="cost"
          width="80"
          align="center"
        ></el-table-column>
      </el-table>

      <el-table v-else :data="failedData" :height="360">
        <el-table-column prop="key" label="序号" width="50" />
        <el-table-column
          prop="tableName"
          label="tableName"
          width="90"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="reason"
          label="导入失败原因"
          :loading="downloading"
        ></el-table-column>
      </el-table>
    </div>
  </RightPanel>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import UploadExcel from "@/components/UploadExcel";
import $ from "jquery";
import qs from "qs";
import { sleep } from "@/utils";
import { export_json_to_excel } from "@/vendor/Export2Excel";
import moment from "moment";

// 获取接口的秘钥 srt
// $('[name="srt"]').val()

// 获取页面的region - id对照表
// const temp1 = document.querySelectorAll('#myModal label')
// function test () {
// 	let obj = {}
//     for (let i = 0; i < temp1.length; i++) {
// 		obj[temp1[i].innerText] = temp1[i].getAttribute('for')
// 	}
// 	return obj
// }
// const obj = test()
const regionIdRules = {
  "New South Wales": "AU-NSW",
  "NSW Border Cities": "NSW_V2",
  "Far South NSW": "NSW_V2_RNSW",
  "Far South West NSW": "NSW_V2_WNSW",
  "Far West NSW": "NSW_V2_SWNSW",
  "NSW Regional": "_N2",
  Albury: "NSW_N2_ABX",
  Canberra: "NSW_N2_CBR",
  "Central NSW": "NSW_N2_CNSW",
  "Hunter Region": "NSW_N2_HRNSW",
  "NSW Regional PO Box/LVR": "NSW_N2_S",
  Newcastle: "NSW_N2_NTL",
  "Norfolk Island (external territory)": "NSW_N2_NF",
  "North Coast NSW": "NSW_N2_NCNSW",
  "North West NSW": "NSW_N2_WNSW",
  "Northern Border NSW": "NSW_N2_SEQLD",
  "Outer Wollongong": "NSW_N2_WOL",
  Riverina: "NSW_N2_RNSW",
  "South Coast NSW": "NSW_N2_SCNSW",
  "Sydney Metropolitan": "_N1",
  "Central Coast": "NSW_N1_NTL",
  Sydney: "NSW_N1_SYD1",
  "Sydney Fringe": "NSW_N1_SYD2",
  "Sydney Metropolitan PO Box/LVR": "NSW_N1_S",
  "Sydney West": "NSW_N1_CNSW",
  Wollongong: "NSW_N1_WOL",
  "Northern Territory": "_NT",
  "Alice Springs": "NT_NT1_ASP",
  Darwin: "NT_NT1_DRW",
  "Northern Territory PO Box/LVR": "NT_NT1_S",
  "Northern Territory Regional": "NT_NT1_NT",
  Queensland: "AU-QLD",
  "Brisbane and Gold Coast": "_Q1",
  Brisbane: "QLD_Q1_BNE",
  "Brisbane and Gold Coast PO Box/LVR": "QLD_Q1_S",
  "Gold Coast": "QLD_Q1_SEQLD",
  "Upper SE QLD": "QLD_Q1_OSQLD",
  "Central and Western Queensland": "_Q3",
  "Central Coast QLD": "QLD_Q3_CCQLD",
  Mackay: "QLD_Q3_MKY",
  "Outer SE QLD": "QLD_Q3_OSQLD",
  Rockhampton: "QLD_Q3_ROK",
  "West QLD": "QLD_Q3_WQLD",
  "Ipswich Toowoomba SW Queensland": "_Q2",
  "Central West": "QLD_Q2_WQLD",
  "Gladstone Region": "QLD_Q2_CCQLD",
  Ipswich: "QLD_Q2_BNE",
  "Ipswich Toowoomba SW Queensland PO Box/LVR": "QLD_Q2_S",
  "Sunshine Coast": "QLD_Q2_SEQLD",
  Toowoomba: "QLD_Q2_OSQLD",
  "North Queensland": "_Q4",
  Cairns: "QLD_Q4_CNS",
  "Central QLD": "QLD_Q4_WQLD",
  "North Coast QLD": "QLD_Q4_NCQLD",
  Townsville: "QLD_Q4_TSV",
  "York Region": "QLD_Q4_YORK",
  "South Australia": "AU-SA",
  "Adelaide Metropolitan": "_S1",
  Adelaide: "SA_S1_ADL",
  "Adelaide Fringe": "SA_S1_SESA",
  "Adelaide Metropolitan PO Box/LVR": "SA_S1_S",
  "Regional SA and Broken Hill": "_S2",
  "Mount Gambier": "SA_S2_MTG",
  "Regional SA": "SA_S2_NWSA",
  "SE South Australia": "SA_S2_SESA",
  Tasmania: "_T1",
  "Antarctic Bases (external territory)": "TAS_T1_AB",
  Hobart: "TAS_T1_HBA",
  Launceston: "TAS_T1_LST",
  "Tasmania PO Box/LVR": "TAS_T1_S",
  "Tasmania Regional": "TAS_T1_TAS",
  Victoria: "AU-VIC",
  "Melbourne Metropolitan": "_V1",
  "Greater Melbourne": "VIC_V1_IVIC",
  Melbourne: "VIC_V1_MEL1",
  "Melbourne Fringe": "VIC_V1_MEL2",
  "Melbourne Metropolitan PO Box/LVR": "VIC_V1_S",
  "Victoria Regional": "_V2",
  "Inner Victoria": "VIC_V2_IVIC",
  "Outer Victoria": "VIC_V2_OVIC",
  "Victoria Regional PO Box/LVR": "VIC_V2_S",
  Wodonga: "VIC_V2_ABX",
  "Western Australia": "AU-WA",
  "Perth Metropolitan": "_W1",
  Perth: "WA_W1_PER",
  "Perth Fringe": "WA_W1_SWA",
  "Perth Metropolitan PO Box/LVR": "WA_W1_S",
  "WA Northern Regional": "_W3",
  Broome: "WA_W3_BRM",
  "Christmas Island (external territory)": "WA_W3_CHI",
  "Cocos (keeling) Island (external territory)": "WA_W3_COI",
  "North West WA": "WA_W3_CWA",
  "Upper North WA": "WA_W3_NWA",
  "WA Northern Regional PO Box/LVR": "WA_W3_S",
  "WA Southern and Central Regional": "_W2",
  "South Central WA": "WA_W2_CWA",
  "South West WA": "WA_W2_SWA",
  "WA Southern and Central Regional PO Box/LVR": "WA_W2_S"
};

const WAITING_TIME = 5 * 1000;

const saveTableData = data => {
  sessionStorage.ebayImportRateTableData = JSON.stringify(data);
};
const getTableData = () => {
  if (!sessionStorage.ebayImportRateTableData) {
    return null;
  }
  return JSON.parse(sessionStorage.ebayImportRateTableData);
};

export default {
  name: "EbayShopAdminImportExcel",
  components: {
    RightPanel,
    UploadExcel
  },
  data() {
    return {
      shopName: "", // 店铺名
      showActions: false,
      data: [],
      formatData: {},
      total: 0, // 总条数
      headers: null,
      existTableNames: [],
      fileName: "",
      srt: "",
      loading: false,
      messageInstance: null,
      failedData: [], // 导入失败列表，记录tableName和失败原因
      showResult: false,
      downloading: false,
      metaData: {},
      existTableList: [] // 已存在的rateTableList
    };
  },
  watch: {
    loading(newV) {
      if (newV) {
        this.messageInstance = this.$message.info({
          // dangerouslyUseHTMLString: true,
          type: "success",
          iconClass: "el-icon-loading",
          message: `导入中，请勿刷新或关闭页面...`,
          duration: 0
        });
      } else {
        (this.messageInstance || {}).close();
      }
      this.showResult = !newV;
    }
  },
  mounted() {
    // rateTable 添加/更新 的关键数据
    this.srt = $('[name="srt"]').val();
    console.log("[重要数据srt]: ", this.srt);

    try {
      // 对于已存在的rateTable，需要获取其关键信息
      const _mc = Array.from(document.querySelectorAll("script")).find(item =>
        (item.innerText || "").includes("$MC")
      );
      const scriptText = _mc.innerText;
      // 从script的内容里，找出rateTableVersion、rateTableId、defaultRateTable、rateTableSchemaId字段和其值
      // 这里使用正则方式
      scriptText.replace(/"rateTableId":"(\d+)",/gi, (str, $1) => {
        this.metaData.rateTableId = $1;
      });
      scriptText.replace(/"rateTableVersion":"(\d+)",/gi, (str, $1) => {
        this.metaData.rateTableVersion = $1;
      });
      scriptText.replace(/"defaultRateTable":(true|false),/gi, (str, $1) => {
        this.metaData.defaultRateTable = $1 !== "false";
      });
      scriptText.replace(
        /"rateTableSchemaId":"(.+)","rateTableSchemaVersion/gi,
        (str, $1) => {
          this.metaData.rateTableSchemaId = $1 || "domestic_au";
        }
      );
      console.log("[关键信息metaData]: ", this.metaData);
    } catch (err) {
      console.error(err);
    }

    this.existTableList = $("#ddlRateTables option")
      .toArray()
      .map(item => ({
        name: $(item)
          .text()
          .trim(),
        id: $(item).val()
      }));

    console.log("[已存在的rateTable]: ", this.existTableList);

    // 获取已存在的tableName列表
    try {
      this.existTableNames = $("[label=Domestic]")
        .children("option")
        .toArray()
        .map(v => $(v).text());
    } catch (err) {
      console.log(err);
    }

    // 保存店铺名
    $.get(
      "/gh/user_profile?modules=USER_PROFILE&behavior=GET_PROFILE&moduleType=USER_PROFILE&client=4&shippingType=ITEM_QUANTITY&locality=DOMESTIC&shippingDisplay=DEFAULT&basePath=https%253A%252F%252Fwww.ebay.com.au%252Fship%252Fprf&correlation=operationId%3D2488502&v=2"
    ).then(data => {
      this.shopName =
        data.content.response.modules.USER_PROFILE.userLoginName.textSpans[0].text;
    });
    if (getTableData()) {
      this.handleImport();
    }
  },
  methods: {
    logout() {
      this.$message({
        type: "error",
        message: "登录token已失效，请重新登录！"
      });
      this.$refs.login.logout(false);
      this.isLogin = false;
    },
    init() {},
    beforeUpload(file) {
      const isInLimit = file.size / 1024 / 1024 < 100;

      if (isInLimit) {
        this.fileName = file.name;
        return true;
      }

      this.$message({
        message: "上传文件不能大于100M",
        type: "warning"
      });
      return false;
    },
    handleSuccess({ results, header }) {
      const data = results.filter(v => v.tableName && v.region);
      if (data.length === 0) {
        return this.$message({
          type: "error",
          message: "格式不正确，请确保table name和region都填写内容！"
        });
      }

      this.data = results;
      this.mergeSameTableName(results);
      this.headers = header;
      this.total = results.length;

      saveTableData({
        data: results,
        headers: header
      });
    },
    /**
     * @description 合并数据
     * tableName相同的行合并导入
     */
    mergeSameTableName(data) {
      const res = {};
      data.forEach((item, index) => {
        if (!res[item.tableName]) {
          res[item.tableName] = [];
        }
        res[item.tableName].push({ ...item, key: index });
      });
      this.formatData = res;
    },
    /**
     * @description 处理导入table region列表
     * 同一个tableName的合并导入，单次只执行一个tableName的导入
     */
    async handleImport() {
      const cacheData = getTableData();
      if (cacheData) {
        const { data, headers } = cacheData;
        this.data = data;
        this.mergeSameTableName(data);
        this.headers = headers;
        this.total = data.length;
      }
      if (!this.headers) {
        this.loading = false;
        return this.$message.warning("请先选择导入的表格！");
      }
      this.loading = true;

      const keys = Object.keys(this.formatData);
      // 全部完成
      if (keys.length === 0) {
        this.loading = false;
        const len = this.failedData.length;
        this.$notify({
          type: len === 0 ? "success" : "error",
          position: "bottom-right",
          title: `导入完成！`,
          message:
            len === 0
              ? `成功${this.total}条，失败0条，请刷新页面查看导入结果`
              : `成功${this.total - len}条，失败${len}条！请审查失败原因列表！`,
          duration: 0
        });
        return;
      }

      const tableName = keys[0];
      const existTableItem = this.existTableList.find(
        item => item.name === tableName
      );
      let existTableId;
      if (existTableItem) {
        existTableId = existTableItem.id;
        // 选中该rateTable，刷新页面再执行导入逻辑
        // 不是当前rateTable才跳转为当前rateTable页面
        if (!location.href.includes(existTableId)) {
          location.href = `https://www.ebay.com.au/ship/rt/details/${existTableId}?client=4&shippingDisplay=DEFAULT&basePath=https%3A%2F%2Fwww.ebay.com.au%2Fship%2Fprf`;
          return;
        }
      } else {
        // 新增的必须切到rate table选择框为Select ...的项
        // 才能保证srt正确
        if (location.pathname !== "/ship/rt") {
          location.href = `https://www.ebay.com.au/ship/rt?client=4&shippingType=ITEM_QUANTITY&locality=DOMESTIC&shippingDisplay=DEFAULT&basePath=https%3A%2F%2Fwww.ebay.com.au%2Fship%2Fprf`;
          return;
        }
      }
      const items = this.formatData[tableName];
      try {
        // // 判断该tableName是否已经创建过
        // // 已存在则走错误流程
        // if (this.existTableNames.includes(tableName)) {
        //   // 走更新流程（无法走该流程，更新需要获取之前的region列表再合并参数），因无法通过接口形式获取到region列表
        //   throw new Error(`${tableName} 已存在，无法导入，请手动去更新！`);
        // }

        // 2021-12-13 14:22 不走合并，直接覆盖
        await this.handleSubmit(existTableId, tableName, items);
      } catch (err) {
        // 错误流程
        this.failedData.push(
          ...items.map(item => {
            return {
              key: item.key,
              tableName: tableName,
              reason: err.message
            };
          })
        );
      }
      // 移出列表
      delete this.formatData[tableName];
      this.data = this.data.filter(v => v.tableName !== tableName);
      saveTableData(
        this.data.length > 0
          ? {
              data: this.data,
              headers: this.headers
            }
          : ""
      );
      // 继续下一个导入
      await sleep(WAITING_TIME);
      await this.handleImport();
    },
    async handleSubmit(existTableId, tableName, items) {
      // { tableName, region, cost }
      // 这里的x-www-form-urlencode参数逻辑有点绕
      // shippingRegionIds序列化后是不要下标的
      // table[regionShippingSpecifications][0][shippingRegionIds][]
      // 而regionShippingSpecifications序列化是要下标的
      // 所以采用分部组装的方式
      // ① 先组装基础table内容
      // ② 再拼装shippingRegionIds内容
      const shipType = $("#ddlShippingType").val() || "ITEM_QUANTITY";
      let table = {
        defaultRateTable: false,
        displayName: tableName,
        packageType: "SMALL_PACKAGE", // FREIGHT
        rateTableSchemaId: "domestic_au",
        rateTableSchemaVersion: 1,
        // regionShippingSpecifications: [], // 规则
        shippingDisplay: "DEFAULT",
        shippingRateCalculationType: shipType
      };
      if (existTableId) {
        table.rateTableId = existTableId;
        table.rateTableVersion = this.metaData.rateTableVersion;
        table.rateTableSchemaId = this.metaData.rateTableSchemaId;
        table.defaultRateTable = this.metaData.defaultRateTable;
      }
      table.regionShippingSpecifications = [];
      const regionIds = [];

      items.forEach(item => {
        let { region, cost } = item;

        // 移除回车
        region = region.replace(/\r|\n/g, "");
        const temp = region.split(";").map(v => {
          // 移除一级分类
          return v.replace(/.+\s-\s/, "");
        });
        const regions = [];
        temp.forEach(item => {
          !!item.trim() && regions.push(...item.split(","));
        });

        // 获取region id数组
        regionIds.push(
          regions
            .map(item => {
              return regionIdRules[item.trim()];
            })
            .filter(v => !!v)
        );
        console.log("[regionIds]", regionIds);

        table.regionShippingSpecifications.push({
          additionalRate: shipType !== "ITEM_QUANTITY" ? cost : "",
          baseRate: shipType === "ITEM_QUANTITY" ? cost : "",
          deliveryTimeInHours: "",
          // shippingRegionIds: regions,
          shippingServiceCategory: {
            shippingServiceCategoryType: "STANDARD"
          },
          shippingServiceCode: ""
        });
      });
      let params = qs.stringify({
        srt: this.srt,
        table
      });

      regionIds.forEach((regionIdArr, index) => {
        params += `&${regionIdArr
          .map(v => {
            return `table[regionShippingSpecifications][${index}][shippingRegionIds][]=${v}`;
          })
          .join("&")}`;
      });

      return new Promise((resolve, reject) => {
        $.ajax({
          url: existTableId ? "/ship/rt/putdata" : "/ship/rt/save",
          type: existTableId ? "PUT" : "POST",
          dataType: "json",
          data: params,
          success: data => {
            const message = data.message || {};
            if (message.messageType === "ERROR") {
              const msg = message.title.textSpans[0].text;
              return reject({
                message:
                  msg === "This region is already selected"
                    ? "多条Region记录的地区不能出现重复的情况！"
                    : JSON.stringify(msg)
              });
            }
            // 报错
            resolve();
          },
          error: err => reject({ message: JSON.stringify(err) })
        });
      });
    },
    /**
     * @description 导出失败结果
     */
    downloadFailedReasons() {
      this.downloadLoading = true;

      const tHeader = ["tableName", "导入失败原因"];
      const filterVal = ["tableName", "reason"];
      const data = this.formatJson(filterVal, this.failedData);
      export_json_to_excel({
        header: tHeader,
        data,
        filename: `${this.shopName}导入失败结果-${moment().format(
          "YYYY-MM-DD hh-mm-ss"
        )}`,
        autoWidth: true,
        bookType: "xlsx"
      });
      this.downloadLoading = false;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    /**
     * @description 重置
     */
    reset() {
      this.data = [];
      this.total = 0;
      this.headers = null;
      this.loading = false;
      this.failedData = [];
      this.showResult = false;
      this.downloading = false;
      this.fileName = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.button-wrapper {
  box-sizing: border-box;
  padding: 15px;

  &__result {
    margin-top: 10px;
    font-size: 14px;
    color: #777;
    margin-bottom: 15px;
  }
}
</style>
