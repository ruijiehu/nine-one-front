<template>
  <el-card>
    <div class="panel panel-default" id="rrapp" v-cloak>
      <div class="panel-heading">
        表名称：{{ this.generatorInfo.tableName }}
      </div>
      <div style="padding: 10px 0 20px 10px">
        <el-form
          ref="form"
          :inline="true"
          :model="generatorInfo"
          label-width="100px"
        >
          <hr />
          <h4>后端配置:</h4>
          <el-form-item label="基础框架">
            <el-select v-model="generatorInfo.frame">
              <el-option label="nami" value="NAMI"></el-option>
              <el-option label="sanji" value="SANJI"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="generatorInfo.authorName"></el-input>
          </el-form-item>
          <el-form-item label="包名">
            <el-input v-model="generatorInfo.packageName"></el-input>
          </el-form-item>
          <el-form-item label="忽略前缀">
            <el-input v-model="generatorInfo.ignorePrefix"></el-input>
          </el-form-item>
          <el-form-item label="对象名称(默认为表名)">
            <el-input v-model="generatorInfo.className"></el-input>
          </el-form-item>
          <el-form-item label="请求路径(默认为表名)">
            <el-input v-model="generatorInfo.requestPath"></el-input>
          </el-form-item>
          <el-form-item label="输入类型">
            <el-select v-model="generatorInfo.dataType">
              <el-option label="DDL SQL" value="SQL"></el-option>
              <el-option label="JSON" value="JSON"></el-option>
            </el-select>
          </el-form-item>
          <hr />
          <h4>前端配置:</h4>

          <el-table
            ref="dragTable"
            :data="generatorInfo.fields"
            row-key="columnId"
          >
            <!--                <el-table-column label="序号" type="index" min-width="5%" class-name="allowDrag" />-->
            <el-table-column label="字段名" min-width="10%">
              <template slot-scope="scope">
                <el-input v-model="scope.row.columnName"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              min-width="10%"
              label="字段类型"
              prop="columnType"
            ></el-table-column>
            <el-table-column label="字段描述" min-width="10%">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fieldComment"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="插入" min-width="5%">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.isInsert"
                  :disabled="_disabled(scope.row)"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="编辑" min-width="5%">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.isEdit"
                  :disabled="_disabled(scope.row)"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="列表" min-width="5%">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isList"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="查询" min-width="5%">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isQuery"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="查询方式" min-width="10%">
              <template slot-scope="scope">
                <el-select v-model="scope.row.queryType">
                  <el-option label="=" value="EQ"></el-option>
                  <el-option label="!=" value="NE"></el-option>
                  <el-option label=">" value="GT"></el-option>
                  <el-option label=">=" value="GTE"></el-option>
                  <el-option label="<" value="LT"></el-option>
                  <el-option label="<=" value="LTE"></el-option>
                  <el-option label="LIKE" value="LIKE"></el-option>
                  <el-option label="BETWEEN" value="BETWEEN"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="必填" min-width="5%">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isRequired"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="显示类型" min-width="12%">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.htmlType"
                  :disabled="_disabled(scope.row)"
                >
                  <el-option label="文本框" value="input"></el-option>
                  <el-option label="文本域" value="textarea"></el-option>
                  <el-option label="下拉框" value="select"></el-option>
                  <el-option label="单选框" value="radio"></el-option>
                  <el-option label="复选框" value="checkbox"></el-option>
                  <el-option label="日期控件" value="datetime"></el-option>
                  <el-option label="图片上传" value="imageUpload"></el-option>
                  <el-option label="文件上传" value="fileUpload"></el-option>
                  <el-option label="富文本控件" value="editor"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="字典类型" min-width="12%">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.dictCode"
                  :disabled="_disabledDictCode(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <hr />

          <!--generate button-->
          <el-button type="primary" icon="el-icon-caret-right" @click="generate"
          >生成</el-button
          >

          <el-button type="primary" icon="el-icon-document-copy"  v-clipboard:value='outputStr' v-clipboard:success='copy'
          >复制</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-document-copy"
            @click="download"
          >下载</el-button
          >
          <el-button type="primary" @click="saveGeneratorInfo"
          >保存配置</el-button
          >
          <el-button type="primary"  @click="handlePreview"
          >预览</el-button
          >
          <span v-if="historicalData.length > 0">
            <el-button-group>
              <el-button type="primary" disabled round>历史记录</el-button>
              <span v-for="(item, index) in historicalData" :key="index">
                <el-button @click="switchHistoricalData">{{ item }}</el-button>
              </span>
            </el-button-group>
          </span>
          <hr />
          <!--templates area-->
          <el-form ref="form" inline label-width="100px">
            <div v-for="(item, index) in templates" :key="index">
              <el-button-group style="margin-bottom: 10px">
                <el-button type="primary" disabled>{{ item.group }}</el-button>
                <span
                  v-for="(childItem, index) in item.templates"
                  :key="index"
                  style="margin-left: 10px"
                >
                  <el-button @click="setOutputModel">{{
                    childItem.name
                  }}</el-button>
                </span>
              </el-button-group>
            </div>
          </el-form>
          <hr />
          <!-- output area-->
          <el-form-item label="输出区域">
            <textarea
              id="outputArea"
              placeholder="请输入表结构信息..."
              style="height: 250px;"
              v-model="outputStr"
            ></textarea>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <PreviewDialog ref="preview" />
  </el-card>
</template>

<script>
import CodeMirror from '@/utils/codemirror/codemirror.min.js'
import '@/utils/codemirror/codemirror.min.css'
import axios from '@/utils/request'
// import jszip from 'jszip'
// import fileSaver from 'file-saver'
import { downloadCode, genCodes } from '@/api/tool/gen'
import PreviewDialog from '@/components/PreviewDialog'
// 后端自动生成的字段  前端不能够进行插入和编辑操作
const HOUDUAN_AUTO_FIELDS = {
  create_date: { htmlType: 'input', isEdit: false, isInsert: false },
  modify_date: { htmlType: 'input', isEdit: false, isInsert: false },
  deleted_flag: { htmlType: 'input', isEdit: false, isInsert: false }
}
const LOCALSTORYAGE_TBL_GENERATOR_KEY = 'TBL_GENERATOR'
export default {
  async beforeRouteLeave(to, from, next) {
    if (!this.isConfigChange()) next()
    else {
      try {
        await this.$confirm('是否保存修改？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        })
        this.saveGeneratorInfo()
        next()
      } catch (error) {
        next()
      }
    }
  },
  components: { PreviewDialog },
  data() {
    return {
      HOUDUAN_AUTO_FIELDS,
      inputArea: null,
      outputArea: null,
      generatorInfo: {
        dataType: '',
        frame: 'NAMI',
        authorName: '',
        packageName: '',
        ignorePrefix: 'tbl_',
        className: '',
        requestPath: '',
        // 前端字段配置
        fields: [],
        tableSql: 'string',
        dictCodes: []
      },
      templates: [{}],
      historicalData: [],
      currentSelect: 'controller',
      outputStr: '',
      outputJson: {},
      test: {
        authorName: 'string', // 作者名称
        className: 'string',
        dataType: 'SQL',
        fields: [
          {
            columnName: 'string', // 前端使用
            columnType: 'string', // 数据库字段类型
            dictCode: 'string', // 字典code 使用方法未知
            fieldClass: 'string', // 未知
            fieldComment: 'string', // 字段描述 例如列表 表单中的中文描述
            fieldName: 'string', // 前端无用  后端会根据columnName转化填入fieldName 在模板中使用该字段作为属性名
            frameFlag: true, // 如果为true表示该字段为后端字段，在前端中不展示
            htmlType: 'string', // 表单类型
            isEdit: true, // 该字段是否可以编辑
            isInsert: true, // 在创建时是否要传递改参数
            isList: true, // 是否展示在列表中
            isQuery: true, // 是否展示在查询参数中
            isRequired: true, // 表单是否必填
            queryType: 'string', // 查询方式
            swaggerClass: 'string' // 未知
          }
        ],
        frame: 'NAMI',
        ignorePrefix: 'string',
        originTableName: null,
        packageName: 'string',
        requestPath: 'string', // 前端请求路径
        tableComment: 'string',
        tableName: 'string',
        tableSql: null
      }
    }
  },

  created: function() {
    // 获取代码生成的历史记录
    // this.historicalData=JSON.parse(localStorage.getItem(LOCALSTORYAGE_TBL_GENERATOR_KEY)||'[]');
    // load all templates for selections 加载所有模板供选择
    axios.get('/generator/template/all').then((res) => {
      this.templates = res.data
    })
    // 加载表的配置
    axios
      .get('generator/table/config', {
        params: { tableName: this.$route.query.tableName }
      })
      .then((res) => {
        const fieldsList = res.data.fields.map((item) => {
          if (HOUDUAN_AUTO_FIELDS[item.columnName]) {
            item = { ...item, ...HOUDUAN_AUTO_FIELDS[item.columnName] }
          }

          return item
        })
        this.generatorInfo = res.data

        this.generatorInfo.fields = fieldsList.filter(function(item) {
          return !item.frameFlag
        })

        // 记录刚进页面从服务器获取到的配置
        this.stringfyGeneratorInfo = JSON.stringify(this.generatorInfo)
        this.cacheHref = document.location.href
      })
  },
  mounted() {
    this.init()

    window.onbeforeunload = (e) => {
      if (this.isConfigChange()) {
        e.returnValue = '确定离开当前页面吗？'
      }
    }
  },
  beforeDestroy() {
    window.onbeforeunload = null
  },
  updated: function() {},
  methods: {
    /** 预览按钮 */
    async handlePreview() {
      const { data } = await genCodes(this.generatorInfo)
      this.$refs.preview.show(data)
    },
    isConfigChange() {
      const nowConfig = JSON.stringify(this.generatorInfo)
      return nowConfig !== this.stringfyGeneratorInfo
    },
    saveGeneratorInfo() {
      // eslint-disable-next-line no-unused-vars
      axios.put('/generator/table/config', this.generatorInfo).then((res) => {
        this.$message.success('保存配置成功')
        this.stringfyGeneratorInfo = JSON.stringify(this.generatorInfo)
      })
    },
    init() {
      // this.inputArea = CodeMirror.fromTextArea(
      //   document.getElementById("inputArea"),
      //   {
      //     mode: "text/x-sql", // SQL
      //     theme: "idea", // IDEA主题
      //     lineNumbers: true, //显示行号
      //     smartIndent: true, // 自动缩进
      //     autoCloseBrackets: true, // 自动补全括号
      //   }
      // );

      // this.inputArea.setSize("auto", "auto");

      // init output code area
      this.outputArea = CodeMirror.fromTextArea(
        document.getElementById('outputArea'),
        {
          theme: 'idea', // IDEA主题
          lineNumbers: true, // 显示行号
          smartIndent: true, // 自动缩进
          autoCloseBrackets: true // 自动补全括号
        }
      )
      this.outputArea.setSize('auto', 'auto')
    },
    // set the template for output 选择页面输出的模板类型
    setOutputModel: function(event) {
      const targetModel = event.target.innerText.trim()
      this.currentSelect = targetModel
      if (this.outputStr.length > 30) {
        this.outputStr = this.outputJson[targetModel]
        this.outputArea.setValue(this.outputStr.trim())
        this.outputArea.setSize('auto', 'auto')
      }
    },
    // switch HistoricalData
    switchHistoricalData: function(event) {
      const tableName = event.target.innerText.trim()
      if (window.localStorage) {
        const valueSession = localStorage.getItem(tableName)
        this.outputJson = JSON.parse(valueSession)
        alert('切换历史记录成功:' + tableName)
      } else {
        alert('浏览器不支持sessionStorage')
      }
      this.outputStr = this.outputJson[this.currentSelect].trim()
      this.outputArea.setValue(this.outputStr)
      this.outputArea.setSize('auto', 'auto')
    },
    setHistoricalData: function(tableName) {
      // add new table only
      if (this.historicalData.indexOf(tableName) < 0) {
        this.historicalData.unshift(tableName)
      }
      // remove last record , if more than N
      if (this.historicalData.length > 9) {
        this.historicalData.splice(9, 1)
      }
      // get and set to session data
      const valueSession = localStorage.getItem(tableName)
      // remove if exists
      if (valueSession !== undefined && valueSession != null) {
        localStorage.removeItem(tableName)
      }
      // set data to session
      localStorage.setItem(
        LOCALSTORYAGE_TBL_GENERATOR_KEY,
        JSON.stringify(this.outputJson)
      )
      // console.log(this.historicalData);
    },
    // request with  to generate the code 根据参数生成代码
    generate: function() {
      console.log(JSON.parse(JSON.stringify(this.generatorInfo)))
      axios.post('/generator/code/generate', this.generatorInfo).then((res) => {
        console.log('生成成功')
        if (res.code === 500) {
          // error('生成失败')
          this.$message.error('生成失败')
          return
        }
        // setAllCookie();
        this.outputJson = res.data
        // console.log(this.outputJson["bootstrap-ui"]);
        this.outputStr = this.outputJson[this.currentSelect].trim()
        // console.log(this.outputJson["bootstrap-ui"]);
        this.outputArea.setValue(this.outputStr)
        this.outputArea.setSize('auto', 'auto')
        // this.setHistoricalData(res.data.tableName);
        this.$message.success('生成成功')
      })
    },
    download: function() {
      downloadCode(this.generatorInfo)
    },
    copy: function() {
      this.$message.success('复制成功')
    },
    _disabled(row) {
      return !!HOUDUAN_AUTO_FIELDS[row.columnName]
    },
    _disabledDictCode(row) {
      return !['select', 'radio', 'checkbox'].includes(row.htmlType)
    }
  }
}
</script>
