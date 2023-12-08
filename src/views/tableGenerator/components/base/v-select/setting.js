import index from './index'
index.props.dragDefinition = {
  // 组件的icon
  icon: 'icon-select',
  label: '下拉框'
}

index.props.settingDefinition = {
  name: {
    value: 'v-select',
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
  // 下拉框选项
  options: {
    label: '下拉框选项',
    type: 'options',
    value: []
  },
  initValue: {
    label: '初始值',
    type: 'el-input',
    default: '',
    value: ''
  },
  // 初始值对应的label
  initLabel: {
    label: '初始值Label',
    type: 'el-input',
    default: '',
    value: ''
  },
  placeHolder: {
    label: '提示语',
    type: 'el-input',
    value: '请选择选项'
  },
  label: {
    label: '标签',
    type: 'el-input',
    value: ''
  },
  paramName: {
    label: '参数名',
    type: 'el-input',
    value: '',
    rules: [{ validator(rule, config, callback) {
      if (!config.value) return callback(new Error('请填写参数名'))
      callback()
    } }]
  },
  width: {
    label: '宽度',
    type: 'el-input-number',
    value: 200
  }
}
export default index
