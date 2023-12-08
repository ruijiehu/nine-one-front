const settings = {
  name: 'double-area-line',
  type: '折线图',
  settings: `
  const xdata = ["2020/06/01","2020/06/02","2020/06/03","2020/06/04","2020/06/05","2020/06/06","2020/06/08","2020/06/09","2020/06/10","2020/06/11","2020/06/12"] 
  const ydata =[{"name":"2020/06/01","value":"66"},{"name":"2020/06/02","value":"54"},{"name":"2020/06/03","value":"48"},{"name":"2020/06/04","value":"47"},{"name":"2020/06/05","value":"47"},{"name":"2020/06/06","value":"2"},{"name":"2020/06/08","value":"72"},{"name":"2020/06/09","value":"57"},{"name":"2020/06/10","value":"40"},{"name":"2020/06/11","value":"61"},{"name":"2020/06/12","value":"26"}]
  const ydata1 = [{"name":"2020/06/01","value":"30"},{"name":"2020/06/02","value":"22"},{"name":"2020/06/03","value":"20"},{"name":"2020/06/04","value":"17"},{"name":"2020/06/05","value":"19"},{"name":"2020/06/06","value":"0"},{"name":"2020/06/08","value":"36"},{"name":"2020/06/09","value":"21"},{"name":"2020/06/10","value":"12"},{"name":"2020/06/11","value":"21"},{"name":"2020/06/12","value":"9"}]
  const option = {
      backgroundColor:'#061335',
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['总计', '已办结'],
        textStyle: {
          color: 'rgba(255,255,255,0.8)'
        },
        top: 45,
        left: 50
      },
      color: ['#FDF084', '#0DE7E6'],
      xAxis: {
        type: 'category',
        data: xdata,
        axisLabel: {
          color: 'rgba(255,255,255,0.8)',
          rotate: 45
        },
        boundaryGap: false,
        axisLine: {
          show: true
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#333',
            type: 'dashed'
          }
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
        top: 80,
        right: 50,
        bottom: 60
      },
      series: [{
        name: '总计',
        data: ydata,
        type: 'line',
        symbol: 'none',

        areaStyle: {color: new echarts.graphic.LinearGradient(
          0, 1, 0, 0,
          [
            {offset: 0, color: 'rgba(253, 240, 132, 0.1)'},
            {offset: 0.5, color: 'rgba(253, 240, 132, 0.5)'},
            {offset: 1, color: 'rgba(253, 240, 132, 0.8)'}
          ]
        )}
      }, {
        name: '已办结',
        data: ydata1,
        type: 'line',
        symbol: 'none',
        areaStyle: {color: new echarts.graphic.LinearGradient(
          0, 1, 0, 0,
          [
            {offset: 0, color: 'rgba(13,231,230, 0.05)'},
            {offset: 0.5, color: 'rgba(13,231,230, 0.5)'},
            {offset: 1, color: 'rgba(13,231,230, 0.8)'}
          ]
        )}

      }]
    }`
}
export default settings
