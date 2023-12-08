import index from './index'
index.props.dragDefinition = {
  // 组件的icon
  icon: 'icon-input',
  label: '输入框'
}

index.props.settingDefinition = {
  name: {
    value: 'v-input',
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
  initValue: {
    label: '初始值',
    type: 'el-input'
  },
  placeHolder: {
    label: '提示语',
    type: 'el-input',
    value: '请输入搜索内容'
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
  },
  styleDefination: {
    custom: {}
  }
}
export default index
