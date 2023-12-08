import request from '@/utils/request'

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/log',
    method: 'get',
    params: query
  })
}

// 删除操作日志
export function delOperlog(operId) {
  return request({
    url: '/monitor/operlog/' + operId,
    method: 'delete'
  })
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/monitor/operlog/clean',
    method: 'delete'
  })
}

export function exportList(query) {
  return request({
    url: '/log/export',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

