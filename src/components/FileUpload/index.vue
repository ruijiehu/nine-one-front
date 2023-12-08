<template>
  <el-upload
    :multiple="multiple"
    :action="uploadFileUrl"
    list-type="text"
    :on-success="handleUploadSuccess"
    :before-upload="handleBeforeUpload"
    :limit="limit"
    :on-error="handleUploadError"
    :on-exceed="handleExceed"
    name="file"
    :on-remove="handleRemove"
    :show-file-list="multiple"
    :headers="headers"
    :file-list="fileList"
    :class="{ hide: fileList.length >= limit }"
    :accept="fileType.toString()"

  >
    <!-- 上传按钮 -->
    <el-button type="primary">选取文件</el-button>
    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="fileSize">
        大小不超过
        <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
      </template>
      的文件
    </div>
  </el-upload>
</template>

<script>
import { getToken, TokenKey } from '@/utils/auth'
export default {
  props: {
    // 值的类型  默认为string类型
    valueType: {
      type: String,
      default: 'string' // string[]  object[]
    },
    // 是否可以上传多个
    multiple: {
      type: Boolean,
      default: true
    },
    value: [String, Object, Array],
    // 图片数量限制
    limit: {
      type: Number,
      default: 5
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ['.doc', '.xls', '.txt', '.pdf', '.xlsx', '.docx']
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      number: 0,
      responseNumber: 0,
      uploadList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/file', // 上传的图片服务器地址
      headers: {
        [TokenKey]: getToken()
      },
      fileList: []
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          // 首先将值转为数组
          let list = Array.isArray(val) ? val : this.value.split(',')
          list = list.map(item => (typeof item === 'string' ? { name: item, url: item } : item))
          // eslint-disable-next-line no-unused-vars
          list.forEach((item, index) => {
            console.log(val, this.existFile(item))
            if (!this.existFile(item)) this.fileList.push(item)
          })

          // 然后将数组转为对象数组
          // this.fileList = list.map((item) => {
          //   if (typeof item == 'string') {
          //     if (!isExternal(item)) {
          //       throw new Error(
          //         'image-upload组件 不支持 相对路径，请使用绝对路径'
          //       )
          //     }
          //     item = { name: item, url: item }
          //     // item.uid = randomString()
          //   }
          //   return item
          // })
        } else {
          this.fileList = []
          return []
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize)
    }
  },
  methods: {
    existFile(url) {
      if (typeof url !== 'string') {
        url = url.url
      }
      return this.fileList.some(item => {
        const temp = this.getUrl(item)
        return temp == url
      })
    },
    // 删除图片
    handleRemove(file, fileList) {
      console.log(JSON.stringify(fileList), 'remove')
      this.fileList = fileList
      this.$emit('input', this.toOutValue(this.fileList))
    },
    // 上传成功回调
    handleUploadSuccess(res, file, fileList) {
      const finish = () => {
        const temp = fileList
          .filter(
            (item) => item.response === undefined || item.response.success
          )
          .map((item) => ({
            name: item.response
              ? item.response.data.originalFilename
              : item.name,
            url: this.getUrl(item)
          }))

        this.fileList = fileList
        this.$emit('input', this.toOutValue(temp))
      }
      this.responseNumber++
      if (this.number == this.responseNumber) {
        finish()
        this.number = 0
        this.responseNumber = 0
        this.$modal.closeLoading()
      }
    },
    // 上传前loading加载
    handleBeforeUpload(file) {
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize
        if (!isLt) {
          this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`)
          return false
        }
      }
      this.$modal.loading('正在上传文件，请稍候...')
      this.number++
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`)
    },
    // 上传失败
    handleUploadError(res) {
      const msgs = Object.values(res.msgs)
      this.$modal.warning(msgs[0])
      this.$modal.closeLoading()
    },

    // 输出的值
    toOutValue(list, separator) {
      if (this.valueType === 'string') {
        let strs = ''
        separator = separator || ','
        for (const i in list) {
          strs += this.getUrl(list[i]) + separator
        }
        return strs != '' ? strs.substr(0, strs.length - 1) : ''
      } else if (this.valueType === 'string[]') {
        return list.map((item) => item.url)
      } else return [...list]
    },
    getUrl(item) {
      return item.response ? item.response.data.webUrl : item.url
    }
  }
}
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>
