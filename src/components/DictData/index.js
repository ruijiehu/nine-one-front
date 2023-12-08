import Vue from 'vue'
import DataDict from '@/utils/dict'
import { getDicts as getDicts } from '@/api/system/dict/data'
import request from '@/utils/request'

function install() {
  Vue.use(DataDict, {
    metas: {
      '*': {
        labelField: 'dictLabel',
        valueField: 'dictValue',
        request(dictMeta) {
          const dictType = parseType(dictMeta.type)

          return dictType.url
            ? request(dictType.url).then((res) => res.data)
            : getDicts(dictMeta.type).then((res) => res.data)
        },
        dictTypeConverter(type) {
          const dictType = parseType(type)
          return dictType.type
        }
      }
    }
  })
}
function parseType(type) {
  if (/.+:\/.+/.test(type)) {
    const url = type.split(':')

    return { type: url[0], url: url[1] }
  }
  return { type }
}

export default {
  install
}
