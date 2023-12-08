<template>
  <div class="template-select">
    <el-tabs type="border-card" v-model="activeName"  v-if="!isShow" @tab-click="handleClick">
      <template v-for="(item) in chartList">
        <el-tab-pane :label="item.name" :name="item.name" :key="item.name">
          <div v-for="(cell,j) in item.charts" :key="j">
            <span>{{cell.name}}</span>
            <img :src="cell.imgSrc"  @click="toConfig(cell)"/>
          </div>
        </el-tab-pane>
      </template>
      <template v-for="(item) in iframeList">
        <el-tab-pane :label="item.name" :name="item.name" :key="item.name">
          <iframe :src="item.iframeUrl" width="100%" height="900" frameborder="no" border="0"> </iframe>
        </el-tab-pane>
      </template>
    </el-tabs>
    <!-- <div><el-button type="primary" @click="toConfig">进入配置</el-button></div> -->
    <router-view/>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import 'echarts-liquidfill'
import 'echarts-wordcloud'
export default {
  data() {
    return {
      isShow: false,
      barList: [], // 柱状图
      pieList: [], // 饼图
      lineList: [], //  折线图
      radarList: [], // 雷达图
      gaugeList: [], // 仪表盘
      liquidList: [], // 水波球
      bar3dList: [], // 3d柱状图
      wordcloudList: [], // 热词云
      otherList: [], // 其他图表
      chartList: [],
      activeName: '柱状图',
      iframeList: [
        {
          name: 'makeapie社区资源',
          iframeUrl: 'https://www.makeapie.cn/'
        },
        {
          name: 'iqqqw社区资源',
          iframeUrl: 'https://www.isqqw.com/#/homepage'
        }
      ]
    }
  },
  methods: {
    ...mapMutations('chartConfig', ['setOptionConfig']),
    handleClick(tab) {
      this.$router.replace({ path: '/tool/chart', query: { type: tab.$options.propsData.name }})
    },
    toConfig(cell) {
      this.setOptionConfig(cell.settings)
      this.isShow = true
      this.$router.push({ path: '/tool/chartconfig', query: { type: cell.type }})
    },
    readFile(contexts) {
      return contexts.keys().map(element => {
        const componentConfig = contexts(element)
        const ctrl = componentConfig.default || componentConfig
        ctrl.imgSrc = require(`@/assets/img/chart/${ctrl.name}.png`)
        return ctrl
      })
    },
    // 读取组件
    readFiles() {
      const barList = this.readFile(require.context('./bar', true, /\.js$/))
      const pieList = this.readFile(require.context('./pie', true, /\.js$/))
      const lineList = this.readFile(require.context('./line', true, /\.js$/))
      const gaugeList = this.readFile(require.context('./gauge', true, /\.js$/))
      const liquidList = this.readFile(require.context('./liquid', true, /\.js$/))
      const wordcloudList = this.readFile(require.context('./wordcloud', true, /\.js$/))
      const radarList = this.readFile(require.context('./radar', true, /\.js$/))
      const otherList = this.readFile(require.context('./other', true, /\.js$/))
      this.chartList = [
        { name: '柱状图', charts: barList },
        { name: '饼图', charts: pieList },
        { name: '折线图', charts: lineList },
        { name: '仪表盘', charts: gaugeList },
        { name: '水波球', charts: liquidList },
        { name: '热词云', charts: wordcloudList },
        { name: '雷达图', charts: radarList },
        { name: '其他', charts: otherList }
      ]
    }
  },
  mounted() {
    this.readFiles()
    if (this.$route.query && this.$route.query.type) {
      const tabs = []
      this.chartList.forEach(e => {
        tabs.push(e.name)
      })
      if (tabs.indexOf(this.$route.query.type) > -1) {
        this.activeName = this.$route.query.type
      } else {
        this.activeName = '其他'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.template-select{
  /deep/ .el-tabs{
    margin: 20px;
    .el-tab-pane{
      display: flex;
      flex-wrap: wrap;
      div{
        margin: 10px;
        padding: 10px;
        box-sizing: border-box;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        cursor: pointer;
        background: #f9f9f9;
        display: flex;
        flex-direction: column;
        span{
          color: #293c55;
          padding:0 0 10px 10px;
        }
      }
    }
    img{
      width:370px;
      height: 200px;
    }
  }
}
</style>
