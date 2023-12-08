import { randomString, cloneDeep } from '@/utils/index'
const TH_HIDDEN_FIELDS = ['editConfig', 'editType', 'editWeight', 'validate']
const FORM_HIDDEN_FIELDS = ['delKey', 'displayBtns', 'displayType', 'isTableCheckbox', 'sortable', 'isEdit']
// 对于某些字段
const hideField = (item, hideFields) => {
  for (const itemField in item) {
    if (hideFields.includes(itemField)) {
      item[itemField].hidden = true
    }
  }
}
export default {
  namespaced: true,
  state: {
    // 当前table的编辑组件
    currentRef: '',
    // 配置
    config: {
      tableColumns: {
        value: []
      },
      formColumns: {
        value: []
      }
    },
    tableJsonConfig: {},
    settingDefinition: {
      name: {
        value: 'v-table',
        hidden: true
      },
      // 上下文环境
      context: {
        hidden: true
      },
      ref: {
        label: '引用名',
        type: 'el-input'
      },
      tableData: {
        hidden: true
      },
      tableColumns: {
        label: '表格列',
        type: 'tableColumns',
        value: []
      }
    },
    inputProps: {},
    tableItemProps: {},
    pageList: [],
    currentPageDetail: {}
  },
  mutations: {
    // 设置当前的
    setCurrentRef(state, payload) {
      state.currentRef = payload
    },
    setConfig(state, config) {
      state.config = config
    },
    // 情况表格列配置
    clearTableColumns(state) {
      state.config.tableColumns.value = []
      state.config.formColumns.value = []
    },
    // 设置某个组件的配置
    upDateTableColumn(state, payload) {
      const stateConfig = state.config
      const ref = payload.ref.value
      const configIndex = state.config.tableColumns.value.findIndex(item => item.ref === ref)
      if (configIndex !== -1) {
        stateConfig.tableColumns.value[configIndex] = payload
      }
      state.config = stateConfig
    },
    // 设置输入框配置
    setInputProps(state, props) {
      state.inputProps = props
    },
    // 设置表格列字段配置
    setTableItemProps(state, props) {
      state.tableItemProps = props
    },
    setPageList(state, list) {
      state.pageList = list
      console.log(state.pageList)
    },
    // eslint-disable-next-line no-unused-vars
    setCurrentPageDetail(state, detail) {
      state.currentPageDetail = state.detail
    }
  },
  getters: {
    // 表格字段
    tableJsonConfig(state) {
      const stateConfig = state.config.tableColumns.value
      const configs = stateConfig.map(item => {
        const ob = {}
        for (const key in item) {
          ob[key] = item[key].value
        }
        return ob
      })
      return configs
    },
    // 表单字段
    formJsonConfig(state) {
      const stateConfig = state.config.formColumns.value
      const configs = stateConfig.map(item => {
        const ob = {}
        for (const key in item) {
          ob[key] = item[key].value
        }
        return ob
      })
      return configs
    }
  },
  actions: {
    // 情况图表配置
    // eslint-disable-next-line no-unused-vars
    clearTableConfig({ state, commit }) {
      commit('clearTableColumns')
      commit('currentConfig/setCurrentConfig', {}, { root: true })
    },
    // 设置table的字段
    setTableColumns({ state, commit }, payload) {
      const currentConfig = state.config
      currentConfig.tableColumns.value = payload.map(item => {
        hideField(item, TH_HIDDEN_FIELDS)
        if (!item.ref.value) {
          item.ref.value = `${item.name.value}_${randomString(12)}}`
          commit('currentConfig/setCurrentConfig', item, { root: true })
        }
        return item
      })
      state.config = currentConfig
    },
    setFormColums({ state, commit }, payload) {
      const currentConfig = state.config
      currentConfig.formColumns.value = payload.map(item => {
        hideField(item, FORM_HIDDEN_FIELDS)
        if (!item.ref.value) {
          item.ref.value = `${item.name.value}_${randomString(12)}}`
          commit('currentConfig/setCurrentConfig', item, { root: true })
        }
        return item
      })
      state.config = currentConfig
    },
    // 添加一个配置
    addTableColumn({ state, commit }, payload) {
      const config = cloneDeep(payload)
      console.log(payload)
      hideField(config, TH_HIDDEN_FIELDS)
      const configIndex = state.config.tableColumns.value.findIndex(item => item.ref.value === config.ref.value)
      if (configIndex !== -1) {
        config.ref.value = `${config.name.value}_${new Date().getTime()}`
        state.config.tableColumns.value.splice(configIndex + 1, 0, config)
        commit('currentConfig/setCurrentConfig', config, { root: true })
      }
    },
    // 将表头的配置同步到表单的配置中去
    // eslint-disable-next-line no-unused-vars
    syncTableColumn2Form({ state, commit }, payload) {
      const { flag, name, props, label } = payload
      if (flag) {
        const formColumn = state.config.formColumns.value
        const targetIndex = formColumn.findIndex(item => item.flag === flag)
        if (targetIndex > -1) {
          const target = state.config.formColumns.value[targetIndex]
          target.name = name
          target.props = props
          target.label = label
        }
      }
    },
    // 增加一个表单字段配置
    // eslint-disable-next-line no-unused-vars
    addFormColumn({ state, commit }, payload) {
      const config = cloneDeep(payload)
      hideField(config, FORM_HIDDEN_FIELDS)
      config.inEditArea = true
      config.ref.value = `${config.name.value}_${new Date().getTime()}`
      state.config.formColumns.value.push(config)
    },
    // eslint-disable-next-line no-unused-vars
    copyFormColumn({ state, commit }, payload) {
      const config = cloneDeep(payload)
      config.ref.value = `${config.name.value}_${new Date().getTime()}`
      state.config.formColumns.value.push(config)
    },
    // 删除一个配置
    delTableColumn({ state, commit }, payload) {
      const configIndex = state.config.tableColumns.value.findIndex(item => item.ref.value === payload.ref.value)
      if (configIndex !== -1) {
        let currentConfig = {}
        state.config.tableColumns.value.splice(configIndex, 1)
        if (configIndex - 1 >= 0) {
          currentConfig = state.config.tableColumns.value[configIndex - 1]
        } else if (state.config.tableColumns.value.length > 0) {
          currentConfig = state.config.tableColumns.value[0]
        }
        commit('currentConfig/setCurrentConfig', currentConfig, { root: true })
      }
    },
    // 删除一个表单字段
    delFormColumn({ state, commit }, payload) {
      const configIndex = state.config.formColumns.value.findIndex(item => item.ref.value === payload.ref.value)
      if (configIndex !== -1) {
        let currentConfig = {}
        state.config.formColumns.value.splice(configIndex, 1)
        if (configIndex - 1 >= 0) {
          currentConfig = state.config.formColumns.value[configIndex - 1]
        } else if (state.config.formColumns.value.length > 0) {
          currentConfig = state.config.formColumns.value[0]
        }
        commit('currentConfig/setCurrentConfig', currentConfig, { root: true })
      }
    }
  }
}
