const settings = {
  name: 'double-line',
  type: '折线图',
  settings: `
    const data = {"xdata":["2011年","2012年","2013年","2014年","2015年","2016年","2017年","2018年","2019年"],"ydata1":["29","36","41","39","43","45","95","93","90"],"ydata2":["22","23.2","26.02","28.09","31.02","35.72","80.67","80.34","80.68"],"ydata1Legend":"规模企业","ydata2Legend":"总产值"}
    const option = {
      backgroundColor:'#061335',
      color: ['#a6a7ab'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params, ticket, callback) {
          // params.map(item => {
          var relVal = params[0].name
          for (var i = 0; i < params.length; i++) {
            if (params[i].seriesName === '规模企业') {
              relVal += '<div class="circle" ><span style="background:' + params[i].color + '"></span>' + params[i].seriesName + ' : ' + params[i].value + '家</div>'
            } else if (params[i].seriesName === '总产值') {
              relVal += '<div class="circle" ><span style="background:' + params[i].color + '"></span>' + params[i].seriesName + ' : ' + params[i].value + '千万</div>'
            } else if (params[i].seriesName === '人数') {
              relVal += '<div class="circle" ><span style="background:' + params[i].color + '"></span>' + params[i].seriesName + ' : ' + params[i].value + '人</div>'
            } else if (params[i].seriesName === '收入') {
              relVal += '<div class="circle" ><span style="background:' + params[i].color + '"></span>' + params[i].seriesName + ' : ' + params[i].value + '万元</div>'
            }
          }
          return relVal
        }
      },
      legend: {
        show: true,
        right: '10%',
        top: '0%',
        textStyle: {
          color: '#fff'
        }
      },
      grid: {
        left: '12%',
        top: '18%',
        right: '15%',
        bottom: '15%'
      },
      xAxis: [
        {
          boundaryGap: false,
          type: 'category',
          data: data.xdata,
          axisTick: {
            alignWithLabel: true
          },
          nameRotate: 30,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#0f1d91',
              opacity: 0.45
            }
          },
          axisLabel: {
            color: '#fff'
          }
        }
      ],
      yAxis: [
        {
          name: data.ydata1unit,
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#2b375d',
              opacity: 0.45
            }
          },
          axisLabel: {
            color: '#fff',
            opacity: 0.67
          },
          splitLine: {
            lineStyle: {
              color: '#2b375d',
              opacity: 0.45
            }
          }
        },
        {
          name: data.ydata2unit,
          type: 'value',
          min: 0,
          axisLine: {
            lineStyle: {
              color: '#2b375d',
              opacity: 0.45
            }
          },
          axisLabel: {
            color: '#fff',
            opacity: 0.67
          },
          splitLine: {
            lineStyle: {
              color: '#2b375d',
              opacity: 0.45
            }
          }
        }
      ],
      series: [
        {
          name: data.ydata1Legend,
          type: 'line',
          barWidth: '24',
          itemStyle: {
            opacity: 0.5,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#54e8e8' // 0% 处的颜色
              }, {
                offset: 1, color: '#54e8e8' // 100% 处的颜色
              }]
            }
          },
          data: data.ydata1,
          label: {
            color: '#fff'
          }
        },
        {
          name: data.ydata2Legend,
          type: 'line',
          barWidth: '24',
          yAxisIndex: 1,
          itemStyle: {
            opacity: 0.5,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#9e0e1d' // 0% 处的颜色
              }, {
                offset: 1, color: '#9e0e1d' // 100% 处的颜色
              }]
            }
          },
          data: data.ydata2,
          label: {
            color: '#fff'
          }
        }
      ]
    }`
}
export default settings
