<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入表名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="请输入表描述"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button type="primary" @click="handleGenTable()">生成</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button type="primary" @click="openImportTable">导入</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button type="primary" :disabled="single" @click="handleEditTable"
          >修改</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button type="primary" :disabled="multiple" @click="handleDelete"
          >删除</el-button
        >
      </el-col> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableList"

    >
      <!-- <el-table-column
        type="selection"
        align="center"
        width="55"
      ></el-table-column> -->
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="表名称"
        align="center"
        prop="tableName"
        :show-overflow-tooltip="true"
        width="220"
      >
        <template slot-scope="scope">
          <span style="padding-right: 10px">{{ scope.row.tableName }}</span>
          <el-tag v-if="scope.row.configured" size="mini">{{
            "已配置"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="表描述"
        align="center"
        prop="comments"
        :show-overflow-tooltip="true"
        width="120"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createDate"
        width="240"
      />
      <el-table-column
        label="更新时间"
        align="center"
        prop="createDate"
        width="240"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handlePreview(scope.row)"
          >预览</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="handleEditTable(scope.row)"
          >编辑</el-button
          >
          <!-- <el-button
            type="text"
            size="small"

            @click="handleDelete(scope.row)"
            v-hasPermi="['tool:gen:remove']"
            >删除</el-button
          > -->
          <!-- <el-button
            type="text"
            size="small"
            icon="el-icon-refresh"
            @click="handleSynchDb(scope.row)"
            v-hasPermi="['tool:gen:edit']"
            >同步</el-button
          > -->
          <el-button type="text" size="small" @click="handleGenTable(scope.row)"
          >生成代码</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total || 0"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 预览界面 -->
    <el-dialog
      :title="preview.title"
      :visible.sync="preview.open"
      width="80%"
      top="5vh"
      append-to-body
      class="scrollbar"
    >
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
          v-for="(value, key) in preview.data"
          :label="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
          :name="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
          :key="key"
        >
          <el-link
            :underline="false"
            icon="el-icon-document-copy"
            v-clipboard:copy="value"
            v-clipboard:success="clipboardSuccess"
            style="float: right"
          >复制</el-link
          >
          <pre><code class="hljs" v-html="highlightedCode(value, key)"></code></pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <import-table ref="import" @ok="handleQuery" />

    <PreviewDialog ref="preview" />
  </div>
</template>

<script>
import {
  listTable,
  delTable,
  genCodes,
  synchDb,
  downloadCode
} from '@/api/tool/gen'
import importTable from './importTable'
import hljs from 'highlight.js/lib/highlight'
import 'highlight.js/styles/github-gist.css'
import PreviewDialog from '@/components/PreviewDialog'
hljs.registerLanguage('java', require('highlight.js/lib/languages/java'))
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
hljs.registerLanguage('html', require('highlight.js/lib/languages/xml'))
hljs.registerLanguage('vue', require('highlight.js/lib/languages/xml'))
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
)
hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'))

export default {
  name: 'Gen',
  components: { importTable, PreviewDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 唯一标识符
      uniqueId: '',
      // 选中数组
      ids: [],
      // 选中表数组
      tableNames: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表数据
      tableList: [],
      // 日期范围
      dateRange: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tableName: undefined,
        tableComment: undefined
      },
      // 预览参数
      preview: {
        open: false,
        title: '代码预览',
        data: {},
        activeName: 'domain.java'
      }
    }
  },
  created() {
    this.getList()
  },
  activated() {
    const time = this.$route.query.t
    if (time != null && time != this.uniqueId) {
      this.uniqueId = time
      this.queryParams.pageNum = Number(this.$route.query.pageNum)
      this.getList()
    }
  },
  methods: {
    /** 查询表集合 */
    getList() {
      this.loading = true
      listTable().then((response) => {
        this.tableList = response.data
          .filter((item) => item.configured)
          .concat(response.data.filter((item) => !item.configured))
        this.cacheTableList = [...this.tableList]
        this.total = response.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      console.log(1)
      this.queryParams.pageNum = 1
      this.filterList()
    },
    filterList() {
      const { tableName, tableComment } = this.queryParams
      console.log(tableName, tableComment)
      this.tableList = this.cacheTableList.filter(item => {
        let flag = true
        if (tableName !== '' && tableName !== undefined) {
          flag = item.tableName.includes(tableName)
        }
        if (tableComment !== '' && tableComment !== undefined) {
          flag = item.comments.includes(tableComment)
        }
        console.log(flag)
        return flag
      })
    },
    /** 生成代码操作 */
    handleGenTable(row) {
      const tableNames = row ? [row.tableName] : this.tableNames
      if (tableNames && tableNames.length) {
        for (const tableName of tableNames) {
          downloadCode(tableName)
        }
      }
      if (!row) {
        this.tableNames = []
      }
    },
    /** 同步数据库操作 */
    handleSynchDb(row) {
      const tableName = row.tableName
      this.$modal
        .confirm('确认要强制同步"' + tableName + '"表结构吗？')
        .then(function() {
          return synchDb(tableName)
        })
        .then(() => {
          this.$modal.msgSuccess('同步成功')
        })
        .catch(() => {})
    },
    /** 打开导入表弹窗 */
    openImportTable() {
      this.$refs.import.show()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 预览按钮 */
    async handlePreview(row) {
      const { data } = await genCodes(row.tableName)
      this.$refs.preview.show(data)
    },

    /** 高亮显示 */
    highlightedCode(code, key) {
      const vmName = key.substring(
        key.lastIndexOf('/') + 1,
        key.indexOf('.vm')
      )
      var language = vmName.substring(vmName.indexOf('.') + 1, vmName.length)
      const result = hljs.highlight(language, code || '', true)
      return result.value || '&nbsp;'
    },
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$modal.msgSuccess('复制成功')
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.tableId)
      this.tableNames = selection.map((item) => item.tableName)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleEditTable(row) {
      const tableName = row.tableName || this.tableNames[0]

      this.$router.push({ path: '/tool/gen-edit/index', query: { tableName }})
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const tableIds = row.tableId || this.ids
      this.$modal
        .confirm('是否确认删除表编号为"' + tableIds + '"的数据项？')
        .then(function() {
          return delTable(tableIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    }
  }
}
</script>
