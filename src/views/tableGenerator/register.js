
import Vue from 'vue'
const componentsBaseContext = require.context('./components/base', true, /setting.js/)
const componentsBusinessContext = require.context('./components/business', true, /setting.js/)
const register = (context) => {
  context.keys().forEach(component => {
    const componentConfig = context(component)
    const ctrl = componentConfig.default || componentConfig
    // 将公用的mixin混入组件中
    ctrl.mixins = ctrl.mixins || []
    const a = ctrl.name
    const b = ctrl
    Vue.component(a, b)
  })
}

register(componentsBaseContext)
register(componentsBusinessContext)
