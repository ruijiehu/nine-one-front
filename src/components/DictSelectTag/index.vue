<template>
  <div>
    <el-select v-model="innerValue" v-bind="$attrs">

      <el-option
        v-for="item in dict.type[dictCode]"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    dictCode: String,
    value: [Number, String]
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    innerValue: {
      get() { return this.value },
      set(val) { this.$emit('change', val) }
    }
  },
  created() {
    if (!this.dictCode) throw new Error('dict-select-tag组件必须提供dictCode')
    this.$options.dicts = [this.dictCode]
    this.$resetDicts()
  },
  methods: {
    onDictReady() {
      console.log(this.dict)
    }
  }

}
</script>

<style>

</style>
