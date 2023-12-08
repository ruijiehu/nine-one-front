const settings = {
  name: 'liquidFill',
  type: '水波球',
  settings: `
  const data = 0.45
  const option = {
    backgroundColor:'#061335',
    title: {
      text: (data * 100).toFixed(0) + '{a|%}',
      textStyle: {
        fontSize: 24,
        fontFamily: 'Microsoft Yahei',
        fontWeight: 'normal',
        color: '#00ffff',
        rich: {
          a: {
            fontSize: 21
          }
        }
      },
      x: 'center',
      y: 'center'
    },

    series: [{
      type: 'liquidFill',
      radius: '50%',
      center: ['50%', '50%'],
      data: [data, data, data],
      backgroundStyle: {
        color: '#0966ee'
      },
      outline: {
        borderDistance: 0,
        itemStyle: {
          borderWidth: 0,
          shadowBlur: 2,
          shadowColor: '#000'
        }
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 1,
            color: 'rgba(0,255,255, 0)'
          }, {
            offset: 0.5,
            color: 'rgba(0,255,255, .2)'
          }, {
            offset: 0,
            color: 'rgba(0,255,255, 1)'
          }],
          globalCoord: false
        }
      },

      label: {
        normal: {
          formatter: ''
        }
      }
    } ]
  }`
}
export default settings
