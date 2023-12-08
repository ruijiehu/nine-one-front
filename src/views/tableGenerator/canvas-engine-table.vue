<template>
  <div class="table-engine">
    <div class="configEditor">
      <span class="configEditor_title">表头配置(请拖拽字段组件)</span>
      <draggable  @change="dataChange" v-model="columns" class="dthead" tag="div"  :group="{ name: 'canvasTable', pull: false, put: ['bizcomponents'] }"  filter=".submit">
        <div v-for="(item,index) in columns" @click="thClick(item)" :key="index" >
          <maskWidget :isActive="currentRef===item.ref.value" :data="item" @copy="copy" @remove="remove" style="height:100%">
            <div class="dthead-th"  >
              <template v-if="item.isTableCheckbox.value"><el-checkbox></el-checkbox></template>
              <template v-else>{{item.label.value}}</template>
            </div>
          </maskWidget>
        </div>
      </draggable>
      <span class="editTitle">新增/编辑字段(请拖拽字段组件)</span>
      <draggable v-model="editColumns" class="formDraggle" tag="div"  :group="{ name: 'editFields', pull: false, put: ['bizcomponents'] }"  filter=".submit">
        <div class="editColumn" v-for="(item,index) in editColumns" @click="formItemClick(item)" :key="index" >
          <maskWidget :isActive="currentRef===item.ref.value" @copy="copyFormField" :data="item" @remove="removeFormField" style="height:100%">
            <div class="dthead-th">
              {{item.label.value}}
            </div>
          </maskWidget>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import MaskWidget from './components/mask-widget'
import _ from 'lodash'
export default {
  components: { draggable, MaskWidget },
  data() {
    return {
      checked: false
    }
  },
  computed: {
    ...mapState('tableConfig', ['config', 'settingDefinition']),
    ...mapState('currentConfig', ['currentRef', 'currentConfig', 'currentEditConfig', 'currentEditRef']),
    columns: {
      get() {
        return this.$store.state.tableConfig.config.tableColumns.value
      },
      set(value) {
        this.$store.dispatch('tableConfig/setTableColumns', _.cloneDeep(value))
      }
    },
    // 编辑字段配置
    editColumns: {
      get() {
        return this.$store.state.tableConfig.config.formColumns.value
      },
      set(value) {
        this.$store.dispatch('tableConfig/setFormColums', _.cloneDeep(value))
      }
    }
  },
  mounted() {
  },
  watch: {
    checked: {
      handler(val) {
        if (val) {
          if (!this.currentConfig.isShow.value) {
            const cols = this.columns.filter(item => item.isShow.value)
            if (cols.length > 0) {
              this.setCurrentConfig(cols[0])
            } else {
              this.setCurrentConfig({})
            }
          }
        }
      }
    }
  },
  methods: {
    ...mapMutations('currentConfig', { setCurrentConfig: 'setCurrentConfig' }),
    ...mapActions('tableConfig', ['addTableColumn', 'delTableColumn', 'addFormColumn', 'copyFormColumn', 'delFormColumn']),
    // 点击表单头部
    thClick(item) {
      this.setCurrentConfig(item)
    },
    formItemClick(item) {
      this.setCurrentConfig(item)
    },
    copy(val) {
      this.addTableColumn(val)
    },
    copyFormField(val) {
      this.copyFormColumn(val)
    },
    removeFormField(val) {
      this.delFormColumn(val)
    },
    remove(val) {
      this.delTableColumn(val)
    },
    // 数据变化
    dataChange(properties) {
      if (properties.added) {
        this.addFormColumn(properties.added.element)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.table-engine{
  position: relative;
  box-sizing: border-box;
  // padding-top: 68px;
  display: flex;
  flex-direction: column;
  .configEditor{
    margin-top: 20px;
    box-sizing: border-box;
    padding-left: 10px;
    .configEditor_title{
      margin-bottom: 12px;
      display: block;
      color: #909399;
    }
    .editTitle{
      display: block;
      color: #909399;
      margin-top: 30px;
      margin-bottom: 12px;
    }
  }
  .column-checkbox{
    text-align: right;
    padding:5px 10px 20px;
  }
  .empty{
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999999;
  }
  /deep/ .widget-mask{
     height: 100%;
  }
  .dthead{
    height: 48px;
    width: calc(100% - 20px);
    background-color: #f5f6fa;
    color: #909399;
    font-weight: 500;
    display: flex;
    border:1px dashed #999;
    .dthead-th{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      min-width: 80px;
      height: 100%;
      &:not(:last-child){
        border-right: 1px dashed #999;
      }
      &.action{
        padding:5px 0 20px;
      }
    }
  }
  .formDraggle{
    height: 548px;
    width: calc(100% - 20px);
    background-color: #f5f6fa;
    color: #909399;
    font-weight: 500;
    border:1px dashed #999;
    .editColumn{
      display: flex;
      align-items: center;
      .dthead-label{
        width: 150px;
        text-align: right;
        box-sizing: border-box;
        padding:0 20px;
      }
    }
    .widget {
      width: 100%;
    }
    .dthead-th{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      min-width: 500px;
      height: 30px;
      &:not(:last-child){
        border-right: 1px dashed #999;
      }
      &.action{
        padding:5px 0 20px;
      }
    }
  }
}
</style>
