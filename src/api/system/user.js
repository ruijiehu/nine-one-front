import request from '@/utils/request'
import { parseStrEmpty } from '@/utils/nineone'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/user',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data: data
  })
}

// export function delUser(username) {
//   console.log(username)
//   return request({
//     url: '/user/' + username,
//     method: 'delete'
//   })
// }

// 删除用户
export function delUser(data) {
  return request({
    url: '/user',
    method: 'delete',
    data: data
  })
}

// 批量删除用户
export function delUsers(data) {
  return request({
    url: '/user/batch',
    method: 'delete',
    data: data
  })
}

// 用户密码重置
export function resetUserPwd(data) {
  return request({
    url: '/user/password/reset',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(params, status) {
  const data = params
  return request({
    url: '/user/status',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(data) {
  return request({
    url: '/user/password',
    method: 'put',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: '/system/user/authRole/' + userId,
    method: 'get'
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/system/user/authRole',
    method: 'put',
    params: data
  })
}

// 浙政钉获取用户信息
export const getUserInfo = (params) => {
  return request({
    url: '/sys/dinginner/login',
    method: 'get',
    params
  })
}

// 导出菜单列表
export function getUserImportTemplate(query) {
  return request({
    url: '/user/template',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
