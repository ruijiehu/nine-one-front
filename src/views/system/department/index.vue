<template>
  <div class="wrapper">
    <div class="left">
      <Tree
        @getCurrNode="onCurrNode"
        :current-node-key="currentDeptId"
        :defaultExpandedKeys="defaultExpandedKeys"
        :data="tree"
        @click="onNodeClick"
        @newDepart="newDepart"
        :loading="loading"
        :props="{
          nodeKey: 'uuid',
          children: 'children',
          label: 'deptName',
          deptCode: 'deptCode',
          parentId: 'parentId',
          deptType: 'deptType',
          sortNo: 'sortNo',
          deptLevel: 'deptLevel',
        }"
      ></Tree>
    </div>
    <div class="right">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tab_container">
        <el-tab-pane label="部门详情" name="first"></el-tab-pane>
        <el-tab-pane :label="'部门成员（'+total+'）'" name="second"></el-tab-pane>
      </el-tabs>
      <div class="top_btn">
        <el-button
          type="primary"
          class="operatebtn"
          @click="delDepart"
          v-hasPermi="['system:dept:del']"
        >删除</el-button>
        <el-button
          type="primary"
          class="operatebtn"
          @click="newDepart('kid',)"
          v-hasPermi="['system:dept:add_inner']"
        >新增子部门</el-button>
      </div>
      <div class="card_right">
        <div class="depart_info" v-show="activeName==='first'">
          <div class="operatebtn_box">
            <el-button
              type="primary"
              class="operatebtn"
              @click="depertInfoClick"
              v-hasPermi="['system:dept:edit']"
            >{{ editLabel?'编辑':'保存' }}</el-button>

          </div>
          <el-form label-width="100px" ref="formLabelAlign" :model="formLabelAlign" v-loading="editDeptLoading" :rules="addDeptRules">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="formLabelAlign.deptName" :disabled="editLabel"></el-input>
            </el-form-item>
            <el-form-item label="部门编号">
              <el-input v-model="formLabelAlign.deptCode" :disabled="editLabel"></el-input>
            </el-form-item>
            <el-form-item label="部门负责人" prop="deptManager" v-loading='changeUserLoading'>
              <div v-if="!setManager" class="setManager"></div>
              <el-select ref="deptManagerBlur" v-model="formLabelAlign.deptManager" placeholder="请选择" style="width:100%" :disabled="editLabel" filterable @change="deptManagerChange" >
                <el-option
                  v-for="item in userList"
                  :key="item.uuid"
                  :label="item.nickName||' '"
                  :value="item.uuid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上级部门"  style="position: relative;" :prop="editDeptRoot?'':'parentName'">
              <el-input v-model="formLabelAlign.parentName" @focus="parentNameFocus" placeholder="请选择上级部门" :disabled="editLabel||editDeptRoot"></el-input>
              <div v-show="showChooseDept" class="depertmentLine_box" @click="showChooseDept=false">
                <el-tree
                  class="depertmentLine_detail"
                  :default-expand-all="true"
                  :data="tree"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  @node-click="handleNodeClick_deatil"
                  :current-node-key="currentDeptId"
                >
                  <span
                    slot-scope="{ node, data }"
                    class="custom_tree_node_title"
                  >{{ data[defaultProps.label] }}</span>
                </el-tree>
              </div>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" :rows="4" v-model="formLabelAlign.remark" :disabled="editLabel"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="depart_member" v-show="activeName==='second'">
          <div>
            <el-form :model="queryParams" ref="queryForm" :inline="true" @submit.native.prevent>
              <el-form-item prop="filter">
                <el-input
                  v-model="queryParams.filter"
                  placeholder="请输入用户姓名、电话或所属部门"
                  clearable
                  style="width: 280px"
                  @keyup.enter.native="getDeptUserFun({},'1')"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getDeptUserFun({},'1')">搜索</el-button>
              </el-form-item>
              <el-form-item style="float: right;">
                <el-button :disabled="!multipleSelection.length" @click="delMember('all')" v-hasPermi="['system:dept:delmember']">移除成员</el-button>
                <el-button type="primary" @click="addNewMember" v-hasPermi="['system:dept:addmember']">新增成员</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData_user"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            v-loading='MemberLoading'
            :row-key="'userId'"
          >
            <el-table-column type="selection" width="55" align="center" :reserve-selection="true" ></el-table-column>
            <el-table-column label="用户姓名" width="200">
              <template slot-scope="scope">{{ scope.row.nickName }}</template>
            </el-table-column>
            <el-table-column prop="cellPhone" label="用户电话" width="200"></el-table-column>
            <el-table-column prop="deptName" label="所属部门"></el-table-column>
            <el-table-column prop="positionName" label="部门角色" show-overflow-tooltip width="120"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
              <template slot-scope="scope">
                <el-button type="text" v-hasPermi="['system:dept:delmember']" @click="delMember('single', scope.row.uuid)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getDeptUserFun"
          />
        </div>
      </div>
    </div>
    <!-- 新增部门 -->
    <el-dialog title="新增部门" :visible.sync="departVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" >
      <el-form ref="departform" :model="departform" label-width="100px" :rules="addDeptRules" >
        <el-form-item label="部门名称:" prop="deptName">
          <el-input v-model="departform.deptName"></el-input>
        </el-form-item>
        <el-form-item label="上级部门:" style="position: relative;" prop="parentName">
          <el-input v-model="departform.parentName" @focus="parentNameFocus_add" placeholder="请选择上级部门" :disabled="disableChangeDept"></el-input>
          <div v-show="showChooseDept_add" class="depertmentLine_box_add" @click="showChooseDept_add=false">
            <el-tree
              class="depertmentLine"
              :default-expand-all="true"
              :data="tree"
              :props="defaultProps"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              :current-node-key="currentNodeKey_dept"
            >
              <span
                slot-scope="{ node, data }"
                class="custom_tree_node_title"
              >{{ data[defaultProps.label] }}</span>
            </el-tree>
          </div>
        </el-form-item>
        <el-form-item label="部门负责人:" prop="deptManager">
          <el-select v-model="departform.deptManager" placeholder="请选择部门负责人" style="width:100%;" filterable @change="deptManagerChange" >
            <el-option
              v-for="item in userList"
              :key="item.uuid"
              :label="item.nickName||' '"
              :value="item.uuid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="departform.remark" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button type="primary" @click="departSubmit" :loading="addDeptLoading">保存</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <addMember
      :memberVisible="memberVisible"
      :currentDeptId="currentDeptId"
      @memberCancel="handleClose_member"
    ></addMember>
  </div>
</template>

<script>
import {
  getDeptTree,
  getDeptList,
  getDeptDetail,
  getDeptUser,
  addDept,
  getByUser,
  delDept,
  updateDept,
  delDeptUser
} from '@/api/system/department.js'
import { listUser } from '@/api/system/user'
import Tree from './Tree/index'
import addMember from './addmember.vue'
export default {
  data() {
    return {
      defaultExpandedKeys: [],
      rootDept: {},
      editDeptRoot: true,
      // 当前选择的节点负责人是否为账号本人
      currIsLeader: false,
      tree: [],
      loading: false,
      id: '1',
      activeName: 'first',
      tableData_user: [],
      multipleSelection: [],
      // 部门详情
      formLabelAlign: {
        deptName: '',
        deptCode: '',
        deptManager: '',
        parentName: '',
        remark: ''
      },
      editDeptLoading: false,
      userList: [],
      value: '',
      editLabel: true,
      // 部门成员列表搜索条件
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        filter: undefined
      },
      // 新增部门
      departform: {
        deptName: '',
        deptManager: '',
        remark: '',
        parentId: '',
        parentName: ''
      },
      addDeptRules: {
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '请选择上级部门', trigger: 'blur' }
        ],
        deptManager: [
          { required: true, message: '请选择部门负责人', trigger: 'change' }
        ]
      },
      departVisible: false,
      memberVisible: false,
      total: 0,
      currentDeptId: null,
      currentDeptName: null,
      // 新增部门的弹窗
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      addDeptLoading: false,
      showChooseDept: false,
      showChooseDept_add: false,
      currentNodeKey_dept: '',
      currentNodeKey_deptName: '',
      disableChangeDept: false,
      // 编辑部门详情时候，修改部门负责人，添加loading，防止接口太慢
      changeUserLoading: false,
      MemberLoading: false,
      // 设置负责人的权限标识
      setManager: false
    }
  },

  components: { Tree, addMember },
  created() {
    this.getTree()
    this.getList()
  },
  mounted() {
    const managestr = 'system:dept:manager'
    if (this.$store.getters.permissions.includes(managestr)) {
      this.setManager = true
    } else {
      this.setManager = false
    }
  },
  methods: {
    onCurrNode(node) {},
    /** 查询用户列表 */
    getList() {
      listUser().then((response) => {
        this.userList = response.data.list
      })
    },
    getTree(val) {
      this.loading = true
      getDeptTree().then((res) => {
        this.loading = false
        this.tree = res.data
        // this.id = String(res.data[0].uuid)
        this.rootDept = res.data[0]
        if (val === 'edit') {
          return
        }
        // // 默认节点选择
        this.queryParams.parentId = res.data[0] && res.data[0].uuid
        // if (!this.currentDeptId) {
        this.currentDeptId = res.data[0] && res.data[0].uuid
        // }
        // 点击新增部门所需默认
        this.currentNodeKey_dept = res.data[0] && res.data[0].uuid
        this.currentNodeKey_deptName = res.data[0] && res.data[0].deptName
        // 点击新增子部门、两个字段不同，是因为新增子部门按钮和新增部门按钮点击的时候，弹窗打开的时候默认显示的上级部门不同
        this.currentDeptId = res.data[0] && res.data[0].uuid
        this.currentDeptName = res.data[0] && res.data[0].deptName
        this.queryParams.pageNum = 1
        this.getDeptDetailFun(res.data[0])
        this.getDeptUserFun(res.data[0])
        this.$refs.multipleTable.clearSelection()
      })
    },
    onNodeClick(v) {
      // this.id = v.uuid
      this.queryParams.pageNum = 1
      this.queryParams.parentId = v.uuid
      this.queryParams.filter = ''
      this.currentDeptId = v.uuid
      this.currentDeptName = v.deptName
      this.getDeptDetailFun(v)
      this.getDeptUserFun(v)
      this.editLabel = true
      this.editDeptRoot = true
      this.$refs.formLabelAlign.clearValidate()
      this.$refs.multipleTable.clearSelection()
    },
    // 获取部门下的部门详情
    getDeptDetailFun(v) {
      getDeptDetail(v.uuid).then((res) => {
        this.formLabelAlign = res.data
        // 根节点返回了null，为了不显示placeholder
        this.formLabelAlign.parentName = res.data.parentName ? res.data.parentName : ' '
      })
    },
    // 获取部门下的部门成员列表
    getDeptUserFun(v, page) {
      if (page) {
        this.queryParams.pageNum = page
      }
      this.MemberLoading = true
      getDeptUser(this.queryParams).then((res) => {
        this.tableData_user = res.data.list
        this.total = res.data.total
        this.MemberLoading = false
      }).catch(() => {
        this.MemberLoading = false
      })
    },
    handleClick() {},
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleQuery() {},
    handleClose() {
      this.departform = {
        deptName: '',
        deptManager: '',
        remark: '',
        parentId: '',
        parentName: ''
      },
      this.$refs.departform.clearValidate()
      this.departVisible = false
    },
    // 确认修改部门详情
    depertInfoClick() {
      if (this.rootDept.uuid == this.currentDeptId) {
        this.editDeptRoot = true
      } else {
        this.editDeptRoot = false
      }
      if (this.editLabel) {
        this.editLabel = false
      } else {
        this.$refs['formLabelAlign'].validate((valid) => {
          if (valid) {
            this.editDeptLoading = true
            updateDept(this.formLabelAlign).then((res) => {
              this.editDeptLoading = false
              if (res.status == 200) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.getTree('edit')
                this.defaultExpandedKeys = [this.currentDeptId]
                // 为了在操作完编辑后，直接点击新增子部门，默认添加子部门弹窗中的上级部门名称为新修改的值
                this.currentDeptName = this.formLabelAlign.deptName
                this.getDeptUserFun(this.currentDeptId)
              }
              this.editLabel = true
              this.editDeptLoading = false
            }).catch(() => {
              this.editDeptLoading = false
            })
          } else {
            console.log(1)
          }
        }
        )
      }
    },
    // 新增部门按钮
    newDepart(val, data) {
      if (val === 'all') {
        // currentNodeKey_dept是默认部门树的第一个
        this.departform.parentId = this.currentNodeKey_dept
        this.departform.parentName = this.currentNodeKey_deptName
        this.disableChangeDept = false
      } else {
        // currentDeptId是左侧点击树后变化
        this.departform.parentId = this.currentDeptId
        this.departform.parentName = this.currentDeptName
        this.disableChangeDept = true
      }
      this.departVisible = true
      this.$nextTick(() => {
        this.$refs.departform.clearValidate()
      })
    },
    delDepart() {
      if (this.rootDept.uuid === this.currentDeptId) {
        this.$message({
          type: 'warning',
          message: '根节点不能删除'
        })
        return
      }
      this.$confirm(`若删除当前部门，则该部门下辖的所有部门也将一并删除。`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDept(this.currentDeptId).then((res) => {
          console.log(res)
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: `删除成功`
            })
            this.getTree()
          }
        })
      }).catch(() => {
      })
    },
    addNewMember() {
      this.memberVisible = true
    },
    handleClose_member(data) {
      if (data) {
        this.getDeptUserFun()
      }
      this.memberVisible = false
    },
    handleChange(val) {},
    // 新增部门的时候点击选择上级部门
    handleNodeClick(v) {
      this.departform.parentName = v.deptName
      this.departform.parentId = v.uuid
      this.showChooseDept_add = false
    },
    // 部门详情点击选择上级部门
    handleNodeClick_deatil(val) {
      this.$confirm(`确定要将上级部门改为${val.deptName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formLabelAlign.parentName = val.deptName
        this.formLabelAlign.parentId = val.uuid
        this.$refs.formLabelAlign.clearValidate()
      }).catch(() => {
      })

      this.showChooseDept = false
    },
    parentNameFocus() {
      this.showChooseDept = true
    },
    parentNameFocus_add() {
      this.showChooseDept_add = true
    },
    // 通过传递uuid,去判断当前选择人员是否已经是在别的部门
    getByUserFun(uuid) {
      getByUser(uuid).then((res) => {
        this.changeUserLoading = false
        if (res.data) {
          const msgs = res.data.position === 'manager' ? `所选人员已担任${res.data.deptName}部门负责人，请重新指定该人员所在部门的负责人后再做此操作。` : `该人员目前从属于${res.data.deptName}，若将该人员设置为当前部门责任人，则该人员将自动从原部门移除，同时移入到当前部门。`
          this.$confirm(msgs, '提示', {
            confirmButtonText: res.data.position === 'manager' ? '重新选择' : '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (res.data.position === 'manager') {
              return
            }
            setTimeout(() => {
              this.$refs.deptManagerBlur.blur()
            }, 0)
          }).catch(() => {
          })
        }
      })
    },
    deptManagerChange(val) {
      this.changeUserLoading = true
      this.getByUserFun(val)
    },

    // 新增部门保存
    departSubmit() {
      this.$refs['departform'].validate((valid) => {
        if (valid) {
          this.addDeptLoading = true
          addDept(this.departform).then((res) => {
            this.addDeptLoading = false
            this.getTree()
            this.$nextTick(() => {
              this.$refs.departform.clearValidate()
            })
            this.handleClose()
          }).catch(() => {
            this.addDeptLoading = false
          })
        } else {
          return false
        }
      })
    },
    // 删除成员
    delMember(type, uuid) {
      const title = type === 'all' ? '是否移除所选择成员?' : '是否移除该成员？'
      let uuids = []
      if (type === 'all') {
        uuids = this.multipleSelection.map((ele) => {
          return ele.uuid
        })
      } else {
        uuids = [uuid]
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.MemberLoading = true
        delDeptUser({ uuids: uuids }).then((res) => {
          console.log(res)
          if (res.status == 200) {
            this.queryParams.pageNum = 1
            this.getDeptUserFun()
          }
          this.MemberLoading = false
        }).catch(() => {
          this.MemberLoading = false
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.col_overflow {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.card_right {
  display: flex;
  align-items: center;

  .xh_btn_r_o {
    margin-left: 20px;
  }
}
.wrapper {
  display: flex;

  .left {
    min-width: 300px;
    width: 586px;
    padding: 22px 24px;
    box-sizing: content-box;
    height: calc(100vh - 150px);
    background: #fff;
    border-radius: 6px;
    margin-right: 13px;
  }
  .right {
    background: #fff;
    width: calc(100% - 338px);
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    position: relative;
    .top_btn{
      position: absolute;
      right: 30px;
      top: 27px;
    }
  }
  .tab_container {
    ::v-deep .el-tabs__header {
      padding: 15px 20px;
    }
    ::v-deep .el-tabs__nav-wrap::after {
      content: none;
    }
  }
  .depart_member {
    width: 100%;
  }
  .depart_info {
    // width: 45%;
    width: 100%;
    .operatebtn_box {
      overflow: hidden;
      margin-bottom: 23px;
      .operatebtn {
        float: right;
        margin-right: 10px;
      }
    }
    form {
      margin: 0 auto;
      width: 600px;
    }
  }
}
.depertmentLine_box {
  width: 100%;
  height: 100%;
  position: absolute;
  position: fixed;
  z-index: 11;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.1);
}
.depertmentLine_box_add{
  width: 100%;
  height: 100%;
  position: absolute;
  position: fixed;
  z-index: 11;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.1);
}
.depertmentLine {
  max-height: 200px;
    overflow-y: auto;
    position: absolute;
    top: 39%;
    left: 24%;
    width: 67%;
    z-index: 1;
    border-radius: 7px;
}
.depertmentLine_detail{
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  top: 58%;
  left: 60%;
  width: 26%;
  z-index: 1;
  border-radius: 7px;
}
.setManager{
  position: absolute;
  width: 100%;
  top: 0;
  height: 36px;
  background-color: transparent;
  z-index: 1;
}
.custom_tree_node_title {
  // 与左边 pretag 类保持距离
  width: calc(100% - 50px);
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
