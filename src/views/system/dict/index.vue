<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="大类名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入大类名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"       @click="handleQuery">搜索</el-button>
        <el-button    @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary" @click="handleAdd"
          v-hasPermi="['system:dict:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange" border>
      <el-table-column label="大类名称" align="center" prop="name" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="500">
        <template slot-scope="scope">
          <el-button type="text" @click="handleManage(scope.row)">管理小类</el-button>
          <el-button
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']"
          >修改</el-button>
          <el-button
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="大类编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入大类编号" :disabled="title==='修改大类' " maxlength="20" />
        </el-form-item> -->
        <el-form-item label="大类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入大类名称" maxlength="20" />
        </el-form-item>
        <!-- <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" placeholder="请输入大类备注" type="textarea"  maxlength="100" show-word-limit />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 管理大类子项-->
    <el-dialog
      title="小类管理"
      :visible.sync="showDictManage"
      direction="rtl"
      :close-on-click-modal="false" :close-on-press-escape="false"
      :before-close="closeSubDialog">
      <dict-sub-manage :dictCode="subCodeId" :showDictManage=showDictManage ref="refdictsub"></dict-sub-manage>
    </el-dialog>
  </div>
</template>

<script>
import { listType, delType, addType, updateType, refreshCache } from '@/api/system/dict/type'
import DictSubManage from './dict-sub-manage.vue'

export default {
  name: 'Dict',
  components: { DictSubManage },
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 大类表格数据
      typeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        code: '',
        status: undefined
      },
      dictFormData: {
        code: '',
        itemKey: '',
        itemValue: ''
      },
      // 表单参数
      form: {
        name: '',
        uuid: ''
      },
      // 表单校验
      rules: {
        code: [
          {
            required: true,
            message: '请输入大类编号',
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '大类名称不能为空', trigger: 'blur' }
        ]
      },
      dictFormRules: {
        code: [
          {
            required: true,
            message: '请输入大类编号',
            trigger: 'blur'
          }
        ],
        itemKey: [
          {
            required: true,
            message: '请输入字段名称',
            trigger: 'blur'
          }
        ],
        itemValue: [
          {
            required: true,
            message: '请输入字段值',
            trigger: 'blur'
          }
        ]
      },
      isEdit: false,
      showDictManage: false,
      subCodeId: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询大类类型列表 */
    getList() {
      this.loading = true
      listType(this.queryParams).then(response => {
        this.typeList = response.data.list
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
        remark: undefined
      }
      this.resetForm('form')
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
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.isEdit = false
      this.title = '添加大类类型'
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form = JSON.parse(JSON.stringify(row))
      this.open = true
      this.isEdit = true
      this.title = '修改大类'
    },
    handleManage(row) {
      this.showDictManage = true
      this.subCodeId = row.uuid
      // this.$refs.refdictsub.getList()
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            updateType(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addType(this.form).then(() => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const delJson = {
        uuids: [row.uuid]
      }
      this.$modal.confirm('是否确认删除？').then(function() {
        return delType(delJson)
      }).then(() => {
        this.queryParams.pageNum = 1
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/dict/type/export', {
        ...this.queryParams
      }, `type_${new Date().getTime()}.xlsx`)
    },
    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.$modal.msgSuccess('刷新成功')
      })
    },
    addDictItem(index) {
      this.dictFormData.formListItems.splice(index + 1, 0, {
        code: '',
        itemKey: '',
        itemValue: ''
      })
    },
    removeDictItem(index) {
      this.dictFormData.formListItems.splice(index, 1)
    },
    closeSubDialog() {
      this.showDictManage = false
      // this.$refs.subDialogForm.resetFields()
    },
    saveSubDict() {
      // const saveSubListItem
      // this.$refs.subDialogForm.validate(valid => {
      //   if (valid) {

      //   }
      // })
    }
  }
}
</script>

<style lang="less" scoped>
  .custom-add-btn {
    margin-left: 10px;
  }
  .custom-delete-btn {
    margin-left: 12px;
  }
  .add-circle {
    font-size: 28px;
  }
  .delete {
    font-size: 24px;
    color: #333;
  }
  .dialog-btns {
    .el-button {
      margin: 0 10px;
    }
  }
  .desContent{
    overflow: hidden;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
</style>
