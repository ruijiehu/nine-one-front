<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="80px">
          <el-form-item label="物品名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入物品名称"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="物品编号" prop="freightId">
            <el-input
              v-model="queryParams.freightId"
              placeholder="请输入物品编号"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="大类" prop="status">
            <el-select
              v-model="queryParams.bigType"
              placeholder="大类"
              clearable
              style="width: 240px"
              @change="bigchange"
            >
              <el-option
                v-for="item in bigTypeList"
                :key="item.uuid"
                :label="item.name"
                :value="item.uuid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="小类" prop="status">
            <el-select
              v-model="queryParams.smallType"
              placeholder="小类"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="dict in smallTypeList"
                :key="dict.uuid"
                :label="dict.name"
                :value="dict.uuid"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-col>

          <!-- <el-col :span="1.5">
            <el-button type="primary" @click="handleDelete('all')">删除</el-button>
          </el-col>-->
        </el-row>

        <el-table
          v-loading="loading"
          stripe
          :data="goodsList"
          row-key="uuid"
          border
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="50" :reserve-selection="true" align="center" /> -->
          <el-table-column label="物品名称" align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column
            label="物品编号"
            align="center"
            prop="freightId"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="大类" align="center" prop="bigTypeText" />
          <el-table-column label="小类" align="center" prop="smallTypeText" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button type="text" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="text" @click="handleDelete('sign',scope.row.uuid)">删除</el-button>
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
      </el-col>
    </el-row>

    <!-- 新增&修改 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogshow"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="box">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="物品名称" prop="name">
            <el-input v-model="form.name" placeholder="物品名称" />
          </el-form-item>
          <el-form-item label="大类" prop="bigType">
            <el-select
              v-model="form.bigType"
              placeholder
              clearable
              style="width: 240px"
              @change="bigchange_add"
            >
              <el-option
                v-for="item in bigTypeList"
                :key="item.uuid"
                :label="item.name"
                :value="item.uuid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="小类" prop="smallType">
            <el-select v-model="form.smallType" placeholder clearable style="width: 240px">
              <el-option
                v-for="dict in smallTypeList_add"
                :key="dict.uuid"
                :label="dict.name"
                :value="dict.uuid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGoods, addGoods, delGoods, editGoods } from '@/api/menu'
import { listType, getSubListItem } from '@/api/system/dict/type'

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
        pageSize: 10,
        name: undefined,
        freightId: undefined,
        bigType: '',
        smallType: ''
      },
      goodsList: [
        { name: '商品一', goodsnum: '9090990', goodstype: '一类' },
        { name: '商品一', goodsnum: '9090990', goodstype: '一类' },
        { name: '商品一', goodsnum: '9090990', goodstype: '一类' },
        { name: '商品一', goodsnum: '9090990', goodstype: '一类' },
        { name: '商品一', goodsnum: '9090990', goodstype: '一类' }
      ],
      title: '新增',
      dialogshow: false,
      form: {
        name: '',
        remark: '',
        smallType: '',
        bigType: ''
      },
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        bigType: [
          {
            required: true,
            message: '请选择大类',
            trigger: 'change'
          }
        ],
        smallType: [
          {
            required: true,
            message: '请选择小类',
            trigger: 'change'
          }
        ]
      },
      bigTypeList: [],
      smallTypeList: [],
      smallTypeList_add: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    listType().then((response) => {
      this.bigTypeList = response.data.list
    })
  },
  methods: {
    bigchange() {
      this.queryParams.smallType = ''
      getSubListItem({ typeId: this.queryParams.bigType }).then((res) => {
        this.smallTypeList = res.data.list
      })
    },
    bigchange_add() {
      this.form.smallType = ''
      getSubListItem({ typeId: this.form.bigType }).then((res) => {
        this.smallTypeList_add = res.data.list
      })
    },
    /** 查询物品列表 */
    getList() {
      this.loading = true
      listGoods(this.queryParams).then((response) => {
        this.goodsList = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },

    // 表单重置
    reset() {
      this.form = {
        name: '',
        smallType: '',
        bigType: '',
        remark: ''
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    handleSelectionChange(selection) {},
    handleAdd() {
      this.title = '新增'
      this.dialogshow = true
    },
    handleUpdate(item) {
      this.form = JSON.parse(JSON.stringify(item))
      this.bigchange_add()
      this.$nextTick(() => {
        this.form.smallType = JSON.parse(JSON.stringify(item)).smallType
      })
      this.title = '修改'
      this.dialogshow = true
    },
    handleDelete(type, val) {
      const _this = this
      this.$modal
        .confirm('是否确认删除此物品？')
        .then(function() {
          delGoods({ uuids: [val] }).then((res) => {
            console.log(res, '---------')
            if (res.status == 200) {
              _this.reGet()
            }
          })
        })
        .then(() => {
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    // 取消按钮
    cancel() {
      this.dialogshow = false
      this.reset()
    },
    submitForm() {
      console.log(this.form, '-=-==-=')
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.title === '新增') {
            addGoods(this.form).then((res) => {
              console.log(res)
              if (res.status == 200) {
                this.$modal.msgSuccess('新增成功')
                this.dialogshow = false
                this.reGet()
              } else {
                this.$modal.msgSuccess('新增失败')
              }
            })
          } else {
            editGoods(this.form).then((res) => {
              console.log(res)
              if (res.status == 200) {
                this.$modal.msgSuccess('修改成功')
                this.dialogshow = false
                this.reGet()
              } else {
                this.$modal.msgSuccess('修改失败')
              }
            })
          }
        }
      })

      // this.dialogshow = true
    },
    reGet() {
      this.queryParams.pageNum = 1
      this.getList()
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
