const settings = {
  name: 'panel-gauge',
  type: '仪表盘',
  settings: `
  
  const actual=10
  const target = 25
  const option = {
    backgroundColor:'#061335',
    title:{
      text:actual,
      textStyle:{
          color:'#0294ee',
          fontSize:70,
          fontWeight:'bold'
      },
      textAlign:'center',
      left:'49%',
      top:'38%',
      subtext:target,
      subtextStyle:{
          color:'rgba(179,64,56,1)',
          fontSize:88,
          fontWeight:'bold'
      }
    },
    series: [{ // 主圆环
      type: 'pie',
      radius: ['60%', '95%'],
      startAngle: 235,
      color: [{
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: 'rgba(179,64,56,1)' // 0% 处的颜色
        }, {
          offset: 1,
          color: 'transparent' // 100% 处的颜色
        }]
      }, 'transparent', 'transparent'],
      hoverAnimation: false,
      legendHoverLink: false,
      z: 11,
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [{
        value: actual
      },
      {
        value: target * 2 / (29 / 36) - actual - target * 2 / (29 / 36) * (7 / 36)
      }, {
        value: target * 2 / (29 / 36) * (7 / 36)
      }]
    }, { // 背景圆环
      name: '',
      type: 'pie',
      radius: ['60%', '95%'],
      silent: true,
      startAngle: 235,
      labelLine: {
        normal: {
          show: false
        }
      },
      z: 5,
      data: [{
        value: 290,
        itemStyle: {
          color: 'transparent',
          borderWidth: 2,
          borderColor: 'rgba(179,64,56,0.5)'
        }
      }, {
        value: 70,
        itemStyle: {
          color: 'transparent'
        }
      }]
    }, { // 刻度点
      type: 'gauge',
      splitNumber: 15, // 刻度数量
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

    },
    { // 竖线圆环
      type: 'pie',
      radius: ['60%', '95%'],
      startAngle: 235,
      // color: ['transparent', 'red', 'none', 'none'],
      hoverAnimation: false,
      legendHoverLink: false,
      z: 11,
      labelLine: {
        normal: {
          show: false
        }
      },
      data:  [{
        value: (target * 2 / (29 / 36) - target * 2 / (29 / 36) * (7 / 36) - target * 2 / 50) / 2,
        itemStyle: {
          color: 'transparent'
        }
      }, {
        value: target * 2 / 50,
        itemStyle: {
          color: '#0294ee'
        }
      }, {
        value: (target * 2 / (29 / 36) - target * 2 / (29 / 36) * (7 / 36) - target * 2 / 50) / 2,
        itemStyle: {
          color: 'transparent'
        }
      }, {
        value: target * 2 / (29 / 36) * (7 / 36),
        itemStyle: {
          color: 'transparent'
        }
      }]
    }
    ]
  }`
}
export default settings
