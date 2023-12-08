<template>
  <div class="canvas-engine">
    <canvas-engine-header></canvas-engine-header>
    <div class="canvas-table">
      <canvas-engine-table></canvas-engine-table>
    </div>
  </div>
</template>

<script>
import CanvasEngineHeader from './canvas-engine-header'
import CanvasEngineTable from './canvas-engine-table'
export default {
  data() {
    return {
    }
  },
  components: {
    'canvas-engine-header': CanvasEngineHeader, CanvasEngineTable
  }
}
</script>

<style lang="less" scoped>

</style>
