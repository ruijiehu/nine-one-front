<template>
  <div class="v-select">
    <label v-if="label">{{label}}</label>
    <el-select v-model="value" :placeholder="placeHolder" :style="'width:'+width+'px'">
      <el-option
        v-for="item in handleOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { isPromise } from '@/utils/index'
export default {
  name: 'VSelect',
  valueProps: 'value',
  data() {
    return {
      value: '',
      // 处理后的options
      handleOptions: []
    }
  },
  created() {
    this.resolveOptions()
    this.resolveInitvalue()
  },
  mounted() {
    // 如果是通过promise去加载的，那就需要等待加载完
    this.$on('optionsReady', () => {
      this.resolveInitvalue()
    })
  },
  methods: {
    // 对原始的options进行处理
    resolveOptions() {
      // 如果是个promise，那就得等数据加载完
      if (isPromise(this.options)) {
        this.options.then(res => {
          if (res.status === 200) {
            const options = res.data
            this.handleOptions = options
            if (this.optionHandler) {
              this.handleOptions = this.optionHandler(options)
            }
            this.$emit('optionsReady')
          }
        })
      } else {
        const optionsCopy = JSON.parse(JSON.stringify(this.options))
        this.handleOptions = optionsCopy
        if (this.optionHandler) {
          this.handleOptions = this.optionHandler(optionsCopy)
        }
      }
    },
    // 解决initValue问题
    resolveInitvalue() {
      if (this.initValue || this.initValue === 0 || this.initValue === '') {
        this.value = this.initValue
      } else if (this.initLabel) {
        const targetObj = this.handleOptions.find((item) => {
          return item.label === this.initLabel
        })
        if (targetObj) {
          this.value = targetObj.value
        }
      } else {
        if (this.handleOptions.length > 0) {
          this.value = this.handleOptions[0].value
        }
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('update:val', val)
        this.$emit('change', val)
        // 触发定义的change回调函数
        if (this.change && typeof this.change === 'function') {
          this.change && this.change.call(this.context, val)
        }
        // 通知父元素更新数据
        this.$parent.getValues && this.$parent.getValues()
      }
    },
    options: {
      deep: true,
      handler() {
        this.resolveOptions()
        this.resolveInitvalue()
      }
    },
    // 初始值发生变化后，则同步value
    initValue() {
      this.resolveInitvalue()
    }
  },
  // options的列表
  props: {
    // 下拉框可选内容
    options: {
    },
    // 初始的值
    initValue: {
    },
    // 初始值对应的label
    initLabel: {
      type: String
    },
    // 默认输入
    placeHolder: {
      type: String,
      default: '请输入搜索内容'
    },
    // option处理选项
    optionHandler: {
      type: Function
    },
    // 当值改变时的回调
    change: {
      type: Function
    },
    // 标签
    label: {
      type: String
    },
    context: {
      type: Object
    },
    // 参数名称
    paramName: {
      type: String
    },
    // 宽度
    width: {
      type: Number,
      default: 90
    }
  }
}
</script>
<style lang="less" scoped>
  .v-select{
    display: inline-flex;
    align-items: center;
    vertical-align: top;
    label{
      font-size: 14px;
      color: #767676;
      margin-right: 12px;
    }
    /deep/ .el-input__inner{
      height: 38px;
      line-height: 38px;
      font-size: 16px;
    }
    /deep/ .el-input__icon{
      line-height: 30px;
    }
  }
</style>
