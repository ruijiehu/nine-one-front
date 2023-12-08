import index from './index'

index.props.dragDefinition = {
  // 组件的icon
  icon: 'icon-date',
  label: '日期选择'
}

index.props.settingDefinition = {
  name: {
    value: 'v-date-picker',
    hidden: true
  },
  // 上下文环境
  context: {
    hidden: true
  },
  ref: {
    label: '引用名',
    type: 'el-input',
    value: '',
    disabled: true
  },
  paramName: {
    label: '参数名1',
    type: 'el-input',
    value: '',
    rules: [{ validator(rule, config, callback) {
      if (!config.value) return callback(new Error('请填写参数名'))
      callback()
    } }]
  },
  initValue: {
    label: '初始值',
    type: 'el-input',
    value: ''
  },
  formatter: {
    label: '日期格式',
    type: 'el-input',
    value: 'yyyy/MM/dd'
  },
  pickerType: {
    label: '日期选择器类型',
    type: 'el-select',
    value: 'date',
    options: [
      { label: 'year', value: 'year' },
      { label: 'month', value: 'month' },
      { label: 'date', value: 'date' },
      { label: 'dates', value: 'dates' },
      { label: 'week', value: 'week' },
      { label: 'datetime', value: 'datetime' }
    ]
  },
  days: {
    label: '默认显示天数',
    type: 'el-input-number',
    value: 0
  },
  placeholder: {
    label: '提示语',
    type: 'el-input',
    value: '选择日期'
  },
  defaultTime: {
    label: '默认时间',
    type: 'el-input',
    value: ' 00:00:00'
  },
  label: {
    label: '标签',
    type: 'el-input',
    value: ''
  }
}
export default index
