import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { ROUTER_DIR_TYPE, LAYOUT, PARNET_VIEW, INNER_LINK } from '@/utils/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'
import toolRoutesData from '@/router/toolRoutes.json'

// 设置找不到页面跳转有权限第一页
const getPermissionUrl = (route, result = []) => {
  for (let i = 0; i < route.length; i++) {
    if (!route[i].hidden) {
      result.push(route[i].path)
      if (route[i] && route[i].children) {
        getPermissionUrl(route[i].children, result)
      }
      break
    }
  }
  return result
}
const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
    thirdRouters: null,
    defaultRouter: ''
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
    SET_DEFAULT_ROUTER: (state, defaultRouter) => {
      state.defaultRouter = defaultRouter
    },
    SET_THIRD_ROUTERS: (state, routes) => {
      state.thirdRouters = routes
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          // res.data = res.data.slice(0, 1)
          addToolRoutesInDevelopmentEnv(res)
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, true)
          // 根据环境判断登录跳转后默认页面
          // process.env.NODE_ENV==='development'?'/tool/index':
          const defaultRouter = getPermissionUrl(sidebarRoutes, []).join('/')
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
          rewriteRoutes.push({ path: '*', redirect: defaultRouter, hidden: true })
          router.addRoutes(asyncRoutes)
          commit('SET_ROUTES', rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
          commit('SET_DEFAULT_ROUTES', sidebarRoutes)
          commit('SET_TOPBAR_ROUTES', sidebarRoutes)
          // commit('SET_DEFAULT_ROUTER',defaultRouter)
          resolve(rewriteRoutes)
        })
      })
    }
  }
}

// 开发环境会强制添加工具相关路由
function addToolRoutesInDevelopmentEnv(res) {
  if (process.env.NODE_ENV === 'development' && !res.data?.some(item => ['tool', '/tool'].includes(item.path))) {
    if (!res.data) res.data = []
    res.data.push(toolRoutesData)
  }
}
// 获取component
function getComponent(route) {
  // let component = LAYOUT
  let component = null
  if (route.component) {
    component = route.component
  } else if (!route.component && route.path && route.path.startsWith('http')) {
    // 外部链接
    component = INNER_LINK
  } else if (!route.component && route.parentId && route.meta.menuType === ROUTER_DIR_TYPE) {
    component = PARNET_VIEW
  } else if (!route.component && route.meta.menuType === ROUTER_DIR_TYPE && route.children && route.children.length) {
    component = PARNET_VIEW
  }
  return component
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, type = false) {
  return asyncRouterMap.filter(route => {
    // 设置hidden属性
    route.hidden = route.hidden === '1'
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    route.component = getComponent(route)
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView' || route.children) {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    // 如果是目录类型，需要拼接上/
    if (route.meta && route.meta.menuType === ROUTER_DIR_TYPE) {
      route.path = `/${route.path}`
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el) => {
    if (el.children && el.children.length) {
      if ((el.component === 'ParentView' || el.children) && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views/${view}`], resolve)
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(
      /* webpackInclude: /\.vue$/ */
      /* webpackExclude__: /(tableGenerator|chartsGenerator|tool)/ */
      /* webpackMode: "lazy" */
      /* webpackPrefetch: false */
      /* webpackPreload: false */
      `@/views/${view}.vue`
    )
  }
}

export default permission
