<template>
  <div class="component-upload-image">
    <el-upload
      :multiple="multiple"
      :action="uploadImgUrl"
      list-type="picture-card"
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
      :on-preview="handlePictureCardPreview"
      :class="{ hide: fileList.length >= limit }"
      :accept="fileType.toString()"
    >
      <i class="el-icon-plus" v-if="multiple"></i>
      <template v-else>
        <i class="el-icon-plus" v-if="!value"></i>
        <img v-else :src="value" style="width: 100%; height: 100%" />
      </template>
    </el-upload>

    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
      </template>
      的文件
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      title="预览"
      width="800"
      append-to-body
    >
      <img
        :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getToken, TokenKey } from '@/utils/auth'
import { isExternal } from '@/utils/validate'

export default {
  props: {
    // 值的类型  默认为string类型
    valueType: {
      type: String,
      default: 'string' // string[]  object[]
    },
    // 是否可以上传多个
    multiple: Boolean,
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
      default: () => ['.png', '.jpg', '.jpeg']
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
      dialogImageUrl: '',
      dialogVisible: false,
      hideUpload: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/file', // 上传的图片服务器地址
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
          const list = Array.isArray(val) ? val : this.value.split(',')

          // 然后将数组转为对象数组
          this.fileList = list.map((item) => {
            if (typeof item == 'string') {
              if (!isExternal(item)) {
                throw new Error(
                  'image-upload组件 不支持 相对路径，请使用绝对路径'
                )
              }
              item = { name: item, url: item }
            }
            return item
          })
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
    // 删除图片
    // eslint-disable-next-line no-unused-vars
    handleRemove(file, fileList) {
      const findex = this.fileList.map((f) => f.name).indexOf(file.name)
      if (findex > -1) {
        this.fileList.splice(findex, 1)
        this.$emit('input', this.toOutValue(this.fileList))
      }
    },
    // 上传成功回调
    handleUploadSuccess(res, file, fileList) {
      if (!this.multiple) {
        fileList = [file]
      }
      const finish = () => {
        const temp = fileList
          .filter(
            (item) => item.response === undefined || item.response.success
          )
          .map((item) => ({
            name: item.response
              ? item.response.data.originalFilename
              : item.name,
            url: item.response ? item.response.data.webUrl : item.url
          }))
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
          this.$modal.msgError(`上传头像图片大小不能超过 ${this.fileSize} MB!`)
          return false
        }
      }
      this.$modal.loading('正在上传图片，请稍候...')
      this.number++
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`)
    },
    // 上传失败
    handleUploadError() {
      this.$modal.msgError('上传图片失败，请重试')
      this.$modal.closeLoading()
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 输出的值
    toOutValue(list, separator) {
      if (this.valueType === 'string') {
        let strs = ''
        separator = separator || ','
        for (const i in list) {
          strs += list[i].url + separator
        }
        return strs != '' ? strs.substr(0, strs.length - 1) : ''
      } else if (this.valueType === 'stringList') {
        return list.map((item) => item.url)
      } else return [...list]
    }
  }
}
</script>
<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
::v-deep.hide .el-upload--picture-card {
  display: none;
}
// 去掉动画效果
::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter,
.el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}
</style>
