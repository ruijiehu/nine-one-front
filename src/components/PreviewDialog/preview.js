import Vue from 'vue'
import { getDictDataByUrl } from '@/api/system/dict/data'
import * as validate from '@/utils/validate'
import request from '@/utils/request'
import store from '../../store'

/**
 *
 * @param {*} data {api:'',index:''}
 * @returns
 */
let instance = null
const cacheGlobal = Object.create(null)
function destroyInstance() {
  if (instance) {
    instance.$destroy()
    /** @type{HTMLDivElement} */
    const el = instance.$el.parentElement

    el.removeChild(el.firstChild)
    const newEl = document.createElement('div')
    newEl.id = 'preview'
    el.appendChild(newEl)
    instance = null
  }
}
function mockApi(Api, list) {
  const keys = Object.keys(Api)
  const result = {}

  for (const key of keys) {
    if (key.startsWith('list')) {
      result[key] = () =>
        // eslint-disable-next-line no-unused-vars
        new Promise((resolve, reject) =>
          resolve({
            status: 200,
            success: true,
            msg: {},
            data: {
              total: list.length,
              list: [...list]
            }
          })
        )
    } else if (key.startsWith('add')) {
      result[key] = (data) =>
        // eslint-disable-next-line no-unused-vars
        new Promise((resolve, reject) => {
          list.push({ ...data, uuid: new Date().getTime() })
          resolve({
            status: 200,
            success: true,
            msg: {}
          })
        })
    } else if (key.startsWith('update')) {
      result[key] = (data) =>
        // eslint-disable-next-line no-unused-vars
        new Promise((resolve, reject) => {
          const index = list.findIndex((o) => o.uuid == data.uuid)
          if (index != -1) {
            list.splice(index, 1, data)
            resolve({
              status: 200,
              success: true,
              msg: {}
            })
          }
        })
    } else if (key.startsWith('get')) {
      result[key] = (uuid) =>
        // eslint-disable-next-line no-unused-vars
        new Promise((resolve, reject) => {
          const item = list.find((o) => o.uuid == uuid)
          console.log(JSON.parse(JSON.stringify(item)))
          resolve({
            status: 200,
            success: true,
            msg: {},
            data: JSON.parse(JSON.stringify(item))
          })
        })
    } else if (key.startsWith('del')) {
      result[key] = ({ uuids }) =>
        // eslint-disable-next-line no-unused-vars
        new Promise((resolve, reject) => {
          uuids.forEach((uuid) => {
            const index = list.findIndex((o) => o.uuid == uuid)
            if (index != -1) {
              list.splice(index, 1)
            }
          })
          resolve({
            status: 200,
            success: true,
            msg: {},
            data: null
          })
        })
    }
  }
  return result
}
export function previewInitComponent(data, { el = '#preview', mock = true } = {}) {
  if (!data || !data.index || !data.api) return
  // data.index = data.index.replace(/^\/\/.*\n/g, () => '')
  // data.api = data.api.replace(/^\/\/.*\n/g, () => '')
  data.index = replaceCommentLines(data.index)
  data.api = replaceCommentLines(data.api)
  // console.log(data.api)
  if (instance !== null) reset()

  const Api = getApi(data.api)
  for (const apiName of Object.keys(Api)) {
    data.index = replaceVariable(data.index, apiName, 'Api.' + apiName)
  }
  cacheGlobal.Api = window.Api
  cacheGlobal.request = window.request
  cacheGlobal.validate = window.validate
  cacheGlobal.getDictDataByUrl = window.getDictDataByUrl

  window.Api = mock ? mockApi(Api, []) : Api
  window.request = request
  window.validate = validate
  window.getDictDataByUrl = getDictDataByUrl

  const script = getScript(data.index)

  instance = new Vue({
    el,
    store,
    template: getTemplate(data.index),
    ...script
  })

  function reset() {
    window.Api = cacheGlobal.Api
    window.request = cacheGlobal.request
    window.validate = cacheGlobal.validate
    window.getDictDataByUrl = cacheGlobal.getDictDataByUrl
    destroyInstance()
  }
  return reset
}

function getScript(str) {
  const start = str.indexOf('export default')
  const end = str.lastIndexOf('</script>')
  const temp = str.slice(start + 14, end)
  const fn = new Function('return ' + temp)
  return fn()
}
function getTemplate(str) {
  const start = str.indexOf('<template>')
  const end = str.lastIndexOf('</template>')
  return str.slice(start + 10, end)
}

function getApi(str) {
  let result = {}
  str = str.split('export').slice(1)
  let tempResult = '{'
  str.forEach((item, index) => {
    item = item.trim()
    // let body=getFunctionBody(item)
    const name = getFunctonName(item)
    tempResult += `${name}:${item}` + (item.endsWith(',') ? '' : ',') + '\n'
  })
  tempResult += '}'
  // console.log(tempResult)
  result = new Function('return ' + tempResult)()
  return result
}

// 合法的变量名开头只能是字母、_ 、 $，第二位开始 字母、_ 、 $、数字,且
// 如果模板代码中存在相同名的局部变量  或者   同名对象字面量的属性 ，程序会出现不可预测的结果
function matchVariableReg(str) {
  if (str.startsWith('$')) str = '\\' + str// $是一个特殊符号需要转义
  // const reg = new RegExp("^[^a-zA-Z_$]" + str + "[a-zA-Z_$d]$", "g");
  const reg = new RegExp('[^a-zA-Z_$.]' + str + '[^a-zA-Z_$d:]', 'g')
  return reg
}
// 替换变量
function replaceVariable(str, variable, replacedVariableName) {
  // str = str.replace(/ *:/, () => ":");
  return str.replace(
    matchVariableReg(variable),
    (item) => item[0] + replacedVariableName + item[item.length - 1]
  )
}
// 去除注释行
function replaceCommentLines(str) {
  return str.replace(/\n *\/\/.*/g, '')
}

// str只能有一个函数
function getFunctionBody(str) {
  return str.match(/\{([\s\S]*)\}/)[1]?.trim()
}
function getFunctonName(str) {
  return str.match(/function(.*)\(/)[1]?.trim()
}

export const str = `<template><div>{{data}}</div></template><script>
  //sdfs
  export default
   {data(){return {data:1}}}</script>`
