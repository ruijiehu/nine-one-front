<template>
  <div class="table-columns">
    <draggable  :list="list" @start="startDrag" @end="endDrag" :group="{ name: 'column', pull: true, put: true }">
      <div class="column" v-for="(item,index) in list" :key="index">
        <div class="column-item">
          <label>列名</label>
          <el-input v-model="list[index].label" placeholder="label"></el-input>
          <label>类型</label>
          <el-select v-model="list[index].displayType" placeholder="type">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div  class="column-item">
          <label>prop</label>
          <el-input v-model="list[index].prop" placeholder="prop"></el-input>
          <label>宽度</label>
          <el-input-number v-model="list[index].width" controls-position="right" placeholder="width" :step="10"  :max="300"></el-input-number>
        </div>
        <div  class="column-item">
          <i class="el-icon-delete" @click="delColumn(index)"></i>
        </div>
      </div>
    </draggable>
    <el-button @click="addColumn"  type="text">添加选项</el-button>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  model: {
    prop: 'result',
    event: 'getResult'
  },
  components: { draggable },
  data() {
    return {
      list: [],
      options: [{
        value: 'text',
        label: '文本'
      }, {
        value: 'switch',
        label: '开关'
      }]
    }
  },
  watch: {
    list: {
      handler() {
        this.getResult()
      },
      deep: true
    }
  },
  props: ['result'],
  methods: {
    delColumn(index) {
      this.list.splice(index, 1)
    },
    addColumn() {
      this.list.push({ label: '', prop: '', displayType: 'text', width: '' })
    },
    getResult() {
      this.$emit('getResult', this.list)
    },
    startDrag() {

    },
    endDrag() {

    }
  }
}
</script>
<style lang="less" scoped>
.table-columns{
    width: 100%;
    padding-left: 5px;
    box-sizing: border-box;
    color:#606266;
    .column{
      display: flex;
      justify-content: space-between;
      border:1px dashed hsla(0,0%,66.7%,.5);
      padding: 5px 3px;
      box-sizing: border-box;
      margin:10px 0 5px;
      .column-item{
        display: flex;
        flex-direction: column;
        label{
          margin:5px 0 3px;
          color:#606266;
          font-size: 14px;
        }
         /deep/ .el-input,/deep/ .el-input-number{
                width:120px;
            }
        i{
           margin:5px 0;
           cursor: pointer;
           &:hover{
             color:#409eff;
           }
        }
      }

    }
}
</style>
