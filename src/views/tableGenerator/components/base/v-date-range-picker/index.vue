<template>
  <div class="date-range-picker">
    <label class="label" v-if="label">{{label}}</label>
    <el-date-picker
      v-model="rangedate"
      :value-format="formatter"
      :type="pickerType"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :default-time="['00:00:00', '23:59:59']"
      :clearable="isclear"
    >
    </el-date-picker>
  </div>
</template>
<script>
import { getDateStr } from '@/utils/index'
export default {
  valueProps: 'rangedate',
  name: 'VDateRangePicker',
  data() {
    return {
      rangedate: ['', '']
    }
  },
  props: {
    // 执行的上下文环境
    context: {
      type: Object
    },
    initValue: {
      type: Array
    },
    formatter: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    },
    // 向前推几天,用于计算开始时间
    days: {
      type: Number,
      default: 0
    },
    // 时间改变回调
    change: {
      type: Function
    },
    // 对应的参数名称
    paramName: {
      type: Array
    },
    label: {
      type: String
    },
    pickerType: {
      type: String,
      default: 'daterange'
    },
    isclear: {
      type: Boolean,
      default: false
    },
    startPlaceholder: {
      type: String,
      default: '选择开始日期'
    },
    endPlaceholder: {
      type: String,
      default: '选择结束日期'
    }
  },
  methods: {
  },
  mounted() {
    if (this.initValue) {
      this.rangedate = this.initValue
    } else {
      if (this.days) {
        this.rangedate = [getDateStr(this.days, this.formatter) + ' 00:00:00', getDateStr(0, this.formatter) + ' 23:59:59']
      }
    }
  },
  watch: {
    rangedate: {
      handler(val) {
        if (val === null) {
          this.rangedate = ['', '']
        } else {
          this.$emit('update:value', val)
          this.$emit('change', val)
          this.change && this.change.call(this.context, val)
          this.$parent.getValues && this.$parent.getValues()
        }
      }
    },
    initValue: {
      handler(nv) {
        this.rangedate = nv
      }
    },
    isclear: {
      handler(nv) {
        console.log(nv)
      },
      immediate: true
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
            font-size: 16px;
            width: 45%;
        }
        /deep/ .el-date-editor--daterange.el-input__inner{
            width: 300px;
             height: 38px;
            line-height: 38px;
            font-size: 16px;
               &::placeholder{
              font-size: 16px;
            }
        }
                /deep/ .el-date-editor--monthrange.el-input__inner{
            width: 220px;
             height: 38px;
            line-height: 38px;
            font-size: 16px;
               &::placeholder{
              font-size: 16px;
            }
        }

        /deep/ .el-date-editor .el-range__icon{
            // display: none;
        }

        /deep/ .el-date-editor .el-range__close-icon{
            // display: none;
        }
         label{
          font-size: 14px;
          color: #767676;
          margin-right: 12px;
        }
    }
</style>
