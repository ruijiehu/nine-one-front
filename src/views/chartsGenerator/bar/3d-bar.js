const settings = {
  name: '3d-bar',
  type: '柱状图',
  settings: `
        const sideData=[200,300,400,100,200,300,400]
        const  xOption=['桐乡市','平湖市','南湖区','海宁市','秀洲区','海盐县','嘉善县']
        const yData=[200,300,400,100,200,300,400]
        const maxNum = yData.length > 0 ? Math.max.apply(null, yData) : 100
        const option={
            backgroundColor:'#000127',
            grid: {
            right: '3%'
            },
            tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,1,39,0.7)',
            borderColor: '#1cb6ff5a',
            borderWidth: 0.5,
            padding: 5,
            formatter: function (params) {
                return params.name + '：' + (params.value > 100 ? 100 : params.value) + '%'
            },
            textStyle: {
                fontSize: 12,
                color: '#fff'
            }
            },
            xAxis: {
            type: 'category',
            data:  xOption,
            axisLine: {
                show: true,
                lineStyle: {
                width: 0.6,
                color: '#657ca8'
                }
            },
            axisLabel: {
                interval: 0,
                width: 52,
                margin: 18,
                overflow: 'truncate'
            },
            axisTick: {
                show: false
            }
            },
            yAxis: {
            type: 'value',
            max: maxNum,
            name: '百分比%',
            nameTextStyle: {
                align: 'right'
            },
            axisLabel: {
                margin: 12
            },
            axisLine: {
                show: true,
                lineStyle: {
                width: 0.6,
                color: '#657ca8'
                }
            },
            splitLine: {
                lineStyle: {
                width: 0.6,
                color: 'rgba(32, 227, 241, 0.4)'
                }
            }
            },
            series: [{
            type: 'bar',
            barWidth: 24,
            name: 'a',
            data: yData,
            barGap: 0,
            label: {
                show: true,
                position: 'top',
                align: 'center',
                color: '#ffffff',
                padding: [0, 0, 0, 8],
                formatter: (params) => {
                return params.value+'%'
                }
            },
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: '#0B4EC3' // 0% 处的颜色
                }, {
                offset: 0.6,
                color: '#138CEB' // 60% 处的颜色
                }, {
                offset: 1,
                color: '#17AAFE' // 100% 处的颜色
                }], false)
            }
            },
            {
            type: 'bar',
            barWidth: 8,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: '#09337C' // 0% 处的颜色
                }, {
                offset: 0.6,
                color: '#0761C0' // 60% 处的颜色
                }, {
                offset: 1,
                color: '#0575DE' // 100% 处的颜色
                }], false)
            },
            barGap: 0,
            data:sideData
            }]
        }`
}
export default settings

