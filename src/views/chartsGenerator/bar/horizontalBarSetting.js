const settings = {
  name: 'horizontal-bar',
  settings: ` xData=['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const yData =  [820, 932, 901, 934, 1290, 1330, 1320]
    const option = {
            color: ['#56d9fe'],
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              left: '5%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'value',
                axisLabel: {
                  show: false
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#f0f4f7'
                  }
                },
                splitLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                offset: 18,
                type: 'category',
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#dcdcdc'
                  }
                },
                axisLabel: {
                  show: true,
                  fontSize: 18,
                  color: '#3c3c3c'
                },
                axisTick: {
                  show: true,
                  lineStyle: {
                    color: '#dcdcdc'
                  }
                },
                splitLine: {
                  show: false
                },
                data: xData.reverse()
              }
            ],
            series: [
              {
                type: 'bar',
                barWidth: 12,
                data: yData.reverse(),
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      1, 0, 0, 0,
                      [
                        { offset: 0, color: '#62cbf2' },
                        { offset: 1, color: '#368dfa' }
                      ]
                    )
                  }
                },
                label: {
                  normal: {
                    show: true,
                    position: 'right',
                    color: '#3c3c3c',
                    fontSize: 20
                  }
                }
              }
            ]
          }`
}
export default settings
