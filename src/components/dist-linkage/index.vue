<template>
  <div class="area-tree">
    <div class="table-head">
      <table class="table table-striped table-bordered border-right-none">
        <thead>
          <tr>
            <th style="width: 30%">省</th>
            <th style="width: 30%">市</th>
            <th style="width: 40%">区</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="table-body">
      <table
        height="100%"
        class="
          table table-striped table-bordered
          border-top-none border-right-none
        "
      >
        <tbody>
          <tr>
            <!-- province -->
            <td class="td" style="width: 30%">
              <div
                v-for="(p, pIndex) in baseAreaAll"
                class="column"
                :key="p[keyword]"
              >
                <div
                  :class="['cell', currentP === p[keyword] ? 'cell-active ' : '']"
                >
                  <div
                    :class="[
                      'cb-wrap',
                      p.parentCheckStatus == 'part' ? 'cb-part-wrap' : '',
                      p.parentCheckStatus == 'all' ? 'cb-all-wrap' : '',
                    ]"
                  >
                    <input
                      type="checkbox"
                      id="checkbox"
                      :checked="p.checked"
                      @click="checkProvinceAll(p, pIndex, $event)"
                    />
                  </div>
                  <span @click="selectProvince(p, pIndex)">{{ p[label] }}</span>
                </div>
              </div>
            </td>
            <!-- city -->
            <td class="td" style="width: 30%">
              <div v-for="(p, pIndex) in baseAreaAll" :key="p[keyword]">
                <div class="column" v-show="currentP == p[keyword]">
                  <div
                    v-for="(c, cIndex) in p.children || []"
                    :class="['cell', currentC === c[keyword] ? 'cell-active ' : '']"
                    :key="c[keyword]"
                  >
                    <div
                      :class="[
                        'cb-wrap',
                        c.parentCheckStatus == 'part' ? 'cb-part-wrap' : '',
                        c.parentCheckStatus == 'all' ? 'cb-all-wrap' : '',
                      ]"
                    >
                      <input
                        type="checkbox"
                        id="checkbox"
                        :checked="c.checked"
                        @click="checkCityAll(p, pIndex, c, cIndex, $event)"
                      />
                    </div>
                    <span @click="selectCity(c, cIndex)">{{ c[label] }}</span>
                  </div>
                </div>
              </div>
            </td>
            <!-- area -->
            <td class="td" style="width: 40%">
              <div v-for="(p, pIndex) in baseAreaAll" :key="p[keyword]">
                <div v-for="(c, cIndex) in p.children || []" :key="c[keyword]">
                  <div
                    class="column"
                    v-show="currentP == p[keyword] && currentC == c[keyword]"
                  >
                    <div
                      class="cell"
                      v-for="(a, aIndex) in c.children || []"
                      :key="a[keyword]"
                    >
                      <div :class="['cb-wrap', a.checked ? 'cb-all-wrap' : '']">
                        <input
                          type="checkbox"
                          id="checkbox"
                          :checked="a.checked"
                          @click="
                            areaCheckChange(
                              p,
                              pIndex,
                              c,
                              cIndex,
                              a,
                              aIndex,
                              $event
                            )
                          "
                        />
                      </div>
                      <span>{{ a[label] }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "distLinkage",
  model: {
    prop: "value",
  },
  props: {
    data: {
      type: Array,
      default: [],
      require: true,
    },
    value: {
      type: Array,
      default: [],
      require: true,
    },
    label: {
      type: String,
      default: "name",
    },
    keyword: {
      type: String,
      default: "code",
    },
    onSelect: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      currentP: 0,
      currentC: 0,
      selectArea: {},
      baseAreaAll: [],
      selectList: [],
    };
  },
  watch: {
    selectArea: {
      deep: true,
      handler: function(newv, oldv){
        const areaList = [];
        Object.keys(newv).forEach((key) => {
          newv[key]
            .filter((i) => !!i)
            .forEach((a) => areaList.push(a));
        });

        this.$emit("onSelect", areaList)
      }
    }
  },
  created() {
    this.baseAreaAll = this.data;
    this.selectList = this.value;
  },
  mounted() {
    this.setValue();
  },
  methods: {
    setValue() {
      this.baseAreaAll.forEach((p, pIndex) => {
        if (p.children && p.children.length) {
          p.children.forEach((c, cIndex) => {
            if (c.children && c.children.length) {
              c.children.forEach((area, index) => {
                this.selectList.forEach((code) => {
                  if (code == area[this.keyword]) {
                    this.areaCheckChange(p, pIndex, c, cIndex, area, index, {
                      target: { checked: true },
                    });
                  }
                });
              });
            }
          });
        }
      });
    },
    selectProvince(p, index) {
      this.$set(this, "currentP", p[this.keyword]);
    },
    selectCity(c, index) {
      this.$set(this, "currentC", c[this.keyword]);
    },
    checkProvinceAll(p, pIndex, event) {
      (p.children || []).forEach((c, i) => {
        this.checkCityAll(p, pIndex, c, i, event);
      });
    },
    checkCityAll(p, pIndex, c, cIndex, event) {
      (c.children || []).forEach((a, i) => {
        this.areaCheckChange(p, pIndex, c, cIndex, a, i, event);
      });
    },
    areaCheckChange(p, pIndex, c, cIndex, a, aIndex, event) {
      const flag = event.target.checked;
      this.$set(a, "checked", flag);
      const ckey = "" + c[this.keyword];
      // 选中
      if (flag) {
        // 记录当前area code
        if (!this.selectArea[ckey]) {
          this.$set(this.selectArea, ckey, new Array(c.children.length));
        }

        this.selectArea[ckey].splice(aIndex, 1, a);
      }
      // 取消选中
      else {
        // 清空当前area code
        this.selectArea[ckey].splice(aIndex, 1, false);
      }

      // 判断当前区域选择数量
      // step1: city
      const cStatus = this.judgeAreaNumber(
        this.selectArea[ckey].filter((i) => !!i).length,
        c.children.length
      );
      this.$set(p.children[cIndex], "parentCheckStatus", cStatus);
      // step2: province
      // 获取当前已选择城市数量
      let count = 0;
      p.children.forEach((c) => {
        if (c.parentCheckStatus == "all" || c.parentCheckStatus == "part") {
          count++;
        }
      });
      const pStatus = this.judgeAreaNumber(count, p.children.length);
      this.$set(this.baseAreaAll[pIndex], "parentCheckStatus", pStatus);
    },
    judgeAreaNumber(checkLen, allLen) {
      // 全部选中
      if (checkLen >= allLen) {
        return "all";
      }
      // 部分选中
      else if (checkLen > 0) {
        return "part";
      }
      // 没有选中
      else {
        return "none";
      }
    },
  },
};
</script>

<style scoped>
/* 滚动条宽度 */
::-webkit-scrollbar {
  width: 0;
  background-color: transparent;
}

/* 滚动条颜色 */
::-webkit-scrollbar-thumb {
  background-color: #27314d;
}

.area-tree {
  position: relative;
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-head {
  flex: 0 0 auto;
  border-bottom: 1px solid #e7e7e7;
}

.table-body {
  flex: 1 1 auto;
  overflow: auto;
  border-bottom: 1px solid #e7e7e7;
}

.buttons-group {
  text-align: right;
  padding: 0 0 20px 0;
  width: 100%;
}

.table {
  table-layout: fixed;
  width: 100%;
  max-width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  background-color: transparent;
}

tbody {
  display: table-row-group;
  vertical-align: top;
  border-color: inherit;
}

.table-striped > tbody .cell {
  line-height: 1.42857;
  padding: 8px;
  cursor: default;
}

.table,
.table thead,
.table tbody,
.table tr,
.table tr th,
.table tr td {
  display: block;
  height: 100%;
  overflow: hidden;
}

.table thead tr,
.table tbody tr {
  display: flex;
}

.table tbody tr td {
  overflow: auto;
}

.table > tbody > tr > th,
.table > tfoot > tr > td,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > thead > tr > th {
  border-top: 1px solid #e7eaec;
  line-height: 1.42857;
  padding: 8px;
  vertical-align: top;
}

.table > tbody > tr > td {
  border-top: 1px solid #e7eaec;
  line-height: 1.42857;
  vertical-align: top;
}

.table-bordered > tbody > tr > td,
.table-bordered > tbody > tr > th,
.table-bordered > tfoot > tr > td,
.table-bordered > tfoot > tr > th,
.table-bordered > thead > tr > td,
.table-bordered > thead > tr > th {
  border: 1px solid #e7e7e7;
}

.border-top-none,
.border-top-none > tbody > tr > td,
.border-top-none > tbody > tr > th,
.border-top-none > tfoot > tr > td,
.border-top-none > tfoot > tr > th,
.border-top-none > thead > tr > td,
.border-top-none > thead > tr > th {
  border-top: none;
  border-bottom: none;
}

.border-right-none,
.border-right-none > tbody > tr > td:not(:last-child),
.border-right-none > tbody > tr > th:not(:last-child),
.border-right-none > tfoot > tr > td:not(:last-child),
.border-right-none > tfoot > tr > th:not(:last-child),
.border-right-none > thead > tr > td:not(:last-child),
.border-right-none > thead > tr > th:not(:last-child) {
  border-right: none;
}

.cb-wrap {
  display: inline-block;
  width: 16px;
  height: 16px;
  position: relative;
  border-color: #2d8cf0;
  background-color: #ffffff;
  border: 1px solid #dcdee2;
  border-radius: 2px;
  overflow: hidden;
  transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.cb-wrap input {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  cursor: pointer;
  opacity: 0;
}

.cb-part-wrap {
  background-color: #2d8cf0;
}

.cb-all-wrap {
  background-color: #2d8cf0;
}

.cb-part-wrap::after {
  content: "";
  width: 10px;
  height: 1px;
  transform: scale(1);
  position: absolute;
  left: 2px;
  top: 6px;
  display: table;
  position: absolute;
  border: 2px solid #fff;
  border-top: 0;
  border-left: 0;
  transition: all 0.2s ease-in-out;
}
.cb-all-wrap::after {
  content: "";
  display: table;
  width: 4px;
  height: 8px;
  position: absolute;
  top: 2px;
  left: 5px;
  border: 2px solid #fff;
  border-top: 0;
  border-left: 0;
  transform: rotate(45deg) scale(1);
  transition: all 0.2s ease-in-out;
}

.cell {
  display: flex;
  align-items: center;
  line-height: 1.42857;
  padding: 8px;
  cursor: default;
}

.cell-active {
  /* color: white; */
  background-color: rgba(45, 140, 240, 0.3);
}

.cell span {
  flex: 1 1 auto;
  margin-left: 6px;
}
</style>