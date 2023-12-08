import index from './index'

index.props.dragDefinition = {
  // 组件的icon
  icon: 'icon-check-box',
  label: '多选框',
  hidden: true
}

index.props.settingDefinition = {
  name: {
    value: 'v-checkbox',
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
    type: 'el-input',
    value: ''
  },
  initValue: {
    label: '初始值',
    type: 'el-input',
    value: ''
  },
  // 显示的标签
  displayLabel: {
    label: '显示标签',
    type: 'el-input',
    value: ''
  },
  // 选中的值
  trueLabel: {
    label: '选中的值',
    type: 'el-input',
    value: ''
  },
  // 未选中的值
  falseLabel: {
    label: '未选中的值',
    type: 'el-input',
    value: ''
  },
  // 当前是否选中
  checked: {
    label: '当前是否选中',
    type: 'el-checkbox',
    value: false
  },
  // 是否禁用
  disabled: {
    label: '是否禁用',
    type: 'el-checkbox',
    value: false
  }
}
export default index
