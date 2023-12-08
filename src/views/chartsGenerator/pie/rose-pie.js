
const settings = {
  name: 'rose-pie',
  type: '饼图',
  settings: `
    const data = [
        { value: 10, name: '街面秩序' },
        { value: 20, name: '扩展事件' },
        { value: 15, name: '施工管理' },
        { value: 17, name: '市容环境' },
        { value: 25, name: '突发事件' },
        { value: 8, name: '宣传广告' }
      ]
      const legenddata = ['街面秩序', '扩展事件', '施工管理', '市容环境', '突发事件', '宣传广告']
      function sum (data) {
        var s = 0
        for (var i = data.length - 1; i >= 0; i--) {
          s += data[i].value
        }
        return s
      }
      var all = sum(data)
      var newData = []
      for (let i = 0; i < data.length; i++) {
        newData[i] = {
          value: data[i].value <= 1 ? data[i].value : Math.log(data[i].value),
          name: data[i].name,
          originalValue: data[i].value,
          originalPercent: data[i].value / all * 100
        }
      }
      const option = {
        backgroundColor:'#061335',
        color: ['#463bc2', '#0090c1', '#ae7000', '#6600ad', '#20994c', '#0058b1'],
        tooltip: {
          trigger: 'item',
          formatter: function (param) {
            for (let i = 0; i < newData.length; i++) {
              if (newData[i].name === param.name) {
                break
              }
            }
            return param.name + ':' + param.percent + '%'
          }
        },
        legend: {
          width: '100%',
          x: 'center',
          y: 'bottom',
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          data: legenddata
        },
        calculable: true,
        series: [
          {
            name: '',
            type: 'pie',
            radius: [20, 60],
            center: ['50%', '50%'],
            roseType: 'area',
            data: newData,
            label: {
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            }
          }
        ]
      }`
}
export default settings
