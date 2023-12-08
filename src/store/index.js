import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import chartConfig from './modules/chart-config'
import formFilterConfig from './modules/form-filter-config'
import tableConfig from './modules/table-config'
import currentConfig from './modules/current-config'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    currentConfig,
    tableConfig,
    permission,
    settings,
    chartConfig,
    formFilterConfig
  },
  getters
})

export default store
