<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="queryParams.username" placeholder="请输入用户名称" clearable style="width: 240px"
                      @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="手机号码" prop="cellPhone">
            <el-input v-model="queryParams.cellPhone" placeholder="请输入手机号码" clearable style="width: 240px"
                      @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width: 240px">
              <el-option v-for="dict in [
                { label: '全部', value: '' },
                { label: '启用', value: '1' },
                { label: '禁用', value: '0' },
              ]" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" @click="handleAdd" v-hasPermi="['system:user:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="showImportDialog = true" v-hasPermi="['system:user:remove']">导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" :disabled="multiple" @click="handleDeleteUsers"
                       v-hasPermi="['system:user:remove']">删除</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" stripe :data="userList" row-key="uuid" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" :reserve-selection="true" align="center" />
          <el-table-column label="用户名称" align="center" key="username" prop="username" :show-overflow-tooltip="true" />
          <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
          <!-- <el-table-column
            label="部门"
            align="center"
            key="deptName"
            prop="dept.deptName"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          /> -->
          <el-table-column label="手机号码" align="center" key="cellPhone" prop="cellPhone" />
          <el-table-column label="状态" align="center" key="status">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-value="1" inactive-value="0"
                         @change="handleStatusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createDate">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button type="text" @click="handleDetail(scope.row)" v-hasPermi="['system:user:detail']">详情</el-button>
              <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']">修改</el-button>
              <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']">删除</el-button>
              <el-button type="text" @click="handleResetPwd(scope.row)"
                         v-hasPermi="['system:user:resetPwd']">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                    @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 详情 -->
    <el-dialog :title="title" :visible.sync="detailOpen" width="600px" append-to-body :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div class="box">
        <div class="box-item" v-for="(value, key, index) in info" :key="key + index">
          <div class="box-item-label">{{ key }}</div>
          <div class="box-item-value">{{ value }}</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailOpen = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item v-if="form.userId == undefined" label="用户名称" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名称" maxlength="20"
                    :disabled="title === '修改用户' || title === '查看详情'" />
        </el-form-item>
        <el-form-item label="手机号码" prop="cellPhone">
          <el-input v-model="form.cellPhone" placeholder="请输入手机号码" maxlength="11" :disabled="title === '查看详情'" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" :disabled="title === '查看详情'" />
        </el-form-item>

        <el-form-item label="用户昵称" prop="nickName">
          <el-input auto-complete="new-password"  v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" :disabled="title === '查看详情'" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="title === '添加用户'">
          <el-input auto-complete="new-password"   v-model="form.password" placeholder="请输入密码" type="password" maxlength="18" />
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword" v-if="title === '添加用户'">
          <el-input auto-complete="new-password" v-model="form.rePassword" placeholder="请输入密码" type="password" maxlength="18" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" active-value="1" inactive-value="0" :disabled="title === '查看详情'">
          </el-switch>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="form.roles" :disabled="title === '查看详情'">
            <el-checkbox v-for="item in roleOptions" :disabled="!item.checked" :key="item.uuid" :label="item.uuid">{{
              item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" maxlength="100"
                    :disabled="title === '查看详情'"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="重置密码" :visible.sync="showEditPwd" width="600px" append-to-body>
      <ResetPwd :notOld="true" :usernameget="username" @closeDialog="closeDialog"></ResetPwd>
    </el-dialog>
    <!-- 导入反馈 -->
    <el-dialog :visible.sync="showImportResultDialog" width="600px" :close-on-click-modal="false"
               :close-on-press-escape="false" @close="showImportResultDialog = false" class="feedback">
      <div class="import-result">
        <img :src="importRes === '导入成功'
          ? require(`@/assets/img/import-success.png`)
          : require(`@/assets/img/import-fail.png`)
        " :alt="importRes" />
        <span>{{ importRes }}</span>
      </div>
      <ul class="import-fail el-scrollbar" v-if="importRes !== '导入成功'">
        <li v-for="(ele, index) in importFails" :key="index">
          <span>{{ ele }}</span>
        </li>
      </ul>
    </el-dialog>
    <!-- 导入弹窗 -->
    <el-dialog :visible.sync="showImportDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false"
               @close="showImportDialog = false" title="导入">
      <el-form :model="excelForm" class="formbox" label-width="140px" ref="importForm">
        <el-form-item label="文件上传" required>
          <el-upload ref="upload" class="uploadrouter" :action="baseUrl" :limit="1" :on-success="uploadSuccess"
                     v-hasPermi="['system:user:import']" :show-file-list="false">
            <el-button type="primary">导入</el-button>
          </el-upload>
          <span class="uploadTips" style="display: block">支持xlsx、xls格式</span>
          <a style="color: #409eff; cursor: pointer" @click="all_down">下载模板</a>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  delUsers,
  addUser,
  updateUser,
  changeUserStatus,
  getUserImportTemplate
} from '@/api/system/user'
import { listRole } from '@/api/system/role'
// import { getToken } from '@/utils/auth'
// import { treeselect } from '@/api/system/dept'
// import Treeselect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import ResetPwd from '@/views/system/user/profile/resetPwd.vue'
import md5 from 'js-md5'

export default {
  name: 'User',
  // dicts: ['sys_normal_disable',],
  components: {
    //  Treeselect,
    ResetPwd
  },
  data() {
    const newPasswordReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const reg =
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=~`_-])(?!.*\s).{8,}$/
        if (!reg.test(value)) {
          callback(new Error('密码八位以上，大小写+特殊字符+数字'))
        } else if (this.form.rePassword && value !== this.form.rePassword) {
          callback(new Error('和下面输入的密码不一致！'))
        } else {
          callback()
        }
      }
    }
    const newrePasswordReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const reg =
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=~`_-])(?!.*\s).{8,}$/
        if (!reg.test(value)) {
          callback(new Error('密码八位以上，大小写+特殊字符+数字'))
        } else if (this.form.password && value !== this.form.password) {
          callback(new Error('和上面输入的密码不一致！'))
        } else {
          callback()
        }
      }
    }
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
      // 用户表格数据
      userList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
        status: 1
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 1,
        username: undefined,
        cellPhone: undefined,
        status: undefined,
        deptId: undefined
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '用户名称长度必须介于 2 和 20 之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, validator: newPasswordReg, trigger: 'blur' }
        ],
        rePassword: [
          { required: true, validator: newrePasswordReg, trigger: 'blur' }
        ],
        // nickName: [
        //   { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        // ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        cellPhone: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },
      usernames: [], // 勾选名称
      showEditPwd: false,
      // 点击重置密码需要
      username: '',
      baseUrl: `http://${window.document.location.host}/nine-one/user/import`,
      showImportResultDialog: false,
      importRes: '',
      importFails: [],
      excelForm: {},
      fileList: [],
      showImportDialog: false,
      detailOpen: false,
      info: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.userList = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    // 用户状态修改
    handleStatusChange(row) {
      const stopUse = '0' // 启用
      const beginUse = '1' // 停用
      const text = row.status === beginUse ? '启用' : '停用'
      this.$modal
        .confirm('确认要' + text + '"' + row.username + '"用户吗？')
        .then(function() {
          return changeUserStatus({
            uuid: row.uuid,
            status: row.status,
            username: row.username
          })
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess(text + '成功')
        })
        .catch(function() {
          row.status = row.status === stopUse ? beginUse : stopUse
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        username: undefined,
        nickName: undefined,
        cellPhone: undefined,
        email: undefined,
        // sex: undefined,
        status: '1',
        remark: undefined,
        postIds: [],
        roles: []
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId)
      this.usernames = selection.map((item) => item.username)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 查询角色列表 */
    getRoleList() {
      const params = {
        userRole: true,
        username: this.form.username || ''
      }
      listRole(params).then((response) => {
        this.roleOptions = response.data.list
        this.open = true
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      getUser().then(() => {
        this.getRoleList()
        this.open = true
        this.title = '添加用户'
      })
    },
    handleDetail(row) {
      const userId = row.uuid || this.ids
      getUser(userId).then((response) => {
        const data = response.data
        const roles = data.roles
          .map((e) => {
            return e.name
          })
          .join('、')
        this.info = {
          用户名称: data.username,
          手机号码: data.cellPhone,
          邮箱: data.email,
          用户昵称: data.nickName,
          状态: data.status === '1' ? '开启' : '禁用',
          角色: roles,
          备注: data.remark
        }
        this.detailOpen = true
        this.title = '查看详情'
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const userId = row.uuid || this.ids
      getUser(userId).then((response) => {
        this.form = response.data
        this.getRoleList()
        this.form.postIds = response.postIds
        this.form.roles = response.data.roles.map((e) => {
          return e.uuid
        })
        this.title = '修改用户'
      })
    },
    /** 重置密码按钮操作 */
    async handleResetPwd(row) {
      this.showEditPwd = true
      this.username = row.username
    },
    /** 分配角色操作 */
    handleAuthRole: function(row) {
      const userId = row.userId
      this.$router.push('/system/user-auth/role/' + userId)
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.roleIds = this.form.roles
          if (this.form.uuid != undefined) {
            delete this.form.createDate
            delete this.form.modifyDate
            updateUser(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            this.form.password = md5(this.form.password)
            this.form.rePassword = md5(this.form.rePassword)
            addUser(this.form).then(() => {
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
      const username = row.username
      this.$modal
        .confirm('是否确认删除用户？')
        .then(function() {
          return delUser({ username: username })
        })
        .then(() => {
          this.queryParams.pageNum = 1
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => { })
    },
    /** 批量删除按钮操作 */
    handleDeleteUsers() {
      console.log(this.usernames)
      this.$confirm('是否确认批量删除用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delMultiUser()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async delMultiUser() {
      const { status, msgs } = await delUsers({ usernames: this.usernames })
      if (status === 200) {
        this.queryParams.pageNum = 1
        this.getList()
        this.$modal.msgSuccess('删除成功')
      } else {
        this.$message.error(msgs[Object.keys(msgs)[0]])
      }
    },
    closeDialog() {
      this.showEditPwd = false
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 导入用户
    uploadSuccess(response) {
      const { status, data, msgs } = response
      if (status === 200) {
        this.$message.success('导入成功')
        this.importRes = '导入成功'
        this.handleQuery()
        this.showImportDialog = false
      } else {
        this.importRes = '导入失败'
        this.importFails = data || [msgs[Object.keys(msgs)[0]]]
        this.showImportResultDialog = true
        // this.$message.error('导入失败，请联系管理员')
      }
      this.$refs.upload.clearFiles()
    },
    handleRemove() { },
    afterUploadSuccess() { },
    all_down() {
      // location.href =
      //   `http://${window.document.location.host}` + '/nine-one/user/template'
      getUserImportTemplate().then(data => {
        const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '用户管理-模板' + '.xls')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.import-result {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  img {
    width: 40px;
    height: 40px;
  }

  span {
    font-family: MicrosoftYaHei;
    font-size: 18px;
    font-weight: bold;
    line-height: 24px;
    color: #676b75;
    margin-top: 10px;
  }

  .el-scrollbar {
    overflow: auto;
    max-height: 100px;
  }
}

.box-item {
  width: 100%;
  display: flex;
  margin-bottom: 30px;

  &-label {
    width: 100px;
    height: 14px;
    font-size: 14px;
    text-align: left;
    color: #333333;
    font-weight: 600;
    margin-right: 20px;
  }

  &-value {
    flex: 1;
    font-size: 14px;
    text-align: left;
    color: #666666;
  }
}

.feedback {
  /deep/ .el-dialog__header {
    border-bottom: none;
  }
}
</style>
