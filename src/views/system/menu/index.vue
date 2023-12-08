<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" @submit.native.prevent>
      <el-form-item label="菜单名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入菜单名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="exportMenuFun">导出路由</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-upload
          ref="upload"
          class="uploadrouter"
          :action="baseUrl"
          :limit="1"
          :on-success="uploadSuccess"
          :show-file-list="false"
        >
          <el-button type="primary">导入路由</el-button>
        </el-upload>
      </el-col>
    </el-row>

    <!-- row-key="menuId" -->
    <el-table
      v-if="refreshTable"
      ref="table"
      v-loading="loading"
      :data="menuList"
      row-key="uuid"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="菜单名称" :show-overflow-tooltip="true" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.meta.menuName }}</span>
          <!-- <span v-else>按钮：{{scope.row.meta.menuName}}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.meta.icon" :icon-class="scope.row.meta.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="reorder" label="排序" width="60"></el-table-column>
      <el-table-column label="权限标识" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.meta.permId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="类型" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.meta.menuType === 'N'">导航</span>
          <span v-if="scope.row.meta.menuType === 'M'">页面</span>
          <span v-if="scope.row.meta.menuType === 'P'">按钮</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>-->
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown @command='handleCopyCommand($event,scope.row)' >
            <el-button type="text" >
              复制<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='copy'>复制</el-dropdown-item>
              <el-dropdown-item command='copyto'>复制到</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="text" @click="handleUpdate(scope.row)"  style="margin-left: 7px">修改</el-button>
          <!-- v-hasPermi="['system:menu:edit']" -->
          <el-button type="text" @click="handleAdd(scope.row)">新增</el-button>

          <!-- v-hasPermi="['system:menu:add']" -->
          <el-button type="text" @click="handleDelete(scope.row)" style="color:red;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.meta.menuType">
                <el-radio label="N">导航</el-radio>
                <el-radio label="M">页面</el-radio>
                <el-radio label="P">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.meta.menuType != 'P'">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.meta.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px; width: 16px"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="reorder">
              <el-input-number v-model="form.reorder" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.meta.menuType != 'P'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>是否外链
              </span>
              <el-radio-group v-model="form.meta.isLink">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.meta.menuType != 'P'">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>访问路径
              </span>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <!-- v-if="form.meta.menuType == 'M'" -->
          <el-col :span="12" v-if="form.meta.menuType != 'P'" >
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>组件路径
              </span>
              <el-input v-model="form.component" placeholder="请输入组件路径" maxlength="200" />
            </el-form-item>
          </el-col>
          <!-- v-if="form.meta.menuType == 'M'" -->
          <el-col :span="12" v-if="form.meta.menuType != 'P'">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="路由名称" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>路由名称
              </span>
              <el-input v-model="form.name" placeholder="请输入路由名称" />
            </el-form-item>
          </el-col>
          <!-- v-if="form.meta.menuType != 'N'" -->
          <el-col :span="12" >
            <el-form-item>
              <el-input v-model="form.meta.permId" placeholder="请输入权限标识" maxlength="100" />
              <span slot="label">
                <el-tooltip
                  content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>权限标识
              </span>
            </el-form-item>
          </el-col>
          <!-- v-if="form.meta.menuType == 'M'" -->
          <el-col :span="12"  v-if="form.meta.menuType != 'P'">
            <el-form-item>
              <el-input v-model="form.meta.extraPropertyStr" placeholder="请输入扩展参数" maxlength="255" />
              <span slot="label">
                <el-tooltip content="访问路由的默认传递参数，如：`linkUrl=tq-zjgrid-evaluation`" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>扩展参数
              </span>
            </el-form-item>
          </el-col>
          <!-- v-if="form.meta.menuType == 'M'" -->
          <el-col :span="12" v-if="form.meta.menuType != 'P'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="是否缓存" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>是否缓存
              </span>
              <el-radio-group v-model="form.meta.noCache">
                <el-radio label="1">缓存</el-radio>
                <el-radio label="0">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- v-if="form.meta.menuType == 'M'" -->
          <el-col :span="12" v-if="form.meta.menuType != 'P'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="缓存名" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>缓存名
              </span>
              <el-input v-model="form.meta.aliasName" placeholder="请输入缓存名" maxlength="255" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.meta.menuType != 'P'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>是否展示
              </span>
              <el-radio-group v-model="form.hidden">
                <el-radio :label="'0'">是</el-radio>
                <el-radio :label="'1'">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.meta.menuType != 'P'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="是否在开发中" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>是否在开发
              </span>
              <el-radio-group v-model="form.meta.devFlag">
                <el-radio :label="'0'">否</el-radio>
                <el-radio :label="'1'">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- v-if="form.meta.menuType !== 'N'" -->
          <el-col >
            <el-form-item>
              <el-input
                v-model="form.meta.urlsStr"
                placeholder="请输入URL权限"
                type="textarea"
                :rows="3"
              />
              <span slot="label">URL权限</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <menuChange
      :dialogVisible.sync="menuChageShow"
      @closeDiolog="closeDiolog"
      :routerchange="routerchange"
    ></menuChange>

    <menuChoose :visible.sync="menuChooseShow" :data="menuList" @confirm='handleMenuChooseConfirm'/>
  </div>
</template>

<script>
import {
  listMenu,
  getMenu,
  delMenu,
  addMenu,
  updateMenu,
  getUpdateRouter,
  exportList,
  copyMenu
} from '@/api/system/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'
import menuChange from './dialog.vue'
import menuChoose from './menuChoose.vue'

export default {
  name: 'IMenu',
  // dicts: ['sys_show_hide', 'sys_normal_disable'],
  components: { Treeselect, IconSelect, menuChange, menuChoose },
  data() {
    return {
      menuChooseShow: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        name: undefined,
        visible: undefined
      },
      // 表单参数
      form: null,
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '路由名称不能为空', trigger: 'blur' }
        ],
        reorder: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ]
      },
      baseUrl: `http://${window.document.location.host}/nine-one/router/import/check`,
      routerchange: {
        DEFAULT: [],
        allMenuClass: [],
        sign: '',
        baseUrl: ''
      },
      menuChageShow: false
    }
  },
  created() {
    // 初始化form参数
    this.reset()
    this.getList()
  },

  methods: {
    async handleMenuChooseConfirm(keys) {
      if (keys && keys[0]) {
        this.__operationedParentUuid = keys
        await copyMenu(this.copyActiveMenu.uuid, keys[0] || 'd')
        this.getList()
      }
    },
    handleCopyCommand(command, row) {
      this.copyActiveMenu = row
      if (command == 'copy') {
        this.handleCopy()
      } else {
        this.menuChooseShow = true
      }
    },
    // 复制路由
    async handleCopy() {
      this.__operationedParentUuid = this.copyActiveMenu.parentId
      await copyMenu(this.copyActiveMenu.uuid, this.copyActiveMenu.parentId || 'd')
      this.getList()
    },
    // 选择图标
    selected(name) {
      this.form.icon = name
      this.form.meta.icon = name
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      listMenu(this.queryParams).then((response) => {
        // this.menuList = this.handleTree(response.data, "menuId");
        this.menuList = response.data
        this.loading = false
      })
      if (this.queryParams.name) {
        this.refreshTable = false
        this.isExpandAll = true
        this.$nextTick(() => {
          this.refreshTable = true
        })
      } else {
        this.refreshTable = false
        this.isExpandAll = false
        this.$nextTick(() => {
          this.refreshTable = true
        })
      }
      setTimeout(() => {
        this.perfectAfterOperation()
      }, 0)
      // this.$nextTick(() => {
      //     this.refreshTable = true;
      //   });
    },
    // 优化操作后的页面展示
    perfectAfterOperation() {
      if (this.__operationedParentUuid) {
        let tree = this.menuList; let result = null
        while (tree.length) {
          const temp = []
          for (const item of tree) {
            if (item.uuid == this.__operationedParentUuid) {
              result = item
              break
            }
            if (item.children) {
              temp.push(...item.children)
            }
          }
          tree = temp
        }
        if (result) {
          this.$refs.table.toggleRowExpansion(result)
        }
        this.__operationedParentUuid = null
      }
    },
    perfectAfterCreate() {},
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (!node.children?.length) {
        delete node.children
      }
      return {
        id: node.uuid || '',
        label: node.menuName || (node.meta && node.meta.menuName),
        children: node.children
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then((response) => {
        this.menuOptions = []
        const menu = { id: 0, menuName: '菜单列表', children: [] }
        // menu.children = this.handleTree(response.data, "menuId");
        menu.children = response.data
        this.menuOptions.push(menu)
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
        menuName: '',
        parentId: '',
        reorder: '',
        name: '',
        meta: {
          menuName: '',
          parentId: 0,
          icon: undefined,
          menuType: 'N',
          reorder: undefined,
          isFrame: '1',
          isCache: '0',
          visible: '0',
          status: '0',
          menuFlag: 0,
          devFlag: ''
        }
      }

      // this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      console.log(this.form.parentId)
      if (row != null && row.uuid) {
        this.form.parentId = row.uuid
      } else {
        this.form.parentId = ''
      }
      this.open = true
      this.title = '添加菜单'
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      getMenu(row.uuid).then((response) => {
        this.form = response.data
        this.form.icon = this.form.meta.icon
        this.$set(this.form, 'menuName', response.data.meta.menuName)
        if (response.data.meta.urls?.length) {
          this.$set(this.form.meta, 'urlsStr', response.data.meta.urls.join('\n'))
        } else {
          this.$set(this.form.meta, 'urlsStr', '')
        }
        if (response.data.meta.extraProperty) {
          response.data.meta.extraPropertyStr = Object.keys(response.data.meta.extraProperty).map(item => {
            return `${item}=${response.data.meta.extraProperty[item]}`
          }).join('\n')
        }
        this.open = true
        this.title = '修改菜单'
      })
    },
    // 获取url List
    getUrlsList() {
      if (this.form.meta.urlsStr) {
        this.form.meta.urls = this.form.meta.urlsStr.split('\n')
      } else {
        this.form.meta.urls = []
      }
    },
    // 处理额外的参数
    getExtraProperties() {
      if (this.form.meta.extraPropertyStr) {
        const propertiesStr = this.form.meta.extraPropertyStr.split('\n')
        const rt = {}
        propertiesStr.forEach(item => {
          const entry = item.split('=')
          const [url, ...restEntry] = entry
          rt[url] = restEntry.join('=')
        })
        this.form.meta.extraProperty = rt
      } else {
        this.form.meta.extraProperty = {}
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.meta.menuName = this.form.menuName
          this.form.icon = this.form.meta.icon
          this.getUrlsList()
          this.getExtraProperties()
          // this.form.name = this.form.menuName;
          if (this.form.uuid != undefined) {
            updateMenu(this.form).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.__operationedParentUuid = this.form.parentId
              this.getList()
            })
          } else {
            addMenu(this.form).then(() => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.__operationedParentUuid = this.form.parentId
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除名称为"' + row.meta.menuName + '"的数据项？')
        .then(function() {
          return delMenu(row.uuid)
        })
        .then(() => {
          this.__operationedParentUuid = row.parentId
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    // 导出菜单
    exportMenuFun() {
      // location.href = `http://${window.document.location.host}` + '/nine-one/router/export'
      exportList().then(data => {
        const url = window.URL.createObjectURL(new Blob([data], { type: 'application/json' }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '导出路由' + '.json')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      })
    },
    // 导入路由检验
    uploadSuccess(response) {
      const { status, data, msgs } = response
      this.dialogVisible = true
      if (status === 200 && data) {
        this.routerchange = response.data
        // this.$message.success('导入成功')
        this.menuChageShow = true
      } else {
        this.$message.error(msgs[Object.keys(msgs)[0]])
      }
      this.$refs.upload.clearFiles()
    },
    closeDiolog(val) {
      if (val) {
        this.updateRouter()
      } else {
        this.$refs.upload.clearFiles()
        this.menuChageShow = false
      }
    },
    async updateRouter() {
      const { status, msgs } = await getUpdateRouter(this.routerchange.sign)
      if (status === 200) {
        this.$message.success('导入成功')
        // this.getRouterTree()
        this.menuChageShow = false
      } else {
        this.$message.error(msgs[Object.keys(msgs)[0]])
      }
      this.$refs.upload.clearFiles()
    }
  }
}
</script>
