import index from './index'

index.props.dragDefinition = {
  // 组件的icon
  icon: 'icon-input',
  label: '字段'
}
function required(message) {
  return function(rule, config, callback) {
    if (!config.value) return callback(new Error(message))
    callback()
  }
}
function requiredLabel(rule, config, callback) {
  if (!config.value || config.value == '字段占位') return callback(new Error('请输入字段名'))
  callback()
}
index.props.settingDefinition = {
  name: {
    value: 'v-table-item',
    hidden: true
  },
  ref: {
    label: '引用名',
    type: 'el-input',
    value: '',
    disabled: true
  },
  label: {
    label: '字段名',
    type: 'el-input',
    value: '字段占位',
    rules: [{ validator: requiredLabel }]
  },
  props: {
    label: '属性字段(prop)',
    type: 'el-input',
    value: '',
    rules: [{ validator: required('请输入属性') }]
  },
  sortable: {
    label: '允许字段排序',
    type: 'el-checkbox',
    value: false
  },

  isEdit: {
    label: '同步编辑字段',
    type: 'el-checkbox',
    value: true
  },
  isTableCheckbox: {
    label: '是否显示为选择框',
    type: 'el-checkbox',
    value: false
  },
  editType: {
    label: '编辑类型',
    type: 'el-select',
    value: 'el-input',
    options: [
      { label: '不可编辑', value: 'none', key: '01' },
      { label: '只读', value: 'readonly', key: '02' },
      { label: '单行文本', value: 'el-input', key: '03' },
      { label: '多行文本', value: 'textarea', key: '09' },
      { label: '日期', value: 'el-date-picker', key: '04' },
      { label: '选择框', value: 'el-select', key: '05' },
      { label: '开关', value: 'el-switch', key: '06' },
      { label: '文件上传', value: 'el-upload', key: '07' },
      { label: '富文本', value: 'rich-editor', key: '08' },
      { label: '简易版富文本', value: 'simple-editor', key: '09' }
    ]
  },
  editConfig: {
    label: '编辑配置',
    type: 'editConfig',
    value: '',
    configs: {
      none: { isShow: false },
      readonly: { componentName: 'el-input', isShow: false, label: '显示格式' },
      'el-input': { componentName: 'el-input', isShow: false, label: '显示格式' },
      textarea: { componentName: 'el-input', type: 'textarea', isShow: false, label: '显示格式' },
      'el-switch': { componentName: 'el-switch', isShow: false, label: '显示格式' },
      'el-date-picker': { componentName: 'el-date-picker', type: 'date', isShow: false, label: '显示格式' },
      dateRange: [{ componentName: 'el-input', type: 'daterange', isShow: true, label: '开始时间Key值', props: 'startDateKey' },
        { componentName: 'el-input', type: 'daterange', isShow: true, label: '结束时间Key值', props: 'endDateKey' }],
      'el-select': { componentName: 'options', isShow: true },
      'el-upload': { componentName: 'el-input', label: '上传地址', isShow: true },
      'rich-editor': { componentName: 'el-rich-editor', label: '显示格式', isShow: false },
      'simple-editor': { componentName: 'el-simple-editor', label: '显示格式', isShow: false }
    }
  },
  validate: {
    label: '校验',
    type: 'validate-block',
    value: ''
  },
  displayType: {
    label: '显示形式',
    type: 'radio-group',
    value: '文本',
    types: ['文本', '开关', '图片', '自定义', '按钮'],
    typeKey: { 文本: '01', 开关: '02', 按钮: '03', 图片: '04', 自定义: '05' }
  },
  displayBtns: {
    hidden: true,
    type: 'checkbox-btns-group',
    value: '',
    types: ['编辑', '删除']
  },
  delKey: {
    label: '删除操作Key值',
    hidden: true,
    type: 'el-input',
    value: ''
  }
}
export default index
