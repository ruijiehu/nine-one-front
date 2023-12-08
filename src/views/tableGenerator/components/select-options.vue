<template>
  <div class="options">
    <el-radio-group v-model="currentTab" @change="tabChange" size="medium">
      <el-radio-button label="字典数据"></el-radio-button>
      <el-radio-button label="动态数据"></el-radio-button>
    </el-radio-group>
    <div class="static" v-if="currentTab==='字典数据'">
      <el-input v-model="dictCode" placeholder="请输入字典code" @change="dictChange"></el-input>
    </div>
    <div class="dynamic" v-else>
      <el-input placeholder="请输入URL" v-model="selectOptionUrl" @change="selectOptionChange">
        <template slot="prepend">URL</template>
      </el-input>
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
      tabs: [{ key: 'static', value: '字典数据' }, { key: 'dynamic', value: '动态数据' }],
      currentTab: '字典数据',
      // 字典数据code
      dictCode: '',
      selectOptionUrl: ''
    }
  },
  computed: {

  },
  watch: {
    result() {
      if (this.result.type == 'dict') this.dictCode = this.result.value
      else if (this.result.type == 'url') this.selectOptionUrl = this.result.value
      this.currentTab = this.result.type == 'dict' ? '字典数据' : '动态数据'
    }
  },

  mounted() {
  },
  props: ['result'],
  methods: {
    // 选项改变
    tabChange(tab) {
      if (tab === '字典数据') {
        this.$emit('getResult', { type: 'dict', value: this.dictCode })
      } else {
        this.$emit('getResult', { type: 'url', value: this.selectOptionUrl })
      }
      this.consolelog()
    },
    // 字典输入变化
    dictChange(value) {
      if (this.currentTab === '字典数据') {
        this.$emit('getResult', { type: 'dict', value: value })
      }
    },
    // 接口输入变化
    selectOptionChange(value) {
      this.$emit('getResult', { type: 'url', value: value })
    },
    consolelog() {
      console.log(this.result)
    }
  }
}
</script>
<style lang="less" scoped>
.options{
    width: 100%;
    padding-left: 5px;
    box-sizing: border-box;
    color:#606266;
    /deep/ .el-radio-group{
        margin:10px 0 20px;
    }
    .static{
        // margin-right: 20px;
        .static-item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin:5px 0;
            label{
                margin-right: 110px;
            }
            i{
                cursor: pointer;
            }
            /deep/ .el-input{
                width:130px;
            }
        }
    }
    .dynamic{
        // margin-right: 20px;
        /deep/.el-input{
            margin-bottom:5px;
            .el-input-group__prepend{
                width:35px;
            }
        }
    }
}
</style>
