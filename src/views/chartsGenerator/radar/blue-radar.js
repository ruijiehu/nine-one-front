const settings = {
  name: 'blue-radar',
  type: '雷达图',
  settings: `
    const list=[{ name: '新闻综合频道', value: 1228 },
    { name: '公共频道', value: 981 },
    { name: '禾点点运行中心', value: 363 },
    { name: '交通经济频率', value: 1228 },
    { name: '文化影视频道', value: 981 },
 ]
    const maxList= [{ name: '新闻综合频道', max: 1528 },
        { name: '公共频道', max: 1081 },
        { name: '禾点点运行中心', max: 463 },
        { name: '交通经济频率', max: 1528 },
        { name: '文化影视频道', max: 1081 },
        ]
    const option = {
        radar: {
           indicator: maxList,
           radius: 250,
           splitNumber: 2,
           name: {
               textStyle: {
                   fontSize: 30,
                   color: '#00b6e4',
               },
           },
           axisName: {
               color: '#00b6e4',
               fontSize: 30,
               fontFamily: 'digit-font'
           },
           axisLine: {
               lineStyle: {
                   color: '#0e4498'
               }
           },
           splitArea:{
               areaStyle:{
                   color:'rgba(2,87,147,0.1)'
               }
           },
           splitLine: {
               lineStyle: {
                   color: '#0e4498'
               }
           }
       },
   series: [
       {
       type: 'radar',
       areaStyle: {
       normal: {
                   color: new echarts.graphic.LinearGradient(
                           0, 0, 1, 0,
                           [
                               {offset: 0, color: '#00c1e4'},
                               {offset: 1, color: '#0245e4'}
                           ]
                       )
                   }
       },
       lineStyle:{
           color:'#00c1e4'
       },
       data: [
           {
           value:list.map(e=>{return e.value}),
           // name: '策划部门'
           },
       ]
       }
   ]
   }`
}
export default settings

