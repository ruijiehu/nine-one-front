<template>
  <el-dialog title="菜单选择" :visible.sync='innerVisible' destroy-on-close>
    <el-tree ref="tree" :data="data" :props="{label:'name'}" node-key='uuid' show-checkbox check-strictly @check='check'/>
    <div slot="footer">
      <el-button type="primary" @click="handleSure">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    data: Array
  },
  computed: {
    innerVisible: {
      get() { return this.visible },
      set(val) { this.$emit('update:visible', val) }
    }
  },
  methods: {
    check(data) {
      this.$refs.tree.setCheckedKeys([data.uuid])
    },
    handleSure() {
      const keys = this.$refs.tree.getCheckedKeys()
      this.$emit('confirm', keys)
      this.innerVisible = false
    },
    handleClose() {
      this.innerVisible = false
    }
  }
}
</script>

<style>

</style>
