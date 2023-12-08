<template>
  <el-checkbox-group v-model="type" @change="getResult">
    <el-checkbox v-for="(item,index) in types" :key="index" :label="item"></el-checkbox>
  </el-checkbox-group>
</template>
<script>
export default {
  model: {
    prop: 'result',
    event: 'getResult'
  },
  data() {
    return {
      type: []
    }
  },
  watch: {
    result: {
      handler(val) {
        if (val) {
          this.type = [...val]
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
