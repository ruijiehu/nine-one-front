import router from './router'
import store from './store'
// import {
//   Message
// } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  isRelogin
} from '@/utils/request'

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    if (store.getters.roles.length === 0) {
      isRelogin.show = true
      // 判断当前用户是否已拉取完user_info信息
      store.dispatch('GetInfo').then(() => {
        isRelogin.show = false
        store.dispatch('GenerateRoutes').then(accessRoutes => {
          // 根据roles权限生成可访问的路由表
          router.addRoutes(accessRoutes) // 动态添加可访问路由表
          next({
            ...to,
            replace: true
          }) // hack方法 确保addRoutes已完成
        })
      }).catch(() => {
        // store.dispatch('LogOut').then(() => {
        //   Message.error(err)
        //   next({
        //     path: '/'
        //   })
        // })
      })
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
