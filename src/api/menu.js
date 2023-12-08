import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/router/all/auth?excludeTypes=P',
    method: 'get'
  })
}

// 查询货物列表
export function listGoods(query) {
  return request({
    url: '/freight/list',
    method: 'get',
    params: query
  })
}

// 新增货物
export function addGoods(data) {
  return request({
    url: '/freight/add',
    method: 'post',
    data: data
  })
}

// 编辑货物
export function editGoods(data) {
  return request({
    url: 'freight/edit',
    method: 'post',
    data: data
  })
}

// 删除货物
export function delGoods(data) {
  return request({
    url: '/freight/delete',
    method: 'delete',
    data: data
  })
}
