
const settings = {
  name: 'yellow-pie',
  type: '饼图',
  settings: `
 
  const data=94.65
  const option = {
    backgroundColor:'#061335',
    'tooltip': {
      show: false,
      trigger: 'none',
      triggerOn: 'none'
    },
    title: {
      text: (data ).toFixed(2) + '{a|%}',
      textStyle: {
        fontSize: 30,
        fontFamily: 'Microsoft Yahei',
        fontWeight: 'normal',
        color: '#d6d773',
        rich: {
          a: {
            fontSize: 30
          }
        }
      },
      x: 'center',
      y: 'center'
    },
    'series': [{
      'center': [
        '50%',
        '50%'
      ],
      radius: ['30%', '28%'],
      'hoverAnimation': false,
      'type': 'pie',
      data: [
        {
          value: 100,
          'labelLine': {
            'show': false
          },
          'itemStyle': {
            'label': {
              'show': false
            },
            'normal': {
              'color': 'rgba(0, 0, 0, 0)',
              'borderColor': 'rgba(88,134,240,0.2)',
              'borderWidth': 10
            }
          }
        }]
    }, {
      radius: ['30%', '28%'],
      'hoverAnimation': false,
      'type': 'pie',
      'data': [{
        'value': data,
        'name': '',
        'label': {
          'normal': {
            'show': false,
            formatter: function (params) {
              console.log(params)
              return ['{num|' + params.percent + '}{unit|%}']
            },
            rich: {
              num: {
                color: '#18bcdf',
                fontSize: 36,
                fontFamily: 'digital-normal'
              },
              unit: {
                color: '#18bcdf',
                fontSize: 18,
                fontFamily: 'digital-normal'
              }
            },
            'position': 'center'
          }
        },
        'labelLine': {
          'show': false
        },
        'itemStyle': {
          'normal': {
            'color': '#5886f0',
            'borderColor': new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
              offset: 0,
              color: '#d38343'
            }, {
              offset: 0.27,
              color: '#bcbe66'
            }, {
              offset: 0.5,
              color: '#c8a155'
            }, {
              offset: 1,
              color: '#d38343'
            }]),
            'borderWidth': 10
          }
        }
      }, {
        'name': ' ',
        'value': 100 - data,
        'itemStyle': {
          'normal': {
            'label': {
              'show': false
            },
            'labelLine': {
              'show': false
            },
            'color': 'rgba(0,0,0,0)',
            'borderColor': 'rgba(0,0,0,0)',
            'borderWidth': 0
          }
        }
      }]
    }]
  }`
}
export default settings
