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
      <el-form-item label="操作人员" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入操作人员"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作类型" prop="operateType">
        <el-input
          v-model="queryParams.operateType"
          placeholder="请输入操作类型"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="操作时间" prop="modifyDate">
        <!-- <el-date-picker
          v-model="queryParams.modifyDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
        ></el-date-picker> -->
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleExport"
          v-hasPermi="['monitor:operlog:export']"
        >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      ref="tables"
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="操作人员" align="center" prop="username" />
      <el-table-column
        label="操作类型"
        align="center"
        prop="operateType"
      ></el-table-column>
      <el-table-column label="操作地址" align="center" prop="ip" />
      <el-table-column
        label="操作时间"
        align="center"
        prop="modifyDate"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleView(scope.row, scope.index)"
            v-hasPermi="['monitor:operlog:query']"
          >详细</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 操作日志详细 -->
    <el-dialog
      title="操作日志详情"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="操作人：">{{ form.username }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作时间：">{{
              parseTime(form.modifyDate)
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作内容：">{{
              form.operateContent
            }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import { list, delOperlog, cleanOperlog, exportList } from '@/api/monitor/operlog'
export default {
  name: 'Operlog',
  dicts: ['sys_oper_type', 'sys_common_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: { prop: 'operTime', order: 'descending' },
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        operateType: undefined,
        modifyDate: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    toDateRange(date) {
      const daterange = {}
      if (date) {
        daterange.startDate = date + ' 00:00:00'
        daterange.endDate = date + ' 23:59:59'
      }
      return daterange
    },
    /** 查询登录日志 */
    getList() {
      this.loading = true
      this.queryParams.queryStartDate = this.dateRange ? this.dateRange[0] : ''
      this.queryParams.queryEndDate = this.dateRange ? this.dateRange[1] : ''
      list({
        ...this.queryParams
        // ...this.toDateRange(this.queryParams.modifyDate)
      }).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    // 操作日志类型字典翻译
    typeFormat(row) {
      return this.selectDictLabel(
        this.dict.type.sys_oper_type,
        row.businessType
      )
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
      this.handleQuery()
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.operId)
      this.multiple = !selection.length
    },
    /** 排序触发事件 */
    handleSortChange(column) {
      this.queryParams.orderByColumn = column.prop
      this.queryParams.isAsc = column.order
      this.getList()
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true
      this.form = row
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const operIds = row.operId || this.ids
      this.$modal
        .confirm('是否确认删除日志编号为"' + operIds + '"的数据项？')
        .then(function() {
          return delOperlog(operIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$modal
        .confirm('是否确认清空所有操作日志数据项？')
        .then(function() {
          return cleanOperlog()
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('清空成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const param = {
        ...this.queryParams,
        ...this.toDateRange(this.queryParams.modifyDate)
      }
      // location.href = `http://${window.document.location.host}` + '/nine-one/log/export?' + qs.stringify(param)
      exportList(param).then(data => {
        const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '操作日志-导出' + '.xls')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      })
    }
  }
}
</script>
