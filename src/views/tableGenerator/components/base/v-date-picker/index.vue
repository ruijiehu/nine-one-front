<template>
  <div class="date-range-picker">
    <label class="label" v-if="label">{{label}}</label>
    <el-date-picker
      v-model="date"
      :value-format="formatter"
      :type="pickerType"
      :placeholder="placeholder"
      :clearable="clearFlag"
      :default-value="initValue"
      :readonly="readonly"
    >
    </el-date-picker>
  </div>
</template>
<script>
import { getDateStr } from '@/utils/index'
export default {
  name: 'VDatePicker',
  valueProps: 'date',
  data() {
    return {
      date: ''
    }
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    clearFlag: {
      type: Boolean,
      default: false
    },
    // 执行的上下文环境
    context: {
      type: Object
    },
    initValue: {
      type: String
    },
    formatter: {
      type: String,
      default: 'yyyy/MM/dd'
    },
    pickerType: {
      type: String,
      default: 'date'
    },
    // 向前推几天,用于计算开始时间
    days: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: '选择日期'
    },
    defaultTime: {
      type: String,
      default: ' 00:00:00'
    },
    // 时间改变回调
    change: {
      type: Function
    },
    // 对应的参数名称
    paramName: {
      type: String
    },
    label: {
      type: String
    }
  },
  methods: {
  },
  mounted() {
    if (this.initValue) {
      this.date = this.initValue
    } else {
      if (this.days || this.days === 0) {
        this.date = getDateStr(this.days, this.formatter) + this.defaultTime
      }
    }
  },
  watch: {
    initValue: {
      handler() {
        this.date = this.initValue
      }
    },
    date: {
      handler(val) {
        this.$emit('update:value', val)
        this.$emit('change', val)
        this.change && this.change.call(this.context, val)
        this.$parent.getValues && this.$parent.getValues()
      }
    }
  }
}
</script>
<style lang="less" scoped>
    .date-range-picker{
        display: inline-flex;
        overflow: hidden;
        align-items: center;
        /deep/ .el-date-editor .el-range-input{
            width: 45%;
        }
        /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
            width: 160px;
            .el-input__inner{
                height: 38px;
                line-height: 38px;
                font-size: 16px;
                &::placeholder{
                  font-size: 16px;
                }
            }
        }
        /deep/ .el-date-editor .el-range__icon{
            display: none;
        }
        /deep/ .el-date-editor .el-range__close-icon{
            display: none;
        }
        .label{
          font-size: 14px;
          color: #767676;
          margin-right: 12px;
        }
    }
</style>
