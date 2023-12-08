const settings = {
  name: 'base-wordcloud',
  type: '热词云',
  settings: `
    const data = 
    [{name: "拖欠工资", value: 1228},
    {name: "因为台风", value: 981},
    {name: "桐乡的防疫", value: 363},
    {name: "台风梅花", value: 1228},
    {name: "海宁的防疫", value: 981},
    {name: "名瑞华府", value: 363},
    {name: "劳资纠纷", value: 333},
    {name: "嘉兴南站", value: 263},
    {name: "虐狗事件", value: 163},
    {name: "采样点做", value: 63}]
    const colorList = ['#f89b6299', '#afcf7cde', '#fece5b']
    const option = {
        series: [{
            type: 'wordCloud',
            shape: 'circle',
            keepAspect: false,
            left: 'center',
            top: 'center',
            width: '80%',
            height: '80%',
            right: null,
            bottom: null,
            sizeRange: [12, 60],
            rotationRange: [-90, 90],
            rotationStep: 45,
            gridSize: 8,
            drawOutOfBound: false,
            layoutAnimation: true,
            textStyle: {
                normal: {
                color: function() {
                let index = Math.floor(Math.random() * colorList.length)
                return colorList[index]
                }
            }
            },
            emphasis: {
                focus: 'self',
                textStyle: {
                    textShadowBlur: 10,
                    textShadowColor: '#333'
                }
            },
            data: data
        }]
    }`
}
export default settings

