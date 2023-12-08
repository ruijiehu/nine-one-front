
<template>
  <!-- 添加成员 -->
  <el-dialog
    title="添加成员"
    :visible.sync="memberVisible"
    width="40%"
    :before-close="memberCancel"
  >
    <el-form ref="addmember" :inline="true" @submit.native.prevent>
      <el-form-item prop="name">
        <el-input
          v-model="addmember.optionFilter"
          placeholder="请输入用户姓名、电话、邮箱等信息进行查询"
          clearable
          @keyup.enter.native="memberquery"
          style="width: 590px;"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="memberquery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange_member"
      v-loading="memberLoading"
      height="500"
      :row-key="'userId'"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true" ></el-table-column>
      <el-table-column prop="nickName" label="用户姓名"></el-table-column>
      <el-table-column prop="cellPhone" label="用户电话"></el-table-column>
      <el-table-column prop="email" label="用户邮箱" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-pagination
      class="memberPagination"
      background
      :total="total"
      :pager-count="3"
      :current-page.sync="addmember.pageNum"
      :page-size.sync="addmember.pageSize"
      @current-change="getUserOptionsExDeptFun"
      :pageSizes="['100']"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="memberCancel">取 消</el-button>
      <el-button type="primary" @click="mamberSure">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getUserOptionsExDept,
  postDeptUser
} from '@/api/system/department.js'
export default {
  props: {
    memberVisible: {
      type: Boolean,
      default: false
    },
    currentDeptId: {
      type: String,
      default: ''
    }
  },
  watch: {
    memberVisible(nv, ov) {
      if (nv) {
        this.addmember.deptId = this.currentDeptId
        this.addmember.optionFilter = ''
        this.addmember.pageNum = 1
        this.getUserOptionsExDeptFun()
      }
    }
  },
  data() {
    return {
      memberLoading: true,
      // 新增成员列表
      addmember: { optionFilter: '', deptId: '', pageNum: 1, pageSize: 10 },
      tableData: [],
      selectedRows: [],
      total: 0
    }
  },

  methods: {
    getUserOptionsExDeptFun() {
      this.memberLoading = true
      getUserOptionsExDept(this.addmember).then((res) => {
        this.memberLoading = false
        this.tableData = res.data.list
        this.total = res.data.total
      }).catch(() => {
        this.memberLoading = false
      })
    },
    memberquery() {
      this.addmember.pageNum = 1
      this.getUserOptionsExDeptFun()
    },
    memberCancel() {
      this.$emit('memberCancel')
      this.tableData = []
      this.selectedRows = []
      this.$refs.multipleTable.clearSelection()
    },
    mamberSure() {
      const errArray = this.selectedRows.map((ele) => {
        if (ele.deptId) {
          return ele
        } else {
          return ''
        }
      }).filter((ele) => ele !== '')
      if (errArray.length) {
        const name = errArray.map(item => item.nickName)
        const deptName = errArray.map((item) => item.deptName)
        const managerArray = errArray.filter(item => item.position === 'manager')
        const managerNames = managerArray.map(item => item.nickName)
        const managerDepts = managerArray.map(item => item.deptName)
        if (managerNames.length > 0) {
          this.$confirm(`‘${managerNames.join('、')}’目前担任‘${managerDepts.join('、')}’的负责人角色，请重新指定该用户所在部门的负责人后再做此操作。`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          }).catch(() => {
          })
          return
        }
        this.$confirm(`‘${name.join(',')}’目前已从属于‘${deptName.join(',')}’，若确定将该人员添加到当前部门，该人员将自动从原部门移除。`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postDeptUserFun()
        }).catch(() => {
        })
      } else {
        this.postDeptUserFun()
        // this.$emit('memberCancel')
      }
    },
    handleSelectionChange_member(val) {
      this.selectedRows = val
    },
    postDeptUserFun() {
      this.memberLoading = true
      const userIds = this.selectedRows.map((ele) => {
        return ele.userId
      })
      const param = {
        userIds: userIds,
        deptId: this.currentDeptId
      }
      postDeptUser(param).then((res) => {
        if (res.status == 200) {
          this.selectedRows = []
          this.$message({
            type: 'success',
            message: Object.values(res.msgs)[0]
          })
          this.tableData = []
          this.memberLoading = false
          this.$refs.multipleTable.clearSelection()
          this.$emit('memberCancel', true)
        } else {
          this.memberLoading = false
          this.$message.error(Object.values(res.msgs)[0])
        }
      }).catch(() => {
        this.memberLoading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .footer-dialog-box {
  margin-top: 20px;
}
.memberPagination{
  text-align:right;
  margin-top:10px;
}
</style>
<style >
 .el-message-box__content{
  max-height: 300px;
  overflow-y: auto;
}
</style>
