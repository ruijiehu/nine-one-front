const settings = {
  name: 'base-ring-pie',
  type: '饼图',
  settings: `
    const data = [
      {value: 335, name: '直接访问'},
      {value: 310, name: '邮件营销'},
      {value: 274, name: '联盟广告'},
      {value: 235, name: '视频广告'},
      {value: 400, name: '搜索引擎'}]
      const option = {
          color: ['#2183d8', '#e47070', '#64c6af', '#b9edff', '#ffbe8e', '#fdd850', '#5968e8'],
          tooltip: {
            trigger: 'item'
          },
          grid: {
            left: '25%',
            bottom: 40,
            right: '25%',
            top: 20
          },
          series: [
            {
              name: '来电类目占比',
              type: 'pie',
              radius: ['20%', '50%'],
              center: ['55%', '60%'],
              avoidLabelOverlap: true,
              startAngle: 180,
              label: {
                formatter: '{b} {d}%',
                textStyle: {
                  fontSize: 16,
                  color: '#3c3c3c'
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  borderWidth: 2,
                  borderColor: '#fff'
                }
              },
              data: data
            }
          ]
        }`
}
export default settings

