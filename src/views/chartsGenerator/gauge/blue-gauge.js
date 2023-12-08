const settings = {
  name: 'blue-gauge',
  type: '仪表盘',
  settings: `
    const  echartsData= {
        data: [{
          value: null
        }],
        color: []
      }
      var color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
        offset: 0,
        color: '#01061c' // 0% 处的颜色
      },
      {
        offset: 1,
        color: '#0a174b' // 100% 处的颜色
      }
      ])
       echartsData.data[0].value = 54
       echartsData.color.splice(0,  echartsData.color.length)
       echartsData.color.push([54 / 100, '#9fd4ff'])
       echartsData.color.push([1, color])
    const normalOption = {
        type: 'gauge',
        center: ['50%', '50%'],
        startAngle: 230,
        endAngle: -50,
        min: 0,
        max: 100,
        detail: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        pointer: { // 指针样式
          show: false
        }
      }

      const rich = {
        number: {
          fontSize: 45,
          color: '#fff'
        },
        unit: {
          fontSize: 13,
          color: '#fff'
        }
      }
      const  option = { 
    backgroundColor:'#000127',
    series:[
        {
            name: '',
            radius: '76%',
            data: [{
              value: 80
            }],
            axisLine: {
              show: true,
              lineStyle: { // 属性lineStyle控制线条样式
                color: [[100 / 100, '#9fd4ff'], [1, 'transparent']],
                shadowColor: '#28a7f8',
                shadowBlur: 28,
                width: 4
              }
            },
            ...normalOption
          },
          {
            name: '',
            radius: '71.5%',
            data:   echartsData.data,
            axisLine: {
              show: true,
              lineStyle: { // 属性lineStyle控制线条样式
                color:   echartsData.color,
                shadowColor: '#28a7f8',
                shadowBlur: 10,
                width: 20
              }
            },
            ...normalOption
          },
          {
            name: '',
            radius: '73.9%',
            data:   echartsData.data,
            axisLine: {
              show: true,
              lineStyle: { // 属性lineStyle控制线条样式
                color: [[100 / 100, color], [1, 'transparent']],
                width: 2
              }
            },
            ...normalOption
          },
          {
            name: '',
            radius: '62%',
            data: [{
              value: 80
            }],
            axisLine: {
              show: true,
              lineStyle: { // 属性lineStyle控制线条样式
                color: [[100 / 100, '#9fd4ff'], [1, 'transparent']],
                shadowColor: '#28a7f8',
                shadowBlur: 28,
                width: 4
              }
            },
            ...normalOption
          },
          {
            name: '',
            radius: '50%',
            data:  echartsData.data,
            axisLine: {
              show: true,
              lineStyle: { // 属性lineStyle控制线条样式
                color: [[100 / 100, 'transparent'], [1, 'transparent']],
                width: 2
              }
            },
            ...normalOption,
            startAngle: 315,
            endAngle: -45,
            detail: {
              show: true,
              color: '#fff',
              offsetCenter: ['0%', '10%'],
              formatter: function (value) {
                var num = Math.round(value)
                return '{number|' + num + '}{unit|%}'
              },
              rich: rich
            }
          }

    ]
  }`
}
export default settings

