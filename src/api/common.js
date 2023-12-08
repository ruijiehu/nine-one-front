import axios from 'axios'
import request from '@/utils/request'
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 10000
})

export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = request.post('/file', formData)
  return res
}

// 文件类型转Blob
const fileToBlob = (file, callback) => {
  return new Promise((resolve, reject) => {
    const type = file.type
    const reader = new FileReader()
    reader.onload = function(evt) {
      const blob = new Blob([evt.target.result], { type })
      resolve(blob)
    }
    reader.onerror = (reader, e) => reject(e)
    reader.readAsDataURL(file)
  })
}
