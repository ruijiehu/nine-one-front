import request from '@/utils/request'

export function copyMenu(originUUid, toParentUUid) {
  return request.post(`/router/copy/${originUUid}/DEFAULT/${toParentUUid}`)
}

// 查询菜单列表
export function listMenu(query) {
  return request({
    // url: '/system/menu/list',
    url: '/router/all',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(uuid) {
  return request({
    url: '/router/detail/' + uuid,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/menu',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/router/DEFAULT',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/router',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(uuid) {
  return request({
    url: '/router/' + uuid,
    method: 'delete'
  })
}
// 确认导入路由菜单
export function getUpdateRouter(sign) {
  return request({
    url: `/router/import/${sign}`,
    method: 'post'
  })
}

// 菜单管理获取菜单列表
export function getRouterMenu() {
  return request({
    url: '/router/menu',
    method: 'get'
  })
}

// 导出菜单列表
export function exportList(query) {
  return request({
    url: '/router/export',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
