
/** 全局当前配置 */
export default {
  namespaced: true,
  state: {
    // 拖拽界面的当前ref
    currentRef: '',
    // 当前属性配置
    currentConfig: {},
    // 当前组件样式配置
    currentStyle: {},
    // 页面属性
    pageAttr: {
      // 服务器地址  只有选择手动填充时才有效 如果为空则表示服务器地址为项目自身服务器
      serverUrl: '',
      getMethod: '',
      detailMethod: '',
      postMethod: '',
      putMethod: '',
      deleteMethod: '',
      // 页面中文名
      pageName: '',
      // 页面英文名
      pageNameEn: '',
      getMethodType: 'get',
      detailMethodType: 'get',
      postMethodType: 'post',
      putMethodType: 'put',
      deleteMethodType: 'delete'
    }
  },
  getters: {
    pageStyle(state) {
      const pageAttr = state.pageAttr
      const { width, height, ...restStyle } = pageAttr
      const style = {
        width: `${width}px`,
        height: `${height}px`,
        ...restStyle
      }
      return style
    }
  },
  mutations: {
    setCurrentRef(state, payload) {
      state.currentRef = payload
    },
    setCurrentConfig(state, payload) {
      state.currentConfig = payload
      if (payload.ref) {
        state.currentRef = payload.ref.value
      } else {
        state.currentRef = ''
      }
    },
    // 设置当前组件的样式
    setCurrentStyle(state, payload) {
      state.currentStyle = payload
      if (payload.ref) {
        state.currentRef = payload.ref.value
      } else {
        state.currentRef = ''
      }
    },
    setPageAttr(state, pageAttr) {
      state.pageAttr = pageAttr
    },
    setCurrentStylePos(state, payload) {
      var attr = state.currentConfig.styleDefination.attr
      var dimen = state.currentConfig.styleDefination.dimen
      if (payload.left) {
        attr.left.value = payload.left
      }
      if (payload.top) {
        attr.top.value = payload.top
      }
      if (payload.width) {
        dimen.width.value = payload.width
      }
      if (payload.height) {
        dimen.height.value = payload.height
      }
    }
  }
}
