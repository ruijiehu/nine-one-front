import request from '@/utils/request'
import jszip from 'jszip'
import FileSaver from 'file-saver'
// 查询生成表数据
export function listTable(query) {
  return request({
    url: '/generator/tables',
    method: 'get',
    params: query
  })
}
// 查询db数据库列表
export function listDbTable(query) {
  return request({
    url: '/tool/gen/db/list',
    method: 'get',
    params: query
  })
}

// 查询表详细信息
export function getGenTable(tableId) {
  return request({
    url: '/tool/gen/' + tableId,
    method: 'get'
  })
}

// 修改代码生成信息
export function updateGenTable(data) {
  return request({
    url: '/tool/gen',
    method: 'put',
    data: data
  })
}
// 增加一条
export function addGenTable(data) {
  return request({
    url: '/tool/gen',
    method: 'post',
    data: data
  })
}

// 导入表
export function importTable(data) {
  return request({
    url: '/tool/gen/importTable',
    method: 'post',
    params: data
  })
}

// 预览生成代码
export function previewTable(tableId) {
  return request({
    url: '/tool/gen/preview/' + tableId,
    method: 'get'
  })
}

// 删除表数据
export function delTable(tableId) {
  return request({
    url: '/tool/gen/' + tableId,
    method: 'delete'
  })
}

// 生成代码（自定义路径）
export function genCode(tableName) {
  return request({
    url: '/tool/gen/genCode/' + tableName,
    method: 'get'
  })
}

// 同步数据库
export function synchDb(tableName) {
  return request({
    url: '/tool/gen/synchDb/' + tableName,
    method: 'get'
  })
}

// 生成smartv配置
export function generateSmartv(params) {
  return request({
    url: '/generator/diytable/generate',
    method: 'post',
    data: params
  })
}
// 获取swagger文档配置
export function getSwaggerApiList() {
  return request({
    url: '/v2/api-docs',
    method: 'get'
  })
}
// 下载接口
export async function downloadCode(generatorInfo) {
  if (typeof generatorInfo === 'string') {
    generatorInfo = await getTableConfig(generatorInfo)
    generatorInfo = generatorInfo.data
  }
  return request
    .post('/generator/code/download', generatorInfo, {
      responseType: 'blob'
    })
    .then((res) => {
      const fileName = `代码.zip`
      FileSaver.saveAs(res, fileName)
    })
}

// 下载smartv代码
export async function downloadSmartvCode(generatorInfo) {
  return request
    .post('/generator/diytable/download', generatorInfo, {
      responseType: 'blob'
    })
    .then((res) => {
      const fileName = `generator_${new Date().getTime()}.zip`
      FileSaver.saveAs(res, fileName)
    })
}

export async function getTableConfig(tableName) {
  return request.get('generator/table/config', {
    params: { tableName }
  })
}

export async function genCodes(generatorInfo) {
  if (typeof generatorInfo === 'string') {
    generatorInfo = await getTableConfig(generatorInfo)
    generatorInfo = generatorInfo.data
  }
  return request.post('/generator/code/generate', generatorInfo)
}

// 前端将字符串打包后下载
export async function downloadCode1(generatorInfo) {
  if (typeof generatorInfo === 'string') {
    generatorInfo = await getTableConfig(generatorInfo)
    generatorInfo = generatorInfo.data
  }

  const res2 = await request
    .post('/generator/code/generate', generatorInfo)
    .then((res) => {
      // eslint-disable-next-line new-cap
      const zip = new jszip()
      zip
        .folder('qianduan')
        .file('api.js', res.data.api)
        .file('index.vue', res.data.index)
      const houduanFiles = [
        'controller',
        'mapper',
        'model',
        'modelInDto',
        'modelOutDto',
        'service',
        'serviceImpl'
      ]

      for (const file of houduanFiles) {
        let name = ''
        if (file.includes('model')) {
          name = file.replace('model', generatorInfo.className)
        } else {
          name =
            generatorInfo.className + file[0].toUpperCase() + file.slice(1)
        }
        zip.folder('houduan').file(name + '.java', res.data[file])
      }
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        FileSaver.saveAs(blob, generatorInfo.tableName + '代码.zip')
      })
    })
  return res2
}
