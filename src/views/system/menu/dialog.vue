<template>
  <el-dialog
    title="本次路由变更记录如下"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :visible.sync="innerVisible"
    width="40%"
  >
    <div>
      <div>
        <p class="tit">默认</p>
        <ul class="router_ul jiaxing" v-if="routerchange.DEFAULT">
          <li class="router_li" v-for="(item, index) in routerchange.DEFAULT" :key="index">
            <p class="tit_name">路由名：{{ item.name }}</p>
            <ul class="router_ul" v-if="item.fields">
              <li class="router_li" v-for="(ele, val) in item.fields" :key="val">
                修改内容：
                <span>{{ ele.name }}({{ ele.field }})</span>&nbsp;新值:
                <span>{{ ele.newValue }}</span>&nbsp;原值：
                <span>{{ ele.oldValue }}</span>
              </li>
            </ul>
          </li>
        </ul>
        <p v-else>无修改</p>

        <p class="tit">所有菜单类</p>
        <ul class="router_ul jiaxing" v-if="routerchange.allMenuClass">
          <li class="router_li" v-for="(item, index) in routerchange.allMenuClass" :key="index">
            路由名：{{ item.name }}
            <ul class="router_ul" v-if="item.fields">
              <li class="router_li" v-for="(ele, val) in item.fields" :key="val">
                修改内容：
                <span>{{ ele.name }}({{ ele.field }})</span>&nbsp;新值:
                <span>{{ ele.newValue }}</span>&nbsp;原值：
                <span>{{ ele.oldValue }}</span>
              </li>
            </ul>
          </li>
        </ul>
        <p v-else>无修改</p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelRouter">取 消</el-button>
      <el-button type="primary" @click="confirmRouter">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'routerchange'],
  computed: {
    innerVisible: {
      get() { return this.dialogVisible },
      set(val) { this.$emit('update:dialogVisible', val) }
    }
  },
  methods: {
    cancelRouter() {
      // this.dialogVisible = false

      this.$emit('closeDiolog', false)
    },
    confirmRouter() {
      // this.dialogVisible = false
      // this.$refs.upload.clearFiles()
      this.$emit('closeDiolog', true)
    }
  }
}
</script>

<style>
.jiaxing {
  max-height: 300px;
  overflow-y: auto;
}
</style>
