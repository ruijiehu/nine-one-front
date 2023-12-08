<template>
  <div class="app-container">
    <el-row class="search-form">
      <el-col :span="24">
        <el-input
          v-model="name"
          placeholder="请输入小类名称"
          clearable
          style="width: 240px;margin-right:10px"
          @keyup.enter.native="handleQuery"
        />
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableList"
      border
      height="400"
      stripe="true"
      :class="['dict-sub-table', 'dict-sub-table-center']"
    >
      <el-table-column label="小类名称" align="center" prop="name" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
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
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="小类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入小类名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input-number v-model="form.seq" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSubListItem, deleteSubDict, addSubDict, updateSubDict } from '@/api/system/dict/type'

export default {
  name: 'DictSubManage',
  props: ['dictCode', 'showDictManage'],
  data() {
    return {
      name: '',
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
      // 字典表格数据
      tableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeId: ''
      },
      // 表单参数
      form: { name: '', seq: 0 },
      // 表单校验
      rules: {
        code: [
          {
            required: true,
            message: '请输入字典编号',
            trigger: 'blur'
          }
        ],
        itemKey: [
          {
            required: true,
            message: '请输入字段值',
            trigger: 'blur'
          }
        ],
        itemValue: [
          {
            required: true,
            message: '请输入字段描述',
            trigger: 'blur'
          }
        ],
        seq: [
          {
            required: true,
            message: '请输入排序',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '请选择开启状态',
            trigger: 'blur'
          }
        ]
      },
      isEdit: false
    }
  },
  watch: {
    dictCode: {
      handler(nv, ov) {
        // nv !== ov && this.getList()
      }
    },
    showDictManage: {
      handler(nv, ov) {
        if (nv) {
          this.queryParams.typeId = this.dictCode
          this.getList()
        }
      },
      immediate: true
    }
  },
  computed: {
    dialogType() {
      return this.$store.state.settings.dialogType
    }
  },
  created() {
    // 初始化form
    this.reset()
    // this.getList()
  },
  methods: {
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryParams.name = this.name
      this.getList()
    },
    /** 查询字典类型列表 */
    getList() {
      this.loading = true
      getSubListItem(this.queryParams).then(response => {
        this.tableList = response.data.list
        this.loading = false
        this.total = response.data.total
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
        name: '',
        seq: 0
      }
      // this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.form.typeId = this.dictCode
      this.form.seq = 0
      this.open = true
      this.isEdit = false
      this.title = '添加小类'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form = JSON.parse(JSON.stringify(row))
      this.open = true
      this.isEdit = true
      this.title = '修改小类'
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            updateSubDict(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addSubDict(this.form).then(() => {
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
      const delJson = { uuids: [row.uuid] }
      this.$modal.confirm('是否确认删除？').then(function() {
        return deleteSubDict(delJson)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.search-form {
  margin: 0 0 20px;
}
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
.dict-sub-table {
  overflow-y: auto;
  /deep/ .el-table__body-wrapper {
    overflow-y: auto;
  }
  &::before {
    height: 0;
    background: transparent;
  }
}
.dict-sub-table-center {
  height: 400px;
  /deep/ .el-table__row{
    height: auto;
  }
}
.dict-sub-table-right {
  height: 720px;
}
</style>
