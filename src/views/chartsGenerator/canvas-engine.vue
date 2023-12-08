<template>
  <div class="canvas-engine">
    <div class="chart" ref="chart"></div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import * as echarts from 'echarts'
import 'echarts-liquidfill'

const cityData = require('./jsonData.json')
export default {
  data() {
    return {
      chart: null
    }
  },
  components: {
  },
  computed: {
    ...mapState('chartConfig', ['optionConfig', 'dataConfig'])
  },
  methods: {
    ...mapMutations('chartConfig', ['setOptionConfig']),
    initChart() {
      if (!this.optionConfig) {
        this.setOptionConfig(localStorage.getItem('optionConfig'))
      }
      window.echarts = echarts
      var code = `
        let echarts = window.echarts
        let xData= ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            ${this.optionConfig}   
            return option `
      // eslint-disable-next-line
        const option = new Function(code)()
      this.chart = echarts.init(this.$refs.chart)
      if (this.chart) {
        echarts.registerMap('嘉兴市', cityData)
      }
      this.chart.setOption(option)
    },
    getData() {

    }
  }
}
</script>

<style lang="less" scoped>
.canvas-engine{
  height: 100%;
  .chart{
    height:800px;
  }
}
</style>
