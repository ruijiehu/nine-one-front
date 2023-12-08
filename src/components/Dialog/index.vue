<template>
  <div class="Dialog">
    <template v-if="dialogType === 'right'">
      <el-drawer :visible.sync="dialogShow" direction="rtl" v-bind="$attrs">
        <slot></slot>
        <div class="footer-drawer-box">
          <slot name="footer"></slot>
        </div>
      </el-drawer>
    </template>
    <template v-else>
      <v-dialog :visible.sync="dialogShow" v-bind="$attrs">
        <slot></slot>
        <div class="footer-dialog-box">
          <slot name="footer"></slot>
        </div>
      </v-dialog>
    </template>
  </div>
</template>

<script>
import { Dialog } from 'element-ui'
export default {
  data() {
    return {}
  },
  components: {
    'v-dialog': Dialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogType() {
      return this.$store.state.settings.dialogType
    },
    dialogShow: {
      get() {
        return this.visible
      },
      set() {
        this.$emit('update:visible', false)
      }
    }
  }
}
</script>

  <style lang="less" >
.el-drawer.rtl {
  border-radius: 10px 0px 0px 10px;
  padding: 18px 12px 14px 20px;
  box-sizing: border-box;
}
.el-drawer__body {
  padding: 0 50px 0 38px;
}
.el-drawer__header {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  border-bottom: 1px solid #e7e7e7;
  width: calc(100% - 32px);
  margin-left: 20px;
  padding: 18px 0 12px 0;
}
.footer-drawer-box {
  display: flex;
  justify-content: flex-end;
}
.footer-dialog-box {
  display: flex;
  justify-content: flex-end;
}
.el-dialog__header {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  border-bottom: 1px solid #e7e7e7;
  width: calc(100% - 32px);
  margin-left: 20px;
  padding: 18px 0 12px 0;
}
.el-dialog__body {
  padding: 27px 50px 25px 38px;
}
.el-dialog:not(.is-fullscreen) {
  margin-top: 0 !important;
}
.el-dialog {
  top: 50%;
  transform: translateY(-50%);
  border-radius: 10px;
}
</style>

