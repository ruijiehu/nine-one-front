<template>
  <!-- 机器人 -->
  <VueDragResize
    :isActive="true"
    :w="100"
    :h="100"
    :z="10000"
    :x="left"
    :y="top"
    v-if="ENV === 'development' && isDragShow"
    :parent-limitation="true"
    @dragging="onDragging"
    @dragstop="onDragstop"
    style="cursor:pointer"
  >
    <img @mouseup="getNav" src="@/assets/img/robot.gif" />
  </VueDragResize>
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import debounce from 'lodash/debounce'
export default {
  name: 'Robot',
  components: {
    VueDragResize
  },
  computed: {

    ENV() {
      return process.env.NODE_ENV
    },
    left() {
      if (this.$store.state.settings.navType === 'top') {
        return document.documentElement.clientWidth - 130 // 组件位置
      } else {
        return document.documentElement.clientWidth - 320 // 组件位置+左侧导航
      }
    },
    top() {
      return document.documentElement.clientHeight - 250 // 组件位置+上侧导航
    }
  },
  data() {
    return {
      isDragging: false,
      isDragShow: true
    }
  },
  watch: {

  },
  mounted() {
    window.addEventListener('resize', this.refresh)
    this.$once('beforeDestory', () => {
      window.removeEventListener('resize', this.refresh)
    })
  },
  methods: {
    refresh: debounce(function() {
      this.isDragShow = false
      setTimeout(() => {
        this.isDragShow = true
      }, 250)
    }, 250),
    onDragstop() {
      this.isDragging = false
    },
    onDragging() {
      this.isDragging = true
    },
    getNav() {
      if (!this.isDragging) {
        this.$router.push('/tool/index')
      }
      this.isDragging = false
    }
  }
}
</script>

<style>

</style>
