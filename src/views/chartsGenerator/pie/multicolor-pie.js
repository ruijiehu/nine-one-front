
const settings = {
  name: 'multicolor-pie',
  type: '饼图',
  settings: `
  const list = [{"name":"危房","value":"64"},{"name":"安全生产重点","value":"36"},{"name":"消防安全重点","value":"27"},{"name":"学校","value":"13"},{"name":"治安重点","value":"7"}]
  const option = {
    backgroundColor:'#061335',
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['学校', '公共复杂场所', '危房', '消防安全重点', '安全生产重点', '治安重点'],
      y: 'bottom',
      itemWidth: 6,
      itemHeight: 6,
      textStyle: {
        color: '#5ddbff',
        fontSize: 16
      }
    },
    color: ['#d1303c', '#9a2e7a', '#aaa54c', '#237e5f', '#213c93', '#438ed4', '#7ab1ea'],
    series: [{
      radius: ['40%', '60%'],
      center: ['50%', '50%'],
      hoverAnimation: false,
      type: 'pie',
      data: [
        {
          tooltip: {
            trigger: 'none'
          },
          value: 100,
          labelLine: {
            show: false
          },
          label: {
            show: false
          },
          itemStyle: {
            label: {
              show: false
            },
            normal: {
              color: 'rgba(0, 0, 0, 0)',
              borderColor: 'rgba(88,134,240,0.2)',
              borderWidth: 10
            }
          }
        }]
    }, {
      radius: ['40%', '60%'],
      center: ['50%', '50%'],
      type: 'pie',
      data: list,
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      z: 3
    }]
  }`
}
export default settings
