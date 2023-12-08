<template>
  <div class="input-wrap">
    <label v-if="label">{{label}}</label>
    <input
      v-model="value"
      @keyup.enter="enter"
      autocomplete="off"
      :placeholder="placeHolder"
      :style="'width:'+width+'px'"
    />
  </div>
</template>
<script>
export default {
  name: 'VInput',
  valueProps: 'value',
  data() {
    return {
      // 输入值
      value: ''
    }
  },
  created() {
    if (this.initValue) {
      this.value = this.initValue
    }
  },
  props: {
    // 执行的上下文环境
    context: {
      type: Object
    },
    // 初始值
    initValue: {
      default: ''
    },
    // 默认输入
    placeHolder: {
      type: String,
      default: '请输入搜索内容'
    },
    // 值改变事件
    change: {
      type: Function,
      default: () => {
      }
    },
    // 按下enter事件
    enter: {
      type: Function,
      default: function() {
        const value = event.target.value
        if (value) {
          this.$parent.submit()
        }
      }
    },
    // label标签
    label: {
      type: String,
      default: ''
    },
    // 对应的参数名称
    paramName: {
      type: String
    },
    // 宽度
    width: {
      type: Number,
      default: 200
    }
  },
  watch: {
    value: {
      handler(nv) {
        this.change && this.change.call(this.context, nv)
        // 通知父元素更新数据
        this.$parent.getValues && this.$parent.getValues()
      }
    },
    // 如果初始值更改后,重新设置value
    initValue(nv) {
      this.value = nv
    }
  },
  methods: {
    submitValue() {
    }
  }
}
</script>
<style lang="less" scoped>
.input-wrap{
  display: inline-flex;
  vertical-align: top;
  align-items: center;
    label{
      font-size: 14px;
      color: #767676;
      margin-right: 12px;
    }
  input{
    box-sizing: border-box;
    display: inline-block;
    padding: 2px;
    overflow: hidden;
    border-radius: 4px;
    padding-left: 6px;
    height: 38px;
    line-height: 38px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: #767676;
    outline: none;
    font-size: 16px;
    &::placeholder{
      color: #e2e2e2;
      font-size: 16px;
    }
  }
}
</style>
