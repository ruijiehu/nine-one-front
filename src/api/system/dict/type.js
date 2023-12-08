import request from '@/utils/request'

// 查询大类列表
export function listType(query) {
  return request({
    url: '/type/list',
    method: 'get',
    params: query
  })
}

// 查询大类详细
export function getType(dictId) {
  return request({
    url: '/dict/type/' + dictId,
    method: 'get'
  })
}

// 新增大类
export function addType(data) {
  return request({
    url: '/type/add-big',
    method: 'post',
    data: data
  })
}

// 修改大类
export function updateType(data) {
  return request({
    url: '/type/edit-big',
    method: 'post',
    data: data
  })
}

// 删除大类
export function delType(inDto) {
  return request({
    url: '/type/delete-big',
    method: 'delete',
    data: inDto
  })
}

// 刷新字典缓存
export function refreshCache() {
  return request({
    url: '/dict/type/refreshCache',
    method: 'delete'
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/dict/type/optionselect',
    method: 'get'
  })
}

// 获取字典子选项列表
export function getSubListItem(param) {
  return request({
    url: `/type/sub`,
    method: 'get',
    params: param
  })
}

// 添加小类
export function addSubDict(params) {
  return request({
    url: '/type/add-sub',
    method: 'post',
    data: params
  })
}

// 修改小类
export function updateSubDict(params) {
  return request({
    url: '/type/edit-sub',
    method: 'post',
    data: params
  })
}

// 删除小类
export function deleteSubDict(params) {
  return request({
    url: '/type/delete-sub',
    method: 'delete',
    data: params
  })
}
