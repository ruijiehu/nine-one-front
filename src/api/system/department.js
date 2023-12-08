import request from '@/utils/request'

// 查询部门树
export function getDeptTree(query) {
  return request({
    url: '/dept/tree',
    method: 'get',
    params: query
  })
}

// 查询部门列表
export function getDeptList(query) {
  return request({
    url: '/dept/dept',
    method: 'get',
    params: query
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/dept',
    method: 'post',
    data: data
  })
}

// 删除部门
export function delDept(uuid) {
  return request({
    url: `/dept/${uuid}`,
    method: 'delete'
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/dept',
    method: 'put',
    data: data
  })
}

// 查询部门明细
export function getDeptDetail(uuid) {
  return request({
    url: `/dept/${uuid}`,
    method: 'get'
  })
}

// 修改部门顺序
export function updateDeptSort(data) {
  return request({
    url: '/dept/updateSort',
    method: 'put',
    data: data
  })
}

// 修改上级部门
export function updateDeptParent(data) {
  return request({
    url: '/dept/updateParent',
    method: 'put',
    data: data
  })
}

// 查询部门成员列表
export function getDeptUser(query) {
  return request({
    url: `/dept-user`,
    method: 'get',
    params: query
  })
}

// 部门新增成员选项列表
export function getUserOptionsExDept(query) {
  return request({
    url: `/dept-user/userOptionsExDept`,
    method: 'get',
    params: query
  })
}

// 部门新增成员
export function postDeptUser(data) {
  return request({
    url: `/dept-user`,
    method: 'post',
    data: data
  })
}

// 移除部门成员批量
export function delDeptUser(data) {
  return request({
    url: '/dept-user/deleteBatch',
    method: 'delete',
    data: data
  })
}

// 通过用户获取当前是否在别的部门
export function getByUser(id) {
  return request({
    url: `/dept-user/getByUser/${id}`,
    method: 'get'
  })
}
