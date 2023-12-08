const settings = {
  name: 'jx-map',
  type: '地图',
  settings: `
    const color= ['#6541cf', '#c28bff', '#cdb1ff']
      const centerData = {
        南湖区: [120.849953, 30.714652],
        秀洲区: [120.630491, 30.81339],
        嘉善县: [120.916503, 30.905857],
        海盐县: [120.942017, 30.492223],
        海宁市: [120.595727, 30.470791],
        平湖市: [121.125916, 30.765098],
        桐乡市: [120.521085, 30.619065],
        港区: [121.086822, 30.624329],
        经开区: [120.735942, 30.738798]
      }
      const geoList=[{
        map: '嘉兴市',
        zoom: 1,
        zlevel: 0,
        label: {
          show: false,
          color: "#ffffff",
          fontSize: 16,
        },
        itemStyle: {
          areaColor: '#152953',
          shadowColor: '#152953',
          shadowOffsetY:  25,
          shadowOffsetX: 0,
        },
      },{
        map: '嘉兴市',
        zoom: 1,
        zlevel: 0,
        label: {
          show: false,
          color: "#ffffff",
          fontSize: 16,
        },
        itemStyle: {
          areaColor: '#152953',
          shadowColor: '#152953',
          shadowOffsetY:  25,
          shadowOffsetX: 0,
        },
      },{
        map: '嘉兴市',
        zoom: 1,
        zlevel: 0,
        label: {
          show: false,
          color: "#ffffff",
          fontSize: 16,
        },
        itemStyle: {
          areaColor: '#152953',
          shadowColor: '#152953',
          shadowOffsetY: 50,
          shadowOffsetX: 0,
        },
      }]
    const pointData =[
      {"name":"南湖区","value":[120.849953,30.714652,166]},
      {"name":"秀洲区","value":[120.630491,30.81339,223]},
      {"name":"嘉善县","value":[120.916503,30.905857,200]},
      {"name":"海盐县","value":[120.942017,30.492223,868]},
      {"name":"海宁市","value":[120.595727,30.470791,313]},
      {"name":"平湖市","value":[121.125916,30.765098,1009]},
      {"name":"桐乡市","value":[120.521085,30.619065,515]},
      {"name":"港区","value":[121.086822,30.624329,865]},
      {"name":"经开区","value":[120.735942,30.738798,993]}]
    const lineData = [
      {"coords":[[120.849953,30.714652],[120.849953,30.756525500000002]],"value":"166"},
      {"coords":[[120.630491,30.81339],[120.630491,30.86964175]],"value":"223"},
      {"coords":[[120.916503,30.905857],[120.916503,30.949026]],"value":"200"},
      {"coords":[[120.942017,30.492223],[120.942017,30.711176]],"value":"868"},
      {"coords":[[120.595727,30.470791],[120.595727,30.549745249999997]],"value":"313"},
      {"coords":[[121.125916,30.765098],[121.125916,31.019618249999997]],"value":"1009"},
      {"coords":[[120.521085,30.619065],[120.521085,30.748973749999998]],"value":"515"},
      {"coords":[[121.086822,30.624329],[121.086822,30.842525249999998]],"value":"865"},
      {"coords":[[120.735942,30.738798],[120.735942,30.98928225]],"value":"993"}]
    const scatterData=[
      [120.849953,30.756525500000002],
    [120.630491,30.86964175],
    [120.916503,30.949026],
    [120.942017,30.711176],
    [120.595727,30.549745249999997],
    [121.125916,31.019618249999997],
    [120.521085,30.748973749999998],
    [121.086822,30.842525249999998],
    [120.735942,30.98928225]]
    const scatterData2= [
      {"name":"南湖区","value":[120.849953,30.714652]},
      {"name":"秀洲区","value":[120.630491,30.81339]},
      {"name":"嘉善县","value":[120.916503,30.905857]},
      {"name":"海盐县","value":[120.942017,30.492223]},
      {"name":"海宁市","value":[120.595727,30.470791]},
      {"name":"平湖市","value":[121.125916,30.765098]},
      {"name":"桐乡市","value":[120.521085,30.619065]},
      {"name":"港区","value":[121.086822,30.624329]},
      {"name":"经开区","value":[120.735942,30.738798]}]
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          right: '10%',
          top: 5,
          bottom: '20%',
          left: '10%',
        },
        geo: geoList,
        series: [
          {
            type: 'map',
            zlevel: 4,
            layoutCenter: ['50%', '50%'],
            layoutSize: '90%',
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
                color: '#fff',
              },
            },
            map: '嘉兴市',
            tooltip: {
              trigger: 'item',
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              extraCssText: 'z-index:100;color:#fff;',
              confine: true,
              formatter: (params) => {
                let res = '';
                const name = params.name;
                res = "<div style='box-shadow: 0 0 10px #3BD9D9; padding: 10px; position: absolute; top: 0; left:0;  border-radius: 4px; border: 1px solid #04b9ff; background: linear-gradient(to bottom,  #51bfd4 0%,rgba(35,90,178,.8) 100%);'><div style='color:#F4BD59; font-size: 14px;'>"+name+"</div></div>";
                return res;
              },
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  color: '#fff',
                },
                color: '#fff',
                borderColor: 'rgb(210,186,143)',
                shadowOffsetY: 10,
                shadowBlur: 50,
                borderWidth: 1.5,
                areaColor: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: '#1A4084',
                      },
                      {
                        offset: 1,
                        color: '#334E8E',
                      },
                    ],
                    false
                ),
              },
              emphasis: {
                label: {
                  show: true,
                  color: '#fff',
                },
                borderWidth: 3,
                borderColor: 'rgba(255, 230, 175,0.8)',
                shadowColor: 'rgba(255, 230, 175,0.5)',
                shadowBlur: 50,
                textStyle: {
                  color: '#fff',
                  fontSize: 12,
                  backgroundColor: 'transparent',
                },
                areaColor: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: '#1cfbfe',
                      },
                      {
                        offset: 1,
                        color: '#3348e7',
                      },
                    ],
                    false
                ),
              },
            },
            data: pointData
          },
          // 圆柱体主干
          {
            type: 'lines',
            zlevel: 5,
            lineStyle: {
              width: 20, //尾迹线条宽度
              opacity: 0.9, //尾迹线条透明度'
              curveness: 0, //尾迹线条曲直度
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: color[0], // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: color[1], // 40% 处的颜色
                  },
                  {
                    offset: 1,
                    color: color[0], // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
            label: {
              position: 'top',
              normal: {
                padding: [20, 10],
                width: 150,
                show: true,
                formatter: function (params) {
                  return ['{img|' + params.value + '}'];
                },
                rich: {
                  img: {
                    color: color[2],
                    fontSize: 18,
                    fontWeight: 600,
                  }
                }
              }
            },
            data:lineData,
          },
          // 圆柱体顶部
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            zlevel: 8,
            label: {
              show: false
            },
            symbol: 'circle',
            symbolSize: [20, 10],
            itemStyle: {
              color: color[0],
              opacity: 1
            },
            silent: true,
            data: scatterData
          },
          // 底部区域名称
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            zlevel: 4,
            label: {
              formatter: '{b}',
              position: 'bottom',
              color: '#fff',
              fontSize: 16,
              distance: 10,
              show: true
            },
            symbol: 'circle',
            symbolSize: [20, 10],
            itemStyle: {
              color: color[0],
              opacity: 1,
              emphasis: {
                color: 'rgba(248, 54, 0, 1)'
              },
            },
            silent: true,
            data:scatterData2
          },
          //圆柱体底座
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            zlevel: 4,
            label: {
              show: false
            },
            symbol: 'circle',
            symbolSize: [40, 20],
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  {
                    offset: 0, color: 'rgb(22,255,255, 0)' // 0% 处的颜色
                  },
                  {
                    offset: .75, color: 'rgb(22,255,255, 0)' // 100% 处的颜色
                  },
                  {
                    offset: .751, color: color[1] // 100% 处的颜色
                  },
                  {
                    offset: 1, color: color[1] // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              },
              opacity: 1,
              emphasis: {
                color: 'rgba(248, 54, 0, 1)'
              },
            },
            silent: true,
            data: scatterData2
          },
          // 圆柱体底部涟漪
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 4,
            symbolSize: [10, 5],
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke',
              period: 10,
              scale: 7,
              number: 4,
            },
            itemStyle: {
              normal: {
                color: color[0],
              },
              emphasis: {
                color: 'rgba(248, 54, 0, 1)'
              },
            },
            data: scatterData2,
          }
        ]
      }`
}
export default settings

