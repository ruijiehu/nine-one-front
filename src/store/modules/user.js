import { login, logout, getInfo, getPermissions } from '@/api/login'
import { getToken } from '@/utils/auth'
import md5 from 'js-md5'

const user = {
  state: {
    token: getToken(),
    userInfo: {},
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = md5(userInfo.password)
      const captcha = userInfo.captcha
      const captchaId = userInfo.captchaId
      return new Promise((resolve, reject) => {
        login({ username, password, captcha, captchaId }).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        Promise.all([getInfo(), getPermissions()]).then(res => {
          const userInfo = res[0]?.data
          const permissions = res[1]?.data
          const user = userInfo.user
          const avatar = (user.avatar == '' || user.avatar == null) ? require('@/assets/images/profile.jpg') : process.env.VUE_APP_BASE_API + user.avatar
          // if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', res.roles)
          //   commit('SET_PERMISSIONS', res.permissions)
          // } else {
          //   commit('SET_ROLES', ['ROLE_DEFAULT'])
          // }
          commit('SET_PERMISSIONS', permissions)
          commit('SET_ROLES', ['ROLE_DEFAULT'])
          commit('SET_USERINFO', userInfo)
          commit('SET_NAME', userInfo.userName)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        resolve()
      })
    }
  }
}

export default user
