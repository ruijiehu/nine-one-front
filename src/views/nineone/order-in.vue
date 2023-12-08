<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="80px">
          <el-form-item label="物品编号" prop="cellPhone">
            <el-input v-model="queryParams.cellPhone" placeholder="请输入物品编号" clearable style="width: 240px"
                      @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="订单号" prop="cellPhone">
            <el-input v-model="queryParams.cellPhone" placeholder="请输入物品编号" clearable style="width: 240px"
                      @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="供应商" prop="status">
            <el-input v-model="queryParams.cellPhone" placeholder="请输入物品编号" clearable style="width: 240px"
                      @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" @click="handleAdd" >新增</el-button>
          </el-col>

          <!-- <el-col :span="1.5">
            <el-button type="primary" @click="handleDelete('all')"
            >删除</el-button>
          </el-col> -->
        </el-row>

        <el-table v-loading="loading" stripe :data="userList" row-key="uuid" @selection-change="handleSelectionChange" border>
          <!-- <el-table-column type="selection" width="50" :reserve-selection="true" align="center" /> -->
          <el-table-column label="订单号" align="center"  prop="goodsnum" :show-overflow-tooltip="true" />
          <el-table-column label="物品名称" align="center"  prop="goodsname" :show-overflow-tooltip="true" />
          <el-table-column label="物品编号" align="center" prop="goodsnum" :show-overflow-tooltip="true" />
          <el-table-column label="单价" align="center"  prop="goodsnum" :show-overflow-tooltip="true" />
          <el-table-column label="数量" align="center"  prop="goodsnum" :show-overflow-tooltip="true" />
          <el-table-column label="供应商" align="center" prop="goodsnum" :show-overflow-tooltip="true" />
          <el-table-column label="是否结算" align="center" prop="goodsnum" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button type="text" @click="judgement(scope.row)" >物品查验</el-button>
              <el-button type="text" @click="inhouse(scope.row)" >物品入库</el-button>
              <el-button type="text" @click="account(scope.row)" >结算</el-button>
              <el-button type="text" @click="handleUpdate(scope.row)" >修改</el-button>
              <el-button type="text" @click="handleDelete('item',scope.row)" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                    @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 新增&修改 -->
    <el-dialog :title="title" :visible.sync="dialogshow" width="600px" append-to-body :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div class="box">
        <el-form ref="form" :model="form"  label-width="80px">
          <el-form-item  label="物品名称" prop="goodsname">
            <el-input v-model="form.goodsname" placeholder="物品名称" />
          </el-form-item>
          <el-form-item label="物品编号" prop="goodsnum">
            <el-input v-model="form.goodsnum" placeholder="物品编号"   />
          </el-form-item>
          <el-form-item label="单价" prop="goodsnum">
            <el-input v-model="form.goodsnum" placeholder="物品编号"   />
          </el-form-item>
          <el-form-item label="数量" prop="goodsnum">
            <el-input v-model="form.goodsnum" placeholder="物品编号"   />
          </el-form-item>
          <el-form-item label="供应商" prop="goodsnum">
            <el-input v-model="form.goodsnum" placeholder="物品编号"   />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 物品查验 -->
    <el-dialog title="物品查验" :visible.sync="showJudge" width="600px" append-to-body :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div class="box">
        <el-form ref="form_judge" :model="form_judge"  label-width="80px">
          <el-form-item  label="查验数量" prop="goodsname">
            <el-input v-model="form_judge.goodsname" placeholder="查验数量" />
          </el-form-item>
          <el-form-item label="次品数量" prop="goodsnum">
            <el-input v-model="form_judge.goodsnum" placeholder="次品数量"   />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm_judge">确 定</el-button>
        <el-button @click="cancel_judge">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 物品入库 -->
    <el-dialog title="物品入库" :visible.sync="showinHouse" width="600px" append-to-body :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div class="box">
        <el-form ref="form_showinHouse" :model="form_showinHouse"  label-width="80px">
          <el-form-item  label="物品数量" prop="goodsname">
            <el-input v-model="form_showinHouse.goodsname" placeholder="查验数量" />
          </el-form-item>
          <el-form-item label="入库标志" prop="goodsnum">
            <el-input v-model="form_showinHouse.goodsnum" placeholder="是否入库"   />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm_form_showinHouse">确 定</el-button>
        <el-button @click="cancel_form_showinHouse">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  listUser
} from '@/api/system/user'

export default {
  name: 'User',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 1,
        username: undefined,
        cellPhone: undefined
      },
      userList: [{ 'goodsname': '商品一', 'goodsnum': '9090990', 'goodstype': '一类' }, { 'goodsname': '商品一', 'goodsnum': '9090990', 'goodstype': '一类' }, { 'goodsname': '商品一', 'goodsnum': '9090990', 'goodstype': '一类' }, { 'goodsname': '商品一', 'goodsnum': '9090990', 'goodstype': '一类' }, { 'goodsname': '商品一', 'goodsnum': '9090990', 'goodstype': '一类' }],
      title: '新增',
      dialogshow: false,
      form: {},
      form_judge: {},
      form_showinHouse: {},
      showJudge: false,
      showinHouse: true
    }
  },
  created() {
    // this.getList()
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

    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        username: undefined,
        nickName: undefined,
        cellPhone: undefined,
        email: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    handleSelectionChange(selection) {
    },
    handleAdd() {
      this.title = '新增'
      this.dialogshow = true
    },
    handleUpdate(item) {
      this.form = JSON.parse(JSON.stringify(item))
      this.title = '修改'
      this.dialogshow = true
    },
    handleDelete(type, item) {
      if (type === 'all') {
        return
      }
      this.$modal
        .confirm('是否确认删除此物品？')
        .then(function() {
        })
        .then(() => {
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => { })
    },
    // 取消按钮
    cancel() {
      this.dialogshow = false
      this.reset()
    },
    submitForm() {
      console.log(this.form, '-=-==-=')
      this.dialogshow = true
    },
    judgement(item) {
      this.showJudge = true
    },
    submitForm_judge() {
      this.showJudge = false
    },
    cancel_judge() {
      this.showJudge = false
    },
    submitForm_form_showinHouse() {
      this.showinHouse = false
    },
    cancel_form_showinHouse() {
      this.showinHouse = false
    },

    inhouse() {
      this.showinHouse = true
    },
    account() {}
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
