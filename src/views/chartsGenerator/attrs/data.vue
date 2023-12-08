<template>
  <div class="data">
    <div class="data-item">
      <label>url:</label>
      <div class="cell">
        <el-input v-model="dataUrl" placeholder="请输入URL"></el-input>
      </div>
    </div>
    <div class="data-item">
      <label>入参:</label>
      <div class="cell">
        <div class="cell-row" v-for="(item,index) in inputParams" :key="index">
          <el-input v-model="item.label" placeholder="请输入参数名"></el-input>
          <el-input v-model="item.value" placeholder="请输入参数值"></el-input>
          <i class="el-icon-delete" @click="delInput(index)"></i>
        </div>
        <el-button type="primary" @click="inputAdd">增加</el-button>
      </div>
    </div>
    <div class="data-item">
      <label>出参:</label>
      <div class="cell">
        <div class="cell-row" v-for="(item,index) in outputParams" :key="index">
          <el-input v-model="item.label" placeholder="请输入参数名"></el-input>
          <el-input v-model="item.value" placeholder="请输入参数值"></el-input>
          <i class="el-icon-delete" @click="delOutput(index)"></i>
        </div>
        <el-button type="primary" @click="outputAdd">增加</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState('chartConfig', ['dataConfig']),
    dataUrl: {
      get() {
        return this.dataConfig.url
      },
      set(val) {
        const ob = {
          key: 'url',
          value: val
        }
        this.setDataConfig(ob)
      }
    },
    inputParams: {
      get() {
        return this.dataConfig.inputParams
      },
      set(val) {
        const ob = {
          key: 'inputParams',
          value: val
        }
        this.setDataConfig(ob)
      }
    },
    outputParams: {
      get() {
        return this.dataConfig.outputParams
      },
      set(val) {
        const ob = {
          key: 'outputParams',
          value: val
        }
        this.setDataConfig(ob)
      }
    }
  },
  methods: {
    ...mapMutations('chartConfig', ['setDataConfig']),
    inputAdd() {
      const ob = { label: '', value: '' }
      this.inputParams.push(ob)
    },
    delInput(index) {
      this.inputParams.splice(index, 1)
    },
    delOutput(index) {
      this.outputParams.splice(index, 1)
    },
    outputAdd() {
      const ob = { label: '', value: '' }
      this.outputParams.push(ob)
    }
  }
}
</script>
<style lang="less" scoped>
.data{
    padding:30px;
    box-sizing: border-box;
    .data-item{
        display: flex;
        margin-bottom: 10px;
        label{
            width:80px;
            margin-top: 10px;
        }
        .cell{
            flex:1;
            .cell-row{
                display: flex;
                margin-bottom: 10px;
                align-items: center;
                /deep/ .el-input{
                    width: 270px;
                    margin-right: 20px;
                }
                i{
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
