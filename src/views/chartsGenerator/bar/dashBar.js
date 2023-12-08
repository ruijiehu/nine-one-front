const settings = {
  name: 'dashbar',
  settings: `
  const xdata = ["事件累计数","近7日新增量","近7日办结量","超期事件数量"]
  const yData = [14,0,0,11]
  const option = {
    backgroundColor:'#061335',
    grid: {
      top: '18%',
      left: '7%',
      bottom: '25%',
      right: '2%'
    },
    tooltip: {
      show: true,
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: xdata,
      axisLabel: {
        color: '#ffffff',
        rotate: 30
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff',
          type: 'dashed'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false,
        lineStyle: {
          color: '#ffffff'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#ffffff'
      },
      axisTick: {
        show: true
      }
    },
    series: [{
      data: yData,
      type: 'bar',
      barWidth: 27,
      itemStyle: {
        color: '#ce5a60'
      }
    }]
  }`
}
export default settings
