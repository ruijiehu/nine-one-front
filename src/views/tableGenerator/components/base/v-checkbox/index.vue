<template>
  <el-checkbox v-model="value"
               :label="label" border
               :size="size"
               :checked="checked"
               :true-label="trueLabel"
               :false-label="falseLabel"
               :disabled="disabled"
  >
    {{displayLabel}}
  </el-checkbox>
</template>

<script>
export default {
  valueProps: 'value',
  name: 'VCheckbox',
  data() {
    return {
      value: ''
    }
  },
  components: {
  },
  props: {
    // 标签
    label: {
      type: String
    },
    displayLabel: {
      type: String
    },
    // 参数名称
    paramName: {
      type: String
    },
    context: {
      type: Object
    },
    // 值变化的时候触发
    change: {
      type: Function,
      default: () => {
      }
    },
    // 初始值
    initValue: {
      default: ''
    },
    // 选中时候的值
    trueLabel: {
    },
    falseLabel: {

    },
    // 尺寸大小
    size: {
      type: String
    },
    // 当前是否勾选
    checked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      deep: true,
      handler(nv) {
        this.change && this.change.call(this.context, nv)
        this.$parent.getValues && this.$parent.getValues()
      }
    },
    initValue: {
      deep: true,
      immediate: true,
      handler(nv) {
        this.value = nv
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
