const settings = {
  name: 'gauge',
  type: '仪表盘',
  settings: `
  const colors = { red: '#F16262', yellow: '#ECCB4D', green: '#4ED976', grey: '#A0A0A0' }
const type = ['grey', 'green', 'yellow', 'red']
const alarmType = 'grey'
const cardData={
    percent:25,
    minusFlag:-1
}
const option = {
        backgroundColor: 'transparent',
        color: colors[alarmType],
        series: [{
          name: '',
          type: 'gauge',
          detail: {
            show: false,
            formatter: '{value}%'
          },
          pointer: {
            width: 2
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 6,
              shadowBlur: 0,
              color: [
                [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: '#4ED976'
                  },
                  {
                    offset: 0.7,
                    color: '#e5e46e'
                  },
                  {
                    offset: 1,
                    color: '#EB3457'
                  }
                ])]]
            }
          },
          splitLine: {
            length: 0
          },
          axisLabel: {
            show: false
          },
          axisTick: { show: false },
          data: [{
            value: getValue()
          }],
          itemStyle: {
            color: '#A0A0A0'
          }

        }]
      }
      function getValue () {
      if (cardData.minusFlag === 1) {
        return (cardData.percent + 100) * 0.5 > 100 ? 100 : (cardData.percent + 100) * 0.5
      } else if (cardData.minusFlag === 0) {
        return 50
      } return (cardData.percent * -1 + 100) * 0.5
    }`
}
export default settings
