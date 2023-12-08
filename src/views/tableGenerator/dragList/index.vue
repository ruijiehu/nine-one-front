<template>
  <div class="dragList">
    <div class="components base">
      <div class="label">基础组件</div>
      <draggable  :list="getSettingPorps(baseProps)" @start="startDrag" @end="endDrag" class="list" tag="div" draggable=".list-cell" :sort="false" :group="{ name: 'components', pull: 'clone', put: false }">
        <span v-for="(item,index) in baseProps" :key="index" class="list-cell">
          <a>
            <i :class="item.dragDefinition.icon" class="icon iconfont"></i>
            <span>{{item.dragDefinition.label}}</span>
          </a>
        </span>
      </draggable>
    </div>
    <div class="components busines">
      <div class="label">业务组件</div>
      <draggable :clone="cloneData" :list="getSettingPorps(businessProps)" @start="startDrag" @end="endDrag" class="list" tag="div" draggable=".list-cell" :sort="false" :group="{ name: 'bizcomponents', pull: 'clone', put: false }">
        <span v-for="(item,index) in businessProps" :key="index" class="list-cell">
          <a>
            <i :class="item.dragDefinition.icon" class="icon iconfont"></i>
            <span>{{item.dragDefinition.label}}</span>
          </a>
        </span>
      </draggable>
    </div>
    <div class="components layout">

    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapMutations } from 'vuex'
import { randomString } from '@/utils/index'
export default {
  data() {
    return {
      // 基础组件名称
      baseProps: [],
      // 业务组件名称
      businessProps: []
    }
  },
  components: {
    draggable: draggable
  },
  created() {
    this.readFiles()
  },
  methods: {
    ...mapMutations('tableConfig', ['setInputProps', 'setTableItemProps']),
    readFile(contexts) {
      return contexts.keys().map(element => {
        const componentConfig = contexts(element)
        const ctrl = componentConfig.default || componentConfig
        return {
          dragDefinition: ctrl.props.dragDefinition,
          settingDefinition: ctrl.props.settingDefinition,
          hidden: ctrl.props.hidden
        }
      })
    },
    // 读取组件
    readFiles() {
      this.baseProps = this.readFile(require.context('../components/base', true, /\.vue$/)).filter(item => !item.dragDefinition.hidden)
      this.businessProps = this.readFile(require.context('../components/business', true, /\.vue$/)).filter(item => !item.dragDefinition.hidden)
      // 设置输入框和表格列配置
      const inputProps = this.getSettingPorps(this.readFile(require.context('../components/base/v-input', true, /\.vue$/)))[0]
      const tableItemProps = this.getSettingPorps(this.businessProps)[0]
      this.setInputProps(inputProps)
      this.setTableItemProps(tableItemProps)
    },
    // 获取组件属性配置列表
    getSettingPorps(props) {
      return props.map(item => {
        return item.settingDefinition
      })
    },
    // 开始拖拽
    startDrag() {
    },
    // 结束拖拽事件
    endDrag() {
    },
    // 克隆数据,增加flag标志位
    cloneData(origin) {
      origin.flag = randomString(24)
      return origin
    }
  }
}
</script>

<style lang="less" scoped>
.dragList{
  .components{
    .label{
      box-sizing: border-box;
       padding: 8px 12px;
      font-size: 13px;
    }
    .list{
      position: relative;
      overflow: hidden;
      padding: 0 10px 10px;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      .list-cell{
        font-size: 12px;
        display: block;
        width: 46%;
        line-height: 26px;
        position: relative;
        float: left;
        left: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 1%;
        color: #333;
        border: 1px solid #f4f6fc;
        a{
          display: block;
          cursor: move;
          background: #f4f6fc;
          border: 1px solid #f4f6fc;
          .icon{
              margin-right: 6px;
              margin-left: 8px;
              font-size: 14px;
              display: inline-block;
              vertical-align: middle;
          }
          &:hover{
            color: #66b1ff;
            border: 1px dashed #66b1ff;
          }
        }
      }
    }
  }
}
</style>
