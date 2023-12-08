export default {
  namespaced: true,
  state: {
    // 当前form-filter的编辑组件
    currentRef: '',
    // 头部配置
    config: [],
    // 设置当前的config
    currentConfig: {}
  },
  mutations: {
    // 设置某个组件的配置
    upDateConfig(state, payload) {
      const stateConfig = state.config
      const ref = payload.ref.value
      const configIndex = state.config.findIndex(item => item.ref === ref)
      if (configIndex !== -1) {
        stateConfig[configIndex] = payload
      }
      state.config = stateConfig
    },
    // 设置当前的config
    setCurrentConfig(state, payload) {
      state.currentConfig = payload
      state.currentRef = payload.ref.value

      // commit('currentConfig/setCurrentRef', state.currentConfig, { root: true })
      // commit('currentConfig/setCurrentConfig', state.currentConfig, { root: true })
    }
  },
  actions: {
    // 清空配置
    clearConfig({ state, commit }) {
      state.config = []
      state.currentConfig = {}
      commit('currentConfig/setCurrentConfig', state.currentConfig, { root: true })
    },
    // 设置当前的
    setCurrentRef({ state, commit }, payload) {
      state.currentRef = payload
      const currentConfig = state.config.find(item => item.ref.value === payload)
      if (currentConfig) {
        state.currentConfig = currentConfig
        commit('currentConfig/setCurrentConfig', currentConfig, { root: true })
      }
    },
    // 设置所有的config
    setAllConfig({ state, commit }, payload) {
      const configs = payload
      const refedConfig = configs.map(item => {
        // 设置ref的值
        if (!item.ref.value) {
          item.ref.value = `${item.name.value}_${new Date().getTime()}`
        }
        return item
      })
      state.config = refedConfig
      // 取出最后一个
      if (refedConfig.length > 0) {
        state.currentConfig = [...refedConfig].pop()
        state.currentRef = state.currentConfig.ref.value
        commit('currentConfig/setCurrentConfig', state.currentConfig, { root: true })
      }
    },
    // 添加一个配置
    addAllConfig({ state, commit }, payload) {
      const config = JSON.parse(JSON.stringify(payload))
      const configIndex = state.config.findIndex(item => item.ref.value === config.ref.value)
      if (configIndex !== -1) {
        config.ref.value = `${config.name.value}_${new Date().getTime()}`
        state.currentConfig = config
        state.config.splice(configIndex + 1, 0, config)
        commit('currentConfig/setCurrentConfig', config, { root: true })
      }
    },
    // 删除一个配置
    delAllConfig({ state, commit }, payload) {
      const configIndex = state.config.findIndex(item => item.ref.value === payload.ref.value)
      if (configIndex !== -1) {
        state.config.splice(configIndex, 1)
        let currentConfig = {}
        if (configIndex - 1 >= 0) {
          currentConfig = state.config[configIndex - 1]
        } else if (state.config.length > 0) {
          currentConfig = state.config[0]
        }
        state.currentConfig = currentConfig
        commit('currentConfig/setCurrentConfig', currentConfig, { root: true })
      }
    },
    // 切换组件
    exchangeConfig({ state, commit }, payload) {
      const { target, originData } = payload
      const currentConfig = state.currentConfig
      const configIndex = state.config.findIndex(item => item.ref.value === currentConfig.ref.value)
      if (configIndex !== -1) {
        target.ref.value = originData.ref.value
        target.label.value = originData.label.value
        // 如果更换前的paramsName不是个数组，则更换
        if (!Array.isArray(originData.paramName.value) && !Array.isArray(target.paramName.value)) {
          target.paramName.value = originData.paramName.value
        }
        state.config.splice(configIndex, 1, target)
        state.currentConfig = state.config[configIndex]
        commit('currentConfig/setCurrentConfig', state.config[configIndex], { root: true })
      }
    }
  },
  getters: {
    jsonConfig(state) {
      const stateConfig = state.config
      const configs = stateConfig.map(item => {
        const ob = {}
        for (const key in item) {
          ob[key] = item[key].value
        }
        return ob
      })
      return configs
    }
  }
}
