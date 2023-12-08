<template>
  <div class="chart-config">
    <el-row class="chart-main">
      <el-col :span="12" class="chart-config-left">
        <el-row class="chart-config-row">
          <actions @preview="preview"></actions>
        </el-row>
        <el-row class="chart-canvas">
          <canvas-engine ref="canvasEngine" ></canvas-engine>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row class="chart-config-row">
          <div class="tabs">
            <span class="tab" v-for="(item,index) in tabs" :class="item===currentTab?'active':''" @click="currentTab=item" :key="index">{{item}}</span>
          </div>
        </el-row>
        <el-row>
          <options v-if="currentTab === 'options配置'"></options>
          <data-attr v-else></data-attr>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import actions from './actions'
import canvasEngine from './canvas-engine'
import options from './attrs/options'
import dataAttr from './attrs/data'
import 'echarts-liquidfill'
import 'echarts-wordcloud'

export default {
  components: { actions, canvasEngine, options, dataAttr },
  data() {
    return {
      tabs: ['options配置'],
      currentTab: 'options配置'
    }
  },
  methods: {
    preview() {
      this.$refs.canvasEngine.initChart()
    }
  },
  mounted() {
    this.preview()
  }
}
</script>
<style lang="less" scoped>
.chart-config{
    width: 100%;
    height: 100%;
    .chart-main{
        width: 100%;
        height: 100%;
    }
    .chart-config-row{
            height: 45px;
            line-height: 45px;
            font-size: 18px;
            border-bottom: 2px solid #e4e7ed;
            .tabs{
                display: flex;
                align-items: center;
                height: 100%;
                .tab{
                    border-bottom:3px solid transparent;
                    cursor: pointer;
                    padding: 0 20px;
                    box-sizing: border-box;
                    font-size: 14px;
                    color: #333333;
                    &.active{
                        border-color:#2183d8;
                    }
                }
            }
    }
    .chart-config-left{
         border-right: 2px solid #e4e7ed;
         display: flex;
         flex-direction: column;
         height: 100%;
         .chart-canvas{
            flex: 1;
         }
    }
}
</style>
