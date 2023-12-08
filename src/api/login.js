import request from '@/utils/request'

// 登录方法
export function login(data) {
  return request({
    url: '/sys/bms/login',
    method: 'post',
    data
  })
}
// 是否需要验证码
export function checkcaptcha(username) {
  return request({
    url: `/sys/bms/needcaptcha?username=${username}`,
    method: 'get'
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/page',
    method: 'get'
  })
}
// 获取权限列表
export function getPermissions() {
  return request({
    url: '/menu/type',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/sys/bms/logout',
    method: 'get'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/sys/bms/captcha',
    method: 'get'
  })
}
