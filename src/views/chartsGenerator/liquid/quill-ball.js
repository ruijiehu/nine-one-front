const settings = {
  name: 'quill-ball',
  type: '水波球',
  settings: `
  const data = 0.45
  const option = {
    backgroundColor:'#061335',
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    title: {
      text: (data * 100).toFixed(0) + '{a|%}',
      textStyle: {
        fontSize: 21,
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
      outline: {
        show: false
      },
      label: {
        show: false
      },
      radius: '50%',
      backgroundStyle: {
        // borderColor: this.liquidData['level'][1],
        borderColor: 'rgba(78, 193, 248,1)',
        borderWidth: 2,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowBlur: 20,
        color: 'rgba(255,255,255,0)'
      },
      type: 'liquidFill',
      data: [{
        value: data,
        itemStyle: {
          color:'rgba(78, 193, 248,1)'
        }
      }]
    }]
  }`
}
export default settings
