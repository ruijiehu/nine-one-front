import defaultSettings from '@/settings'

const { sideTheme, showSettings, navType, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle, dialogType, theme, breadcrumb, loginType, colorType } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
const state = {
  title: '',
  theme: storageSetting.theme || theme || '#409EFF',
  sideTheme: storageSetting.sideTheme || sideTheme,
  showSettings: showSettings,
  navType: storageSetting.navType || navType,
  topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
  tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
  fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
  sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
  dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle,
  logoHeight: '',
  dialogType: storageSetting.dialogType || dialogType,
  breadcrumb: storageSetting.breadcrumb || breadcrumb,
  loginType: storageSetting.loginType || loginType,
  colorType: storageSetting.colorType || colorType
}
const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      state[key] = value
    }
  }
}

const actions = {
  // 修改导航布局设置
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  // 设置网页标题
  setTitle({ commit }, title) {
    commit('CHANGE_SETTING', { key: 'title', value: title })
  },
  // 设置网页标题高度
  setLogoHeight({ commit }, height) {
    commit('CHANGE_SETTING', { key: 'logoHeight', value: height })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

