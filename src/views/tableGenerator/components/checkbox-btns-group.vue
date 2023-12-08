<template>
  <div class="checkbox-btns-group">
    <div class="head">
      <el-checkbox-group v-model="type" @change="getResult">
        <el-checkbox v-for="(item,index) in types" :key="index" :label="item"></el-checkbox>
      </el-checkbox-group>
      <span class="add-btn">自定义</span>
    </div>
    <div class="static">
      <div class="static-item">
        <label>按钮名称</label>
        <label>按钮方法</label>
      </div>
      <div v-for="(item,index) in funcList" :key="index" class="static-item">
        <el-input v-model="funcList[index].label" placeholder="名称" @change="getResult"></el-input>
        <el-input v-model="funcList[index].value" placeholder="方法" @change="getResult"></el-input>
        <i class="el-icon-delete" @click="delOption(index)"></i>
      </div>
      <div class="static-item">
        <el-button @click="addOption"  type="text">添加</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'result',
    event: 'getResult'
  },
  data() {
    return {
      type: [],
      funcList: []
    }
  },
  watch: {
    result: {
      handler(val) {
        if (val) {
          this.type = [...val.types]
        }
      },
      immediate: true
    }
  },
  props: ['types', 'result'],
  methods: {
    delOption(index) {
      this.funcList.splice(index, 1)
      this.getResult()
    },
    addOption() {
      this.funcList.push({ label: '', value: '' })
      this.getResult()
    },
    getResult() {
      this.$emit('getResult', { types: this.type, customizeTypes: this.funcList })
    }
  }
}
</script>
<style lang="less" scoped>
.checkbox-btns-group{
  .head{
    // display: flex;
    // justify-content: space-between;
    .add-btn{
      cursor: pointer;
      color: #409EFF;
      margin-top:10px;
      display: inline-block;
    }
  }
  .static{
        // margin-right: 20px;
        margin:5px;
        border:1px solid #e1e1e1;
        padding:5px;
        .static-item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin:5px 0;
            label{
                // margin-right: 110px;
                flex:1;
                color:#606266;
            }
            i{
                cursor: pointer;
            }
            /deep/ .el-input{
                width:130px;
            }
        }
    }

}
</style>
