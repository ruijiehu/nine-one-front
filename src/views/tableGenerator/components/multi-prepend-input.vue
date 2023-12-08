<template>
  <div class="multi-prepend-input">
    <el-input v-model="currentValue[item.props]" @change="getResult" v-for="(item,index) in multiData" :key="index">
      <template slot="prepend">{{item.label}}</template>
    </el-input>
  </div>

</template>
<script>
export default {
  model: {
    prop: 'result',
    event: 'getResult'
  },
  data() {
    return {
      currentValue: {}
    }
  },
  watch: {
  },
  props: ['multiData', 'result'],
  methods: {
    getResult() {
      this.$emit('getResult', this.currentValue)
    }
  }
}
</script>
