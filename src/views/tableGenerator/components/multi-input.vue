<template>
  <div class="multi-input">
    <el-input class="input-cell" v-for="(item,index) in arrValue" :key="index" v-model="arrValue[index]" :placeholder="'值'+(index+1)">
    </el-input>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      arrValue: []
    }
  },
  props: {
    // 数组值
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created() {
    this.arrValue = _.cloneDeep(this.value)
  },
  watch: {
    arrValue: {
      deep: true,
      handler(nv) {
        this.$emit('input', nv)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.multi-input{
    display: flex;
    flex-direction: column;
    .input-cell{
        margin-bottom: 4px;
    }
}
</style>
