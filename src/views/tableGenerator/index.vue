<template>
  <div class="tableGenerator">
    <el-row  class="tableGenerator-row">
      <el-col :span="3" class="tableGenerator-col tableGenerator-col-components">
        <drag-list></drag-list>
      </el-col>
      <el-col :span="17" class="tableGenerator-col">
        <el-row class="tableGenerator-col-action" >
          <el-col :span="24" class="tableGenerator-col-actionheader">
            <actions></actions>
          </el-col>
        </el-row>
        <el-row class="tableGenerator-col-canvas">
          <div class="canvas-container">
            <div class="canvas-container-inner">
              <canvas-engine></canvas-engine>
            </div>
          </div>
        </el-row>
      </el-col>
      <el-col :span="4" class="tableGenerator-col tableGenerator-col-attrs">
        <attrs ref="attrs"></attrs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import attrs from './attrs'
import Actions from './actions'
import DragList from './dragList/index'
import CanvasEngine from './canvas-engine'
import './register'
export default {
  data() {
    return {}
  },
  components: {
    actions: Actions, attrs, DragList, CanvasEngine
  }
}
</script>
<style lang="less" scoped>
.tableGenerator{
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.tableGenerator-row{
  height: 100%;
}
.tableGenerator-col{
  height: 100%;
}
.tableGenerator-col-components{
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  padding: 8px 0;

}
.tableGenerator-col-attrs{
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  padding:0px !important;
}
.tableGenerator-col-actionheader{
  height: 45px;
  line-height: 45px;
  font-size: 18px;
  border-bottom: 2px solid #e4e7ed;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right:20px;
}
.tableGenerator-col-canvas{
  background-color: #fafafa;
  width: 100%;
  height: calc(100% - 45px);
  box-sizing: border-box;
  .canvas-container{
    width: 100%;
    height: calc(100% - 20px);
    margin-top: 10px;;
    .canvas-container-inner{
        background: #fff;
        border: 1px dashed #999;
        min-height: 100%;
        margin: 10px;
    }
  }

}
</style>
