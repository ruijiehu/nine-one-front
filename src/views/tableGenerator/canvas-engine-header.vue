<script>
import MaskWidget from './components/mask-widget'
import openDialog from '@/components/open-dialog'
import draggable from 'vuedraggable'
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      list: [],
      baseProps: [],
      dialogShow: false,
      // 切换前的
      originData: {},
      radio: ''
    }
  },
  computed: {
    ...mapState('currentConfig', ['currentRef']),
    config: {
      get() {
        return this.$store.state.formFilterConfig.config
      },
      set(value) {
        this.$store.dispatch('formFilterConfig/setAllConfig', _.cloneDeep(value))
      }
    }
  },
  methods: {
    ...mapActions('formFilterConfig', ['setCurrentRef', 'addAllConfig', 'delAllConfig', 'exchangeConfig']),
    readFile(contexts) {
      return contexts.keys().map(element => {
        const componentConfig = contexts(element)
        const ctrl = componentConfig.default || componentConfig
        return {
          dragDefinition: ctrl.props.dragDefinition,
          settingDefinition: ctrl.props.settingDefinition
        }
      })
    },
    // 读取组件
    readFiles() {
      this.baseProps = this.readFile(require.context('./components/base', true, /\.vue$/)).filter(item => !item.dragDefinition.hidden)
    },
    // 获取组件属性配置列表
    getSettingPorps(props) {
      return props.map(item => {
        return item.settingDefinition
      })
    },
    exchange(val) {
      this.originData = val
      this.dialogShow = true
    },
    confirmExchange() {
      this.exchangeConfig({
        target: _.cloneDeep(this.radio),
        originData: this.originData
      })
      this.dialogShow = false
    }
  },
  mounted() {
    this.readFiles()
  },
  render(h) {
    const config = this.config
    return (
      <div class='form-filter-wrap'>
        <open-dialog title='切换' isShow={this.dialogShow} onOn-close={() => { this.dialogShow = false }}>
          {
            this.baseProps.map((item, index) => {
              return (
                <el-radio v-model={this.radio} label={item.settingDefinition}>
                  <span key={index} class='list-cell'>
                    <a>
                      <i class={[item.dragDefinition.icon, 'icon', 'iconfont']}></i>
                      <span>{item.dragDefinition.label}</span>
                    </a>
                  </span>
                </el-radio>
              )
            })

          }
          { <div slot='footer' class='dialog-footer'>
            <el-button type='primary' onClick={() => { this.confirmExchange() }}>确定</el-button>
            <el-button type='primary' onClick={() => { this.dialogShow = false }}>取消</el-button>
          </div>
          }
        </open-dialog>
        <span class='filter_area'>过滤区域（请拖拽基础组件）</span>
        <draggable v-model={this.config} class='form-filter-blocks clearfix' tag='div' group={ { name: 'canvas', pull: false, put: ['components'] }} filter='.submit'>
          {
            config
              .map((citem, index) => {
                const item = {}
                const citemKeys = Object.keys(citem)
                const EXTEND_KEYS = ['context', 'style']
                citemKeys.forEach(ck => {
                  if (EXTEND_KEYS.includes(ck)) {
                    item[ck] = citem[ck]
                  } else {
                    item[ck] = citem[ck].value
                  }
                })
                item.context = this.$parent
                const paramName = item.paramName
                if (paramName) {
                  if (typeof paramName === 'string') {
                    // 如果存在初始值,就给组件设置initValue
                    if (this.initParamsValue) {
                      item.initValue = this.initParamsValue[paramName]
                    }
                  } else if (Array.isArray(paramName)) {
                    if (this.initParamsValue) {
                      item.initValue = []
                      paramName.forEach((it) => {
                        item.initValue.push(this.initParamsValue[it])
                      })
                    }
                  }
                }
                if (item.name === 'v-cascader-ui') {
                  item.fetchDrillData = () => this.fetchDrillData()
                  item.querySearch = () => this.querySearch()
                  item.initValue = this.region
                }
                return (
                  <mask-widget data={citem} isChange={true} isActive={item.ref === this.currentRef} onExchange={(val) => { this.exchange(val) }} onCopy={(val) => { this.addAllConfig(val) }} onRemove={(val) => { this.delAllConfig(val) }} nativeOnClick={() => { this.setCurrentRef(item.ref) }}>
                    {
                      h(
                        item.name,
                        {
                          props: item,
                          style: item.style,
                          key: `${item.name}_${index}_${this.key}`
                        }
                      )
                    }
                  </mask-widget>
                )
              })
          }
        </draggable>
      </div>
    )
  },
  components: {
    'mask-widget': MaskWidget,
    draggable: draggable,
    openDialog
  }
}
</script>
<style lang="less" scoped>
.form-filter-wrap{
  border-bottom: 1px dashed #999;
  box-sizing: border-box;
  padding: 10px;
}
.filter_area{
  margin-bottom: 12px;
  display: block;
  color: #909399;
}
.form-filter-blocks{
  min-height: 80px;
  flex:1;
  background-color: #f5f6fa;
  color: #909399;
  font-weight: 500;
  display: flex;
  flex-wrap: wrap;
  border:1px dashed #999;
  /deep/ .widget{
    width: auto;
  }
}
.submit{
    display: inline-block;
    width: 100px;
    height: 38px;
    background: #2183d8;
    vertical-align: top;
    font-size: 18px;
    &:hover{
      background: #2173d8;
    }
  }
.inFormBox{
  float: right;
}
/deep/ .open-dialog{
  .model-content{
    padding-bottom:30px !important;
  }
}
.dialog-footer{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top:50px
}
</style>
