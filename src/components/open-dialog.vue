<template>
  <div class="model open-dialog" v-if="isShow">
    <div class="model-content-wrap">
      <div class="model-content animated zoomIn" :style="style">
        <div class="dialog-header" >
          <slot name="title">
            <span class="dialog-title" v-if="title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="dialog-headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose">
            <i class="dialog-close-icon" :class="title?'i-close':''"></i>
          </button>
        </div>
        <div class="dialog-body">
          <slot></slot>
        </div>
        <div class="dialog-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import $ from 'jquery'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    showClose: { // 是否显示关闭按钮
      type: Boolean,
      default: true
    },
    isShow: {
      type: Boolean,
      default: false
    },
    // 宽度
    width: {
      type: String, // 弹框宽度
      default: '900px'
    },
    isNoMask: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style() {
      const style = {}
      if (this.width) {
        style.width = this.width
      }
      if (this.isNoMask) {
        style.width = '100%'
        style.height = '100%'
        style.top = 0
        style.padding = '60px 20px'
      } else {
        style.maxHeight = '700px'
      }
      return style
    }
  },
  watch: {
    // 监听是否显示,为了给下拉框设置层级
    isShow() {
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
<style lang="less" scoped>
 .model{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1200;
    background: rgba(0, 0, 0, 0.6);
    .model-content-wrap{
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      top: 0;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .model-content{
      margin: auto;
      color: #414141;
      width: 900px;
      // max-height: 700px;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: #fff;
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
      border-radius: 4px;
      border: solid 1px #707070;
      padding:100px 80px 60px;
      box-sizing: border-box;
      position: relative;
      .dialog-header {
        position: absolute;
        width: 100%;
        right: 0px;
        top: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: #303133;
        background-color: #e6eff5;
        .dialog-title{
          padding:8px  0;
        }
      }
      .dialog-headerbtn{
        padding: 0;
        background: 0 0;
        border: none;
        outline: 0;
        cursor: pointer;
        font-size: 16px;
        position: absolute;
        right:0;
        top:0;
        z-index: 999;
        .dialog-close-icon {
          width:53px;
          height:53px;
          background-image:url('~@/assets/img/apply-close.png');
          background-repeat:no-repeat;
          background-size:100% 100%;
          cursor: pointer;
          display: inline-block;

        }
        .i-close{
          background-image:url('~@/assets/img/apply-close.png');
        }
        .dialog-close-icon:hover{
          transform: scale(1.1);
        }
      }
      .dialog-body{
        margin-top: 20px;
      }
            &.animated{
            animation-duration: 0.5s;
            }
    }
  }
</style>
