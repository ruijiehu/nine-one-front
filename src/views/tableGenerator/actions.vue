<template>
  <div class="actions">
    <el-button type="text" icon="el-icon-document" @click="() => getCode()">
      生成代码
    </el-button>

    <el-button type="text" icon="el-icon-delete" @click="clearConfigs">
      清空
    </el-button>
    <el-button type="text" icon="el-icon-view" @click="preview">预览</el-button>
    <open-dialog title="生成JSON" :isShow="isCreateJsonShow" @on-close="close">
      <el-tabs type="border-card">
        <el-tab-pane label="搜索">
          <ace-editor lang="json" v-model="jsonContent"></ace-editor>
        </el-tab-pane>
        <el-tab-pane label="表格">
          <ace-editor lang="json" v-model="tableJsonContent"></ace-editor>
        </el-tab-pane>
      </el-tabs>
    </open-dialog>

    <open-dialog
      title="生成代码"
      :isShow="isCreateCodeShow"
      @on-close="close"
      width="1500px"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="index" name="index"> </el-tab-pane>
        <el-tab-pane label="api" name="api"> </el-tab-pane>
      </el-tabs>
      <textarea
        id="outputArea2"
        placeholder="请输入表结构信息..."
        style="height: 250px"
        v-model="codeContent"
      ></textarea>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="copy($event)"> 复制 </el-button>
        <el-button type="primary" @click="download">下载</el-button>
      </div>
    </open-dialog>

    <open-dialog
      title="表格自动配置"
      :isShow="isTableConfigShow"
      @on-close="close"
    >
      <div class="table-config">
        <el-input
          placeholder="请输入数据源"
          v-model="tableAutoConfig.datasource"
        >
          <template slot="prepend">数据源</template>
        </el-input>
        <el-input placeholder="请输入表名" v-model="tableAutoConfig.tableName">
          <template slot="prepend">表&#12288;名</template>
        </el-input>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmAutoConfig">
          生成表格
        </el-button>
      </div>
    </open-dialog>

    <open-dialog title="创建页面" :isShow="isPageCreateShow" @on-close="close">
      <div class="page-create-config">
        <div class="row">
          <label>是否后台创建：</label>
          <el-switch
            v-model="pageCreateConfig.needBackend"
            active-value="1"
            inactive-value="0"
          >
          </el-switch>
        </div>

        <div class="row">
          <label>
            <b v-if="pageCreateConfig.needBackend === '1'">*</b>
            包路径：
          </label>

          <el-input v-model="pageCreateConfig.packagePath"> </el-input>
        </div>

        <div class="row">
          <label>
            <b v-if="pageCreateConfig.needBackend === '1'">*</b>
            实例名称：
          </label>

          <el-input v-model="pageCreateConfig.entityName"> </el-input>
        </div>

        <div class="row">
          <label>实例描述：</label>

          <el-input
            v-model="pageCreateConfig.entityDesc"
            type="textarea"
            :rows="4"
          >
          </el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createPage">创建</el-button>
      </div>
    </open-dialog>
    <open-dialog
      title="页面列表"
      :isShow="isPageListShow"
      @on-close="close"
      width="1500px"
    >
      <div class="page-list">
        <el-table :data="pageList" stripe style="width: 100%" height="550">
          <el-table-column prop="entityName" label="实例名称">
          </el-table-column>

          <el-table-column prop="packagePath" label="包路径"> </el-table-column>

          <el-table-column prop="needBackend" label="是否后台创建">
            <template slot-scope="scope">
              {{ scope.row.needBackend === "1" ? "是" : "否" }}
            </template>
          </el-table-column>

          <el-table-column prop="entityDesc" label="描述"></el-table-column>

          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="updatePage(scope.row)"
              >
                修改
              </el-button>

              <el-button
                type="primary"
                size="mini"
                @click="getDetail(scope.row)"
              >
                详情
              </el-button>

              <el-button type="danger" size="mini" @click="delPage(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </open-dialog>
    <PreviewDialog ref="preview" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import openDialog from '@/components/open-dialog'
import CodeMirror from '@/utils/codemirror/codemirror.min.js'
import '@/utils/codemirror/codemirror.min.css'
import { stringify } from '@/utils/index'
import { generateSmartv, downloadSmartvCode } from '@/api/tool/gen'
import Clipboard from 'clipboard'

import PreviewDialog from '@/components/PreviewDialog'

export default {
  components: { openDialog, PreviewDialog },
  data() {
    return {
      activeName: 'index',
      isCreateJsonShow: false,
      isPreviewShow: false,
      isCreateCodeShow: false,
      isCourseVideoShow: false,
      jsonContent: '',
      tableJsonContent: '',
      codeContent: '',
      apiContent: '',
      tableCodeContent: '',
      copyBtn: null,
      isTableConfigShow: false,
      isPageCreateShow: false,
      isPageListShow: false,
      tableAutoConfig: {}, // 表格配置
      pageCreateConfig: { needBackend: '1' }, // 创建页面配置
      outputArea2: null,
      apiArea: null,
      // 已经生成过代码的参数
      generatedParam: null
    }
  },
  computed: {
    ...mapState('formFilterConfig', ['config']),
    ...mapState('currentConfig', ['pageAttr']),
    ...mapState('tableConfig', ['pageList']),
    ...mapGetters('formFilterConfig', ['jsonConfig']),
    ...mapGetters('tableConfig', ['tableJsonConfig', 'formJsonConfig'])
  },
  watch: {
    activeName(nv) {
      if (nv === 'index') {
        this.outputArea2.setValue(this.codeContent)
      } else {
        this.outputArea2.setValue(this.apiContent)
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions('tableConfig', [
      'setAutoConfigTable',
      'createAutoPage',
      'getAllPage',
      'delPage',
      'getPageDetail',
      'clearTableConfig'
    ]),
    ...mapActions('formFilterConfig', ['clearConfig']),
    clearConfigs() {
      this.clearTableConfig()
      this.clearConfig()
    },
    getJson() {
      this.isCreateJsonShow = true
      const prettyJson = require('pretty-object-string/lib/index')
      this.jsonContent = prettyJson(stringify(this.jsonConfig))
      this.tableJsonContent = prettyJson(stringify(this.tableJsonConfig))
    },
    async preview() {
      this.isPreviewShow = true
      const data = await this.getCode(true)
      this.$refs.preview.show(data)
    },
    async getCode(onlyData) {
      if (!onlyData) {
        this.isCreateCodeShow = true
        this.activeName = 'index'
      }
      // 请求生成代码配置
      const params = {
        pageAttrInfo: this.pageAttr,
        tableFieldInfos: this.tableJsonConfig.map((item) => ({
          ...item,
          editConfig: item.editConfig || null,
          validate: item.validate || null,
          displayBtns: item.displayBtns || null
        })),

        filterInfos: this.jsonConfig.map((item) => {
          delete item.context
          return item
        }),
        formFieldInfos: this.formJsonConfig.map((item) => {
          delete item.displayBtns
          return {
            ...item,
            editConfig: item.editConfig || { type: '', value: '' },
            validate: item.validate || {
              isRequired: false,
              requiredMsg: '',
              isValidate: false,
              validateType: '',
              validateMsg: '',
              isCustom: false,
              expression: '',
              customMsg: ''
            }
          }
        })
      }
      this.generatedParam = params
      const { status, data } = await generateSmartv(params)
      if (status === 200) {
        if (onlyData) return data
        this.codeContent = window.prettier.format(data.index.trim(), {
          plugins: window.prettierPlugins,
          parser: 'html'
        })
        this.apiContent = data.api.trim()
        this.$nextTick(() => {
          this.outputArea2 = CodeMirror.fromTextArea(
            document.getElementById('outputArea2'),
            {
              theme: 'idea', // IDEA主题
              lineNumbers: true, // 显示行号
              smartIndent: true, // 自动缩进
              autoCloseBrackets: true // 自动补全括号
            }
          )
          this.outputArea2.setSize('auto', 'auto')
        })
      }
    },
    async download() {
      await downloadSmartvCode(this.generatedParam)
    },
    // 复制代码
    copy(e) {
      const code =
        this.activeName === 'index' ? this.codeContent : this.apiContent
      const clipboard = new Clipboard(e.target, {
        text: () => code
      })
      clipboard.on('success', () => {
        this.$message({
          message: '复制成功',
          showClose: true,
          type: 'success'
        })
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
      this.isTableConfigShow = false
      this.isPageCreateShow = false
      this.isPageListShow = false
    },
    // 后端表格配置
    autoConfigTable() {
      this.isTableConfigShow = true
    },
    // 确定生成
    confirmAutoConfig() {
      this.setAutoConfigTable(this.tableAutoConfig)
      this.isTableConfigShow = false
    },
    createPage() {
      if (
        this.pageCreateConfig.needBackend === '1' &&
        (!this.pageCreateConfig.entityName ||
          !this.pageCreateConfig.packagePath)
      ) {
        this.$message({
          title: '后台创建必须提供包路径及实例名称！'
        })
        return false
      }
      this.createAutoPage(this.pageCreateConfig)
    },
    getPageList() {
      this.isPageListShow = true
      this.getAllPage()
    },
    updatePage() {},
    getDetail(page) {
      this.getPageDetail(page)
    },
    // 观看使用流程
    lookCourse() {
      this.isCourseVideoShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: flex-end;
  position: relative;
  /deep/ .el-tabs__item {
    height: 100% !important;
    line-height: inherit !important;
  }
  .video_dialog {
    /deep/ .model-content {
      width: 98% !important;
      height: 90% !important;
      max-height: 100% !important;
      top: 50px;
      display: flex;
    }
    /deep/ .dialog-body {
      display: flex;
      align-items: center;
      justify-content: center;
      .video_body {
        width: 80%;
        margin-left: auto;
        margin-right: auto;
      }
    }
  }
  .lookVideo {
    position: absolute;
    left: 10px;
    font-size: 18px;
  }
  .dialog-footer {
    padding: 30px 0 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .page-create-config {
    .row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      label {
        min-width: 150px;
        color: #606266;
        text-align: right;
        b {
          color: red;
        }
      }
    }
  }
}
</style>
