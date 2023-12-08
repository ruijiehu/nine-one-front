const settings = {
  name: 'mixlinebar',
  settings: `
  const xdata = ["湘城社区","湘南社区","湘都社区","江南新家园社区","三家浜社区"]
  const ydata = [{"name":"湘城社区","value":"92"},{"name":"湘南社区","value":"37"},{"name":"湘都社区","value":"34"},{"name":"江南新家园社区","value":"40"},{"name":"三家浜社区","value":"53"}]
  const ydata1 = [{"name":"湘城社区","value":"41"},{"name":"湘南社区","value":"7"},{"name":"湘都社区","value":"13"},{"name":"江南新家园社区","value":"22"},{"name":"三家浜社区","value":"16"}]
  const option = {
        backgroundColor:'#061335',
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['已办结', '总数'],
          itemGap: 200,
          textStyle: {
            color: 'rgba(255,255,255,0.8)'
          },
          top: 40
        },
        color: ['#FDF084'],
        xAxis: {
          type: 'category',
          data: xdata,
          axisTick: {
            show: false
          },
          axisLabel: {
            color: 'rgba(255,255,255,0.8)',
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLabel: {color: 'rgba(255,255,255,0.8)', fontSize: 12},
          splitLine: {
            show: true,
            lineStyle: {
              color: '#333',
              type: 'dashed'
            }
          },
          axisLine: {
            show: true
          }

        },
        grid: {
          left: 50,
          bottom: 80,
          right: 20,
          top: 80

        },
        series: [{
          name: '已办结',
          type: 'line',
          data: ydata1,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#FDF084'
          },
          areaStyle: {color: new echarts.graphic.LinearGradient(
            0, 1, 0, 0,
            [
              {offset: 0, color: 'rgba(253, 240, 132, 0.1)'},
              {offset: 0.4, color: 'rgba(253, 240, 132, 0.4)'},
              {offset: 1, color: 'rgba(253, 240, 132, 1)'}
            ]
          )}
        }, {
          name: '总数',
          data: ydata,
          type: 'bar',
          barWidth: 16,
          itemStyle: {
            color: '#4EC1F8',
            barBorderRadius: [5, 5, 0, 0]
          }
        }
        ]
      }`
}
export default settings
