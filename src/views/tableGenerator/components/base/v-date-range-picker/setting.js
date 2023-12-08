import index from './index'

index.props.dragDefinition = {
  // 组件的icon
  icon: 'icon-date',
  label: '日期范围'
}

index.props.settingDefinition = {
  name: {
    value: 'v-date-range-picker',
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
    label: '参数名',
    type: 'multi-input',
    value: ['', ''],
    rules: [{ validator(rule, config, callback) {
      if (!config.value[0] || !config.value[1]) return callback(new Error('请填写参数名'))
      callback()
    } }]
  },
  initValue: {
    label: '初始值',
    type: 'multi-input',
    value: ['', '']
  },
  formatter: {
    label: '日期格式',
    type: 'el-input',
    value: 'yyyy/MM/dd'
  },
  pickerType: {
    label: '日期选择器类型',
    type: 'el-select',
    value: 'daterange',
    options: [
      { label: 'datetimerange', value: 'datetimerange' },
      { label: 'daterange', value: 'daterange' },
      { label: 'monthrange', value: 'monthrange' }
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
  startPlaceholder: {
    label: '开始框提示语',
    type: 'el-input',
    value: '选择开始时间'
  },
  endPlaceholder: {
    label: '结束框提示语',
    type: 'el-input',
    value: '选择结束时间'
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
  },
  isclear: {
    label: '是否清空',
    type: 'el-select',
    value: false,
    options: [
      { label: '是', value: true },
      { label: '否', value: false }
    ]
  }
}
export default index
