const settings = {
  name: 'blue-bar',
  type: '柱状图',
  settings: `
    const option={
        grid: {
          top: '5%',
          left: '10%',
          bottom: '35%',
          right: '10%'
        },
        tooltip: {
          show: true,
          trigger: 'item'
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            color: 'rgba(0, 0, 0, 0.67)',
            rotate: 30,
            formatter: function (value, index) {
              return value.length > 4 ? value.substring(0, 4) + '...' : value
            }
          },
          axisLine: {
            lineStyle: {
              color: '#0f1d91'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#0f1d91'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#0f1d91'
            }
          },
          axisLabel: {
            color: 'rgba(0, 0, 0, 0.67)'
          },
          axisTick: {
            show: false
          }
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'bar',
          barWidth: 12,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 1, color: '#001c90' },
                { offset: 0, color: '#0090dd' }
              ]
            )
          }
        }]
      }`
}
export default settings
