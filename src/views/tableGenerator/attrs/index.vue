<template>
  <div class="attrs">
    <div class="tabs">
      <span v-for="(item,index) in tabs" :key="index" @click="currentKey = item.key" :class="currentKey===item.key?'active':''">
        {{item.value}}
      </span>
    </div>
    <fields ref="fields" v-if="currentKey === 'fields'"></fields>
    <page v-else></page>
  </div>
</template>
<script>
import fields from './fields'
import page from './page'
export default {
  components: { fields, page },
  data() {
    return {
      tabs: [{ key: 'fields', value: '字段属性' }, { key: 'page', value: '页面属性' }],
      currentKey: 'fields'
    }
  },
  methods: {
    validate() {
      return this.$refs.fields.validate()
    }
  }
}
</script>
<style lang="less" scoped>
.attrs{
    .tabs{
        display: flex;
        span{
            flex:1;
            text-align: center;
            padding:13px 0 14px;
            box-sizing: border-box;
            border-bottom: 2px solid #e4e7ed;
            font-size: 14px;
            cursor: pointer;
            color: #606266;
            &.active{
                border-color: #409eff;
            }
        }
    }
}
</style>
