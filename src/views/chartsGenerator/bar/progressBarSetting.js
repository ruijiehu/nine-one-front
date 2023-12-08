const settings = {
  name: 'progress-bar',
  settings: `
        const textColor=['#01daff','#f7d100','#45f205','#45f205']
        const fillColor=['#052fa8','#d08d00','#36ae21','#7028b2']
        const startColor=['#0046c7','#c77e00','#339f27','#6c23a5']
        const endColor=['#00daff','#ffde00','#48ff00','#8245ff']
        const yAxisData=[1,2,3,4]
        const data = [22,35,65,34]
        const dataFull = data.map(item=>100)
        const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '8%',
          left: '20%',
          right: '18%',
          bottom: '12%'
        },
        xAxis: [{
          axisLine: { show: false },
          axisLabel: {
            show: false,
            color: '#afaca5',
            fontSize: 15
          },
          splitLine: { show: false },
          axisTick: { show: false },
          max: 100
        }, {
          axisLine: { show: false },
          axisLabel: {
            show: false,
            color: '#afaca5',
            fontSize: 15
          },
          min: 1,
          splitLine: { show: false },
          axisTick: { show: false }
        }],
        yAxis: [{
          axisLine: { show: false },
          axisLabel: {
            color: (params,index) => {
              return textColor[index]
            },
            fontSize: 15
          },
          axisTick: { show: false },
          data: yAxisData
        }, {
          axisLine: { show: false },
          axisLabel: {
            show: true,
            color: function (params, index) {
              return textColor[index]
            },
            formatter: (value) => {
              return value+'%'
            },
            fontSize: 15
          },
          axisTick: { show: false },
          data: data
        }],
        series: [
          {
            type: 'bar',
            barWidth: '20',
            itemStyle: {
              normal: {
                barBorderRadius: 15,
                color: (params) => {
                  return {
                    colorStops: [{
                      offset: 0,
                      color: startColor[params.dataIndex]
                    }, {
                      offset: 1,
                      color: endColor[params.dataIndex]
                    }]
                  }
                }
              }
            },
            data: data
          }, {
            type: 'bar',
            yAxisIndex: 1,
            xAxisIndex: 1,
            data: dataFull,
            barWidth: 20,
            itemStyle: {
              normal: {
                opacity: '0.35',
                color: (params,index) => {
                  return fillColor[index]
                },
                barBorderRadius: 20
              }
            },
            z: 1
          }
        ]
      }     `
}
export default settings
