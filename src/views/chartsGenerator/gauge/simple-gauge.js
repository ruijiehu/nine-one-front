const settings = {
  name: 'simple-gauge',
  type: '仪表盘',
  settings: `
  const data = 91
  const option = {
    backgroundColor:'#061335',
    title: {
      text: data,
      x: '50%',
      y: '30%',
      textAlign: 'center',
      textStyle: {
        fontFamily: 'Impact',
        fontSize: 100,
        color: '#fff'
      },
      subtext: '营商环境指数',
      subtextStyle: {
        fontFamily: 'Impact',
        fontSize: 50,
        height: 80,
        verticalAlign: 'bottom',
        color: '#8fd1e6'
      }
    },

    series: [{ // 主圆环
      type: 'pie',
      radius: ['55%', '85%'],
      startAngle:  180,
      endAngle: 0,
      color: ['#b9864a', 'rgba(255,255,255,0.1)', 'none'],
      hoverAnimation: false,
      legendHoverLink: false,
      z: 11,
      splitNumber: 10,
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [{
        value: data
      }, {
        value: 100 - data
      }, {
        value: 100
      }]
    }, { // 背景圆环
      name: '',
      type: 'pie',
      radius: ['55%', '85%'],
      silent: true,
      startAngle: 180,
      labelLine: {
        normal: {
          show: false
        }
      },
      z: 5,
      data: [{
        value: 100,
        itemStyle: {
          color: 'transparent',
          borderWidth: 2,
          borderColor: '#b9864a'
        }
      }, {
        value: 100,
        itemStyle: {
          color: 'transparent'
        }
      }]
    }, { // 刻度点
      type: 'gauge',
      splitNumber: 15, // 刻度数量
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      radius: '50%',
      center: ['50%', '50%'],
      axisLine: {
        show: true,
        lineStyle: {
          width: 0,
          shadowBlur: 0,
          color: [[1, 'rgba(255,255,255,0.5)']]
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.5)',
          width: 1
        },
        length: 3,
        splitNumber: 1
      },
      splitLine: {
        show: true,
        length: 3,
        lineStyle: {
          color: 'auto'
        }
      },
      axisLabel: {
        show: false
      },
      pointer: { // 仪表盘指针
        show: 0
      },
      detail: {
        show: 0
      }

    }
    ]
  }`
}
export default settings
