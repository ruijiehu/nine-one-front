<template>
  <el-dialog
    centered
    :title="env.title"
    :width="width"
    :visible.sync="innerVisible"

    cancelText="关闭"
  >
    <div :class="{ ['jeecg-form-container-disabled']: isLooking }">
      <el-form
        ref="form"
        :model="formData"
        :label-width="config.labelWidth||'100px'"

      >
        <el-row type="flex" style="flex-wrap:wrap">
          <template  v-for="item in fields">
            <h3 v-if="item.subtitle" :key="item.prop + 'title'">{{ item.subtitle }}</h3>
            <el-col :key="item.prop" :span="item.span" :offset="item.offset">

              <FormItem v-model="formData[item.prop]" v-bind="item" :type="item.formType" />

            </el-col>
          </template>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="handleCancel">关闭</el-button>
      <el-button v-if="!isLooking" type="primary" @click="handleOk">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import FormItem from './form-item.vue'
function defaultV(type) {
  switch (type) {
    case 'input':
      return ''
    default:
      return undefined
  }
}
export default {
  components: { FormItem },
  inject: ['getContext'],
  props: {
    config: Object,
    data: Object,
    visible: Boolean,
    status: String
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    isUpdate() {
      return this.status == 'update'
    },
    isLooking() {
      return this.status == 'looking'
    },
    fields() {
      if (!this.config || !this.config.fields) return []
      return this.config.fields.filter((item) => item.form !== false)
    }
  },
  watch: {
    status() {
      this.getEnv()
    },
    config: {
      handler() {
        if (!this.config) return
        this.initConfig()
        this.getEnv()
      }
    },
    data() {
      if (!this.data) {
        this.genForm()
      } else {
        this.formData = JSON.parse(JSON.stringify(this.data))
      }
    }
  },
  data() {
    return {
      title: '',
      width: 1200 + 'px',

      formData: {},
      parent: null,
      env: {}
    }
  },
  created() {},
  mounted() {
    this.getEnv()
  },
  methods: {
    handleCancel() {
      this.innerVisible = false
    },
    initConfig() {
      if (this.config.fields) {
        this.genForm()
      }
    },
    genForm() {
      const { fields } = this.config

      const temp = {}
      this.fields.forEach((item) => {
        temp[item.prop] = item.defaultValue || defaultV(item.formType)
      })
      this.formData = temp
    },
    handleOk() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        const { api } = this.env
        api(this.formData).then((res) => {
          const { success } = res
          if (success) {
            this.isUpdate ? parent.getList() : parent.handleFilter()
          }
        })
      })
    },
    getEnv() {
      this.parent = this.getContext()
      console.log(this.parent)
      if (this.status == 'looking') {
        this.env = {
          api: null,
          title: '查看'
        }
      } else if (this.status == 'update') {
        this.env = {
          api: this.parent && this.parent.actions.update && this.parent.actions.update.api,
          title: '编辑'
        }
      } else {
        this.env = {
          api: this.parent && this.parent.actions.create && this.parent.actions.create.api,
          title: '创建'
        }
      }
    },
    disabled(item) {
      return this.isUpdate && item.edit === false
    }
  }
}
</script>

<style scoped>
.jeecg-form-container-disabled {
  cursor: not-allowed;
}

.jeecg-form-container-disabled /deep/ .ant-form-item-control {
  -ms-pointer-events: none;
  pointer-events: none !important;
}
</style>
