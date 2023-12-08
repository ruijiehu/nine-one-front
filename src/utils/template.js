function getFormFilterTemplate(jsonConfig, tableJsonConfig, pageAttr) {
  const template = `<template>
  <div class="page">
      <form-filter :fields="formFilterConfigs" @submit="submit" @add="handleAdd"></form-filter>
      <v-table class="v-tb"  @customizeOper="handleCustomizeOper" :tableColumns="tableJsonConfig" :tableData="rows" @edit="handleEdit" @del="handleSingleDelete" @handleSelectionChange="handleSelectionChange"></v-table>
       <el-pagination class="pagination" v-if="total>0" background layout="total, prev, pager, next, jumper"
          :page-size="pageSize" :total="total"  :current-page="currentPage"  @current-change="changePage">
      </el-pagination>
      <open-dialog title="编辑" :isShow="dialogShow" @on-close="dialogShow=false">
          <div class="edit">
              <fields-editor :isReadonly="!isAdd" :fields="tableConfigs" v-model="currentRow" ref="editor"></fields-editor>
          </div>
          <div slot="footer">
            <div style="display:flex;justify-content:center;margin-top:10px;">
              <el-button type="primary" v-if="!isAdd" @click="confirmEdit(currentRow)">确定</el-button>
              <el-button type="primary" v-else @click="confirmAdd(currentRow)">确定</el-button>
            </div>
          </div>
      </open-dialog>
  </div>
</template>
<script>
import formFilter from 'viewinsight-npm/packages/components/form-filter'
import vTable from 'viewinsight-npm/packages/components/v-table'
import tableMixin from 'viewinsight-npm/packages/mixin/table-mixin'
import cascaderMixin from 'viewinsight-npm/packages/mixin/cascader-mixin'
import openDialog from 'viewinsight-npm/packages/components/open-dialog'
import fieldsEditor from 'viewinsight-npm/packages/components/fields-editor'
export default {
mixins: [tableMixin, cascaderMixin],
components: { formFilter, vTable, openDialog, fieldsEditor },
computed: {
  tableConfigs () {
    const arr = [...this.tableJsonConfig]
    arr.sort(this.compare('editWeight'))
    return arr
  },
  formFilterConfigs () {
    const arr = [...this.jsonConfig]
    arr.forEach(item => {
      if (item.name === 'v-cascader-ui') {
        item.fetchDrillData = (parent, sub, cb) => this.fetchDrillData(parent, sub, cb)
        item.querySearch = (queryString, cb) => this.querySearch(queryString, cb)
        item.initValue = this.region
      }
    })
    return arr
  }
},
data () {
  return {
    url: '',
    tableJsonConfig:${tableJsonConfig},
    jsonConfig:${jsonConfig},
    pageAttr:${pageAttr}
  }
},
mounted () {
  this.url = this.pageAttr.method
  if (this.url) {
    this.getData()
  }
},
methods: {
  compare (key) {
    return function (value1, value2) {
      const val1 = value1[key]
      const val2 = value2[key]
      return val1 - val2
    }
  },
  handleCustomizeOper (row, funcName) {
   
  }
}
}
</script>
<style lang="less" scoped>
.page{
  /deep/ .open-dialog{
      /deep/ .dialog-body{
        .edit{
            .edit-row{
               display: flex;
           }
         }
      }
  }
  .pagination{
    margin-top: 20px;
    text-align: center;
  }
}
</style>
`
  return template
}
function getTableTemplate(tableJsonConfig, isEdit, isDel) {
  const template = `<template>
  <v-table class="v-tb" :tableColumns="tableJsonConfig" :tableData="tableData" ${isEdit ? '@edit="edit"' : ''} ${isDel ? '@del="del"' : ''}></v-table>
</template>
<script>
export default{
 data(){
   return {
    tableJsonConfig:${JSON.stringify(tableJsonConfig)},
    tableData: []
   }
 },
 methods:{
  ${isEdit ? `edit(){
  }` : ''}
  ${isDel ? `del(){
  }` : ''}
 }
}
</script>`
  return template
}
function getChartTemplate(chartConfig, importList, chartSpe) {
  const template = `<template>
      <div :id="chartId" :ref="chartId" style="width:500px;height:500px"></div> 
</template>
<script>
import * as echarts from 'echarts'
${importList}
export default {
data () {
  return {
    chartId:'chart_'+Date.now(),
    chart:null
  }
},
mounted () {
  this.initChart()
},
methods: {
  initChart () {
    this.chart = this.chart|| echarts.init(this.$refs[this.chartId])
    ${chartSpe}
    ${chartConfig}
    this.chart.setOption(option)
  }
}
}
</script>`
  return template
}
export { getFormFilterTemplate, getTableTemplate, getChartTemplate }
