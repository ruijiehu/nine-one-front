<template>
  <div class="widget " :class="[isLayout?'layout':'',isFullWidth?'full-width':'']" @contextmenu.capture="showContentMenu" v-clickoutsidenami="hideContentMenu">
    <div class="widget-mask " :class="isActive?'active':''" >
      <div class="actions" v-if="isActive&&isShow" :style="{left:posLeft+'px',top:posTop+'px'}">
        <span @click.stop="change"><i v-if="isChange" class="iconfont icon-jilianxuanze widget-icon" ></i>切换</span>
        <span @click.stop="copy"><i class="iconfont icon-icon_clone widget-icon" ></i>复制</span>
        <span @click.stop="del"><i class="iconfont icon-trash widget-icon" ></i>删除</span>
      </div>
      <div class="widget-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    isLayout: {
      type: Boolean,
      default: false
    },
    isFullWidth: {
      type: Boolean,
      default: false
    },
    isChange: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: false,
      posLeft: 0,
      posTop: 0
    }
  },
  watch: {
    isActive: {
      handler(val) {
        if (!val) {
          this.isShow = false
        }
      }
    }
  },
  methods: {
    copy() {
      this.$emit('copy', this.data)
      this.isShow = false
    },
    del() {
      this.$emit('remove', this.data)
      this.isShow = false
    },
    change() {
      this.$emit('exchange', this.data)
      this.isShow = false
    },
    showContentMenu(e) {
      if (!this.isActive) {
        return
      }
      // console.log(e)
      e.stopPropagation()
      e.preventDefault()

      // 计算菜单相对于编辑器的位移
      let target = e.target
      let top = e.offsetY
      let left = e.offsetX
      while (!target.className === 'widget') {
        left += target.offsetLeft
        top += target.offsetTop
        target = target.parentNode
      }
      this.isShow = true
      this.posLeft = left
      this.posTop = top
    },
    hideContentMenu() {
      this.isShow = false
    }
  }
}
</script>
<style lang="less" scoped>
.widget{
     position: relative;
    display: inline-block;
    // min-width: 120px;
    width: min-content;
    >.widget-mask{
        // position: relative;
        border: 1px solid transparent;
        &.active{
            outline: 2px solid #409eff;
            border: 1px solid #409eff;
        }
        &:hover{
            background: rgba(64,158,255,0.1);
            border: 1px solid #409eff;
        }
        >.drag .widget-icon,>.actions span{
            color:#fff;
            padding:6px;
            cursor: pointer;
            background: #409eff ;
            width: 70px;
            pointer-events: auto;
            &:hover{
              background: rgba(64,158,255,0.5);
            }
        }

        .drag{
            position: absolute;
            top:2px;
            left:-1px;
             z-index: 99;
            i{
                cursor: move;
            }
        }
        .widget-id{
            position: absolute;
            top: 2px;
            right: 5px;
            font-size: 12px;
            color: #67c23a;
            z-index: 9;
        }
        .actions{
             position: absolute;
             right:0px;
             bottom:4px;
             display: flex;
             flex-direction: column;
             z-index: 99;

        }
        .widget-content{
        // padding:5px 0 20px 10px;
        box-sizing: border-box;
        border: 1px dashed hsla(0,0%,66.7%,.5);
        background-color: rgba(236,245,255,.3);
        pointer-events: none;
        // margin: 2px;
        overflow: hidden;
        z-index: 111;
        // min-height: 48px;
        height: 100%;
        &:hover{
            border: 1px dashed #2183d8;
            background-color: rgba(33, 131, 216,0.1);
        }
       }
    }

    &.layout{
      // width: 100%;
       >.widget-mask{
         border: 1px solid transparent;
          &.active{
            outline: 2px solid #e6a23c;
            border: 1px solid #e6a23c;
          }
          &:hover{
            background: rgba(230,162,60,0.2);
            border: 1px solid #e6a23c;
          }
          >.drag .widget-icon,>.actions .widget-icon{
            background: #e6a23c;
          }
        }
  }
  &.full-width{
     width: 100%;
  }

}
</style>
