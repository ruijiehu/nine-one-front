/** 图表配置 */
export default {
  namespaced: true,
  state: {
    // 当前
    optionConfig: '',
    // 数据config
    dataConfig: {
      url: '',
      inputParams: [], // 入参数组
      outputParams: []// 出参数组
    }
  },
  mutations: {
    setOptionConfig(state, payload) {
      localStorage.setItem('optionConfig', payload)
      state.optionConfig = payload
    },
    setDataConfig(state, payload) {
      state.dataConfig[payload.key] = payload.value
    }
  }
}
