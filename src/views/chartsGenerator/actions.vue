<template>
  <div class="actions">
    <el-button type="text"  @click="back">返回</el-button>
    <el-button type="text"  @click="getCode">生成代码</el-button>
    <el-button type="text" @click="preview">预览</el-button>
    <open-dialog title="预览" :isNoMask="true" :isShow="isPreviewShow" @on-close="close">

    </open-dialog>
    <open-dialog title="生成代码" :isShow="isCreateCodeShow" @on-close="close">
      <ace-editor ref="codeEditor" lang="html" v-model="codeContent"></ace-editor>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="copy($event,codeContent )">复制</el-button>
        <el-button type="primary" @click="download">下载</el-button>
      </div>
    </open-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import openDialog from '@/components/open-dialog'
import aceEditor from '@/views/chartsGenerator/ace-editor'
import { getChartTemplate } from '@/utils/template'
import Clipboard from 'clipboard'
export default {
  components: {
    openDialog,
    aceEditor },
  data() {
    return {
      isCreateJsonShow: false,
      isPreviewShow: false,
      isCreateCodeShow: false,
      jsonContent: '',
      tableJsonContent: '',
      codeContent: '',
      tableCodeContent: '',
      copyBtn: null
    }
  },
  computed: {
    ...mapState('formFilterConfig', ['config']),
    ...mapState('currentConfig', ['pageAttr']),
    ...mapState('chartConfig', ['optionConfig']),
    ...mapGetters('formFilterConfig', ['jsonConfig']),
    ...mapGetters('tableConfig', ['tableJsonConfig'])
  },
  mounted() {
  },
  methods: {
    back() {
      // window.history.go(-1)
      this.$router.push({ path: '/tool/chart', query: { type: this.$route.query.type }})
    },
    getJson() {
      this.isCreateJsonShow = true
      const prettyJson = require('pretty-object-string/lib/index')
      this.jsonContent = prettyJson(JSON.stringify(this.jsonConfig))
      this.tableJsonContent = prettyJson(JSON.stringify(this.tableJsonConfig))
    },
    preview() {
      this.$emit('preview')
      // this.isPreviewShow = true
      // const { href } = this.$router.resolve({ name: 'preview' })
      // window.open(href, '_blank')
    },
    getCode() {
      this.isCreateCodeShow = true

      const params = {}
      this.jsonConfig.forEach(item => {
        if (item.paramName && item.initValue) {
          if (Array.isArray(item.paramName)) {
            item.paramName.forEach((cell, index) => { params[cell] = item.initValue[index] })
          } else {
            params[item.paramName] = item.initValue
          }
        }
      })
      // const prettyJson = require('pretty-object-string/lib/index')
      // const isEdit = this.tableJsonConfig.filter(item => item.displayType === '按钮' && item.displayBtns.indexOf('编辑') !== -1).length > 0
      // const isDel = this.tableJsonConfig.filter(item => item.displayType === '按钮' && item.displayBtns.indexOf('删除') !== -1).length > 0
      // this.codeContent = getFormFilterTemplate(prettyJson(JSON.stringify(this.jsonConfig)), prettyJson(JSON.stringify(params)), prettyJson(JSON.stringify(this.tableJsonConfig)), isEdit, isDel, this.pageAttr)
      let importList = ''
      let chartSpe = ''
      switch (this.$route.query.type) {
        case '水波球':
          importList = `import 'echarts-liquidfill'`
          break
        case '热词云':
          importList = `import 'echarts-wordcloud'`
          break
        case '地图':
          importList = `const cityData = require('./jsonData.json') //请将地图数据放入该路径`
          chartSpe = ` if (this.chart) {
                echarts.registerMap('嘉兴市', cityData);
              }`
      }
      this.codeContent = getChartTemplate(this.optionConfig, importList, chartSpe)
    },
    download() {
      const blob = new Blob([this.codeContent])
      const src = URL.createObjectURL(blob)
      var link = document.createElement('a')
      link.download = 'table.vue'
      link.style.display = 'none'
      link.href = src
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    copy(e, code) {
      const clipboard = new Clipboard(e.target, {
        text: () => code
      })
      clipboard.on('success', () => {
        this.$message({ message: '复制成功', showClose: true, type: 'success' })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        this.$message({ message: '复制失败,', showClose: true, type: 'error' })
        clipboard.destroy()
      })
      clipboard.onClick(e)
    },
    close() {
      this.isCreateJsonShow = false
      this.isPreviewShow = false
      this.isCreateCodeShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.actions{
    display: flex;
    padding-left:20px;
    /deep/ .el-tabs__item{
      height: 100% !important;
      line-height: inherit !important;
  }
  .dialog-footer{
    padding:30px 0 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
