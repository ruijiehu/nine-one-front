<template>
  <el-radio-group v-model="type"  size="small">
    <el-radio-button v-for="(item,index) in types" :key="index" :label="item"></el-radio-button>
  </el-radio-group>
</template>
<script>
export default {
  model: {
    prop: 'result',
    event: 'getResult'
  },
  data() {
    return {
      type: ''
    }
  },
  watch: {
    type: {
      handler() {
        this.getResult()
      },
      immediate: true

    },
    result: {
      handler(val) {
        if (val) {
          this.type = val
        }
      },
      immediate: true
    }
  },
  props: ['types', 'result'],
  methods: {
    getResult() {
      this.$emit('getResult', this.type)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-radio-button--small {
.el-radio-button__inner{
  padding:9px 10px !important;
}
}
</style>
