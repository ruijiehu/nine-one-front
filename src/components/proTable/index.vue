<template>
  <component :is="card ? Card : Empty" class="pro-table">
    <el-form inline>
      <FormItem
        v-for="item in searchFields"
        :key="searchProp(item)"
        v-bind="item"
        v-model="queryParam[searchProp(item)]"
        :inputProps="item.searchInputProps"
        :formItemProps="item.searchFormItemProps"
        :prop="searchProp(item)"
        :type="searchFormType(item)"
        :label="searchLabel(item)"
        :rules="[]"
      />
      <el-form-item>
        <el-button @click="handleReset" style="margin-right: 10px"
        >重置</el-button
        >
        <el-button type="primary" @click="handleFilter">查询</el-button>
        <el-button
          type="text"
          v-if="!config.alwaysSpreadSearch"
          @click="handleToggleSearch"
          style="margin-left: 8px"
        >
          {{ toggleSearchStatus ? "收起" : "展开" }}
          <i
            :class="
              toggleSearchStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
            "
          />
        </el-button>
      </el-form-item>
    </el-form>
    <div class="tool-buttons">
      <el-button
        class="tool-button"
        v-for="item in toolBtn"
        :key="item.btnText"
        type="primary"
        @click="handleToolActionClick(item)"
      >{{ item.btnText }}</el-button
      >
    </div>

    <el-table
      ref="table"
      size="middle"
      :rowKey="primaryKey"
      :data="dataSource"
      :loading="loading"
      style="margin-top: 20px"
      v-bind="tableProps"
    >
      <el-table-column
        v-for="item in columns.slice(0, columns.length - 1)"
        :key="tableProp(item)"
        :prop="item.prop"
        :label="item.label"
        align="center"
      />

      <el-table-column
        v-for="item in columns.slice(columns.length - 1)"
        :key="tableProp(item)"
        :prop="item.prop"
        :label="item.label"
        align="center"
      >
        <template v-if="item.prop === 'action'" slot-scope="scope">
          <template
            v-for="(item, index) in showBtnActions(scope.row, tableBtn).slice(
              0,
              outBtnNum
            )"
          >
            <el-button
              type="text"
              @click="handleAction(item, scope.row)"
              :key="item.btnText"
            >{{ item.btnText }}</el-button
            >
            <el-divider
              v-if="
                index <
                  showBtnActions(scope.row, tableBtn).slice(0, outBtnNum)
                    .length -
                  1 ||
                  !!showBtnActions(scope.row, tableBtn).slice(outBtnNum).length
              "
              direction="vertical"
              :key="item.btnText + 'divider'"
            />
          </template>
        </template>
      </el-table-column>

      <template v-for="key in slots" :slot="key" slot-scope="scope">
        <slot :name="key" v-bind="scope"></slot>
      </template>
    </el-table>
    <el-pagination
      :current-page="ipagination.current"
      :page-size="ipagination.pageSize"
      :total="ipagination.total"
      @size-change="handlePaginationChange('size',$event)"
      @current-change="handlePaginationChange('current',$event)"
      :page-sizes='[10, 20,  40, 50, 100]'
      layout='jumper,prev, pager, next,  sizes,total'
      style="text-align:right;padding:20px 0"
    />

    <ModalForm
      :visible.sync="visible"
      :status="modalStatus"
      :data="activeData"
      :config="config"
    />
  </component>
</template>

<script>
import ModalForm from './modelForm.vue'
import FormItem from './form-item.vue'
import axios from '@/utils/request'
import { Card } from 'element-ui'
import Empty from './empty.vue'

import { DefaultActionsMap, defaultV } from './defaults'

const primaryKey = 'id'
export default {
  components: { ModalForm, FormItem },
  props: {
    config: {
      type: Object
    },
    card: {
      // 是否用a-card包裹
      type: Boolean,
      default: true
    },
    tableProps: Object
  },
  data() {
    return {
      Card,
      Empty,
      visible: false,
      modalStatus: 'create',
      activeData: null,
      primaryKey,
      loading: false,
      queryParam: {},
      columns: [],
      dataSource: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },

      actions: {},
      tableBtn: [],
      toolBtn: [],
      toggleSearchStatus: false
    }
  },
  provide() {
    return {
      getContext: () => {
        const temp = this

        return temp
      }
    }
  },
  computed: {
    fields() {
      return (this.config && this.config.fields) || []
    },
    searchFields() {
      const temp = this.fields.filter((item) => item.search)
      return this.toggleSearchStatus || this.config.alwaysSpreadSearch
        ? temp
        : temp.slice(0, 2)
    },
    outBtnNum() {
      return this.config && this.config.spreadTableAction
        ? 100000
        : (this.config && this.config.outBtnNum) || 1
    },
    slots() {
      return Object.keys({ ...this.$slots, ...this.$scopedSlots })
    }
  },
  watch: {
    config: {
      handler() {
        this.initConfig()
        this.getList()
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  methods: {
    handleToolActionClick(action) {
      action.callback(action, this)
    },
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus
    },
    handleCreate() {
      this.activeData = null
      this.visible = true
      this.modalStatus = 'create'
    },
    handlePaginationChange(type, val) {
      if (type == 'size') this.ipagination.pageSize = val
      if (type == 'current') this.ipagination.current = val
      this.getList()
    },
    initConfig() {
      if (!this.config) {
        this.columns = []
        this.actions = {}
        this.toolBtn = []
        return
      }
      if (this.config.fields) {
        this.genQueryParam()
        this.genColumns()
      } else {
        this.columns = []
      }

      if (this.config.actions) {
        this.genActions()
      } else {
        this.actions = {}
        this.toolBtn = []
      }

      this.primaryKey = this.config.primaryKey || primaryKey
    },
    handleFilter() {
      this.ipagination.current = 1
      this.getList()
    },
    handleReset() {
      this.genQueryParam()
      this.getList()
    },
    getList() {
      const resetList = () => {
        this.dataSource = []
        this.ipagination.total = 0
      }
      if (!this.isConfigListApiLegal()) {
        resetList()
        return
      }
      this.loading = true
      const params = { ...this.queryParam }
      for (const key of Object.keys(params)) {
        if (
          params[key] === null ||
          params[key] === undefined ||
          params[key] === ''
        ) {
          Reflect.deleteProperty(params, key)
        }
      }
      const { current, pageSize } = this.ipagination
      Object.assign(params, { current, pageSize })
      this.actions.list
        .api(params)
        .then((res) => {
          const { result, success } = res
          if (success) {
            const { records, total } = result
            console.log(records)
            this.ipagination.total = total
            this.dataSource = records
          } else {
            this.dataSource = []
          }
        })
        .catch(() => {
          resetList()
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleAction(action, record) {
      action.callback(record, action, this)
    },
    isConfigListApiLegal() {
      return this.config && this.config.actions && this.config.actions.list
    },

    genQueryParam() {
      const { fields } = this.config
      const temp = {}

      fields
        .filter((item) => item.search)
        .forEach((item) => {
          temp[this.searchProp(item)] =
            item.defaultSearchValue || defaultV(this.searchFormType(item))
        })
      this.queryParam = temp
    },

    genColumns() {
      const { fields, actions } = this.config
      this.columns = fields.filter((item) => item.list)

      this.columns.push({
        label: '操作',
        prop: 'action',
        align: 'center'
      })
      console.log(this.columns)
    },
    genActions() {
      const { actions, outBtnNum } = this.config
      const keys = Object.keys(actions)
      keys.forEach((key) => {
        const val = actions[key]
        let defaults = {}
        if (DefaultActionsMap[key]) {
          defaults = {
            btnText: DefaultActionsMap[key].btnText,
            callback: DefaultActionsMap[key].callback,
            tag: DefaultActionsMap[key].tag,
            type: DefaultActionsMap[key].type || 'table'
          }
        }

        if (typeof val === 'string') {
          this.actions[key] = {
            api: apiFact(val, key),
            ...defaults
          }
        } else if (typeof val === 'function') {
          this.actions[key] = {
            api: val,
            ...defaults
          }
        } else {
          let type = val.type || 'table'
          if (key == 'create') type = 'tool'
          if (key == 'list') type = 'none'

          this.actions[key] = { ...defaults, ...val, type: val.type || type }
          if (typeof val.api === 'string') {
            this.actions[key].api = apiFact(val.api, key)
          }
        }
      })

      const tableBtn = Object.entries(this.actions)
        .filter((item) => item[1].type === 'table')
        .map((item) => item[1])
      this.tableBtn = tableBtn

      this.toolBtn = Object.entries(this.actions)
        .filter((item) => item[1].type === 'tool')
        .map((item) => item[1])

      function apiFact(action, key) {
        return function(data) {
          return axios({
            method: DefaultActionsMap[key].method,
            url: action,
            [DefaultActionsMap[key].data]: data
          })
        }
      }
    },
    showBtnActions(record, actions) {
      return actions.filter(
        (item) => this.isNil(item.show) || item.show(record)
      )
    },
    isNil(val) {
      return val === undefined || val === null
    },
    searchProp(field) {
      return field.searchProp || field.prop
    },
    tableProp(field) {
      return field.tableProp || field.prop
    },
    tableLabel(field) {
      console.log(field.label)
      return field.tableLabel || field.label
    },
    searchLabel(field) {
      return field.searchLabel || field.label
    },
    searchFormType(field) {
      return field.searchFormType || field.formType
    }
  }
}
</script>

<style lang='less' scoped>
.ant-form-inline .ant-form-item {
  margin-bottom: 15px;
}
.tool-buttons {
  margin-top: 10px;
}
.tool-button {
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
}
</style>
