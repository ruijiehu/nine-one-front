const settings = {
  name: 'area-line',
  type: '折线图',
  settings: `
    const xAxisData=['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const yData =  [820, 932, 901, 934, 1290, 1330, 1320]
    const option = {
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xAxisData,
              axisLabel: {
                color: '#a0a0a0',
                show: true,
                textStyle: {
                  fontSize: 14
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#f0f4f7'
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#f0f4f7'
                }
              },
              axisTick: {
                show: false
              }
            },
            yAxis: {
              type: 'value',
              axisLine: false,
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#f0f4f7'
                }
              },
              axisLabel: {
                color: '#a0a0a0',
                show: true,
                textStyle: {
                  fontSize: 14
                }
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                label: {
                  backgroundColor: '#e47070'
                }
              }
            },
            grid: {
              left: '5%',
              bottom: 40,
              right: '5%',
              top: 20
            },
            series: [{
              data: yData,
              name: '全部事件',
              symbolSize: 6,
              type: 'line',
              smooth: true,
              lineStyle: {
                color: '#e47070'
              },
              showSymbol: true,
              itemStyle: {
                normal: {
                  color: '#e47070', // 会设置点和线的颜色，所以需要下面定制 line
                  borderColor: '#e47070' // 点边线的颜色
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(239,169,169,0.4)'
                  }, {
                    offset: 1,
                    color: 'rgba(255,255,255,0.5)'
                  }])
                }
              }
            }
            ]
          }`
}
export default settings
