<template>
  <div class="validate-block">
    <div class="row">
      <el-checkbox v-model="isRequired" @change="getResult">必填</el-checkbox>
      <el-input v-if="isRequired"  @change="getResult"  v-model="requiredMsg" placeholder="自定义错误提示"></el-input>
    </div>
    <div class="row">
      <el-checkbox v-model="isValidate"  @change="getResult"></el-checkbox>
      <el-select :disabled="!isValidate"  @change="getResult" v-model="validateType" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-if="isValidate"  @change="getResult"  v-model="validateMsg" placeholder="自定义错误提示"></el-input>
    </div>
    <div class="row">
      <el-checkbox v-model="isCustom"  @change="getResult"></el-checkbox>
      <el-input :disabled="!isCustom"  @change="getResult"  v-model="expression" placeholder="填写正则表达式"></el-input>
      <el-input v-if="isCustom"  @change="getResult"  v-model="customMsg" placeholder="自定义错误提示"></el-input>
    </div>
  </div>
</template>
<script>
// import rules from '@/common/rules'
export default {
  model: {
    prop: 'result',
    event: 'getResult'
  },
  data() {
    return {
      isRequired: false,
      requiredMsg: '',
      isValidate: false,
      validateType: '',
      validateMsg: '',
      options: [{ label: '字符串', value: 'RuleString' },
        { label: '数字', value: 'RuleNumber' },
        { label: '浮点数', value: 'RuleDecimalsAllowEmpty' },
        { label: 'URL地址', value: 'RuleUrl' },
        { label: '邮箱地址', value: 'RuleEmail' },
        { label: '手机号', value: 'RulePhone' }],
      isCustom: false,
      expression: '',
      customMsg: ''
    }
  },
  watch: {
    result: {
      handler(val) {
        if (val) {
          this.isRequired = val.isRequired
          this.requiredMsg = val.requiredMsg
          this.isValidate = val.isValidate
          this.validateType = val.validateType
          this.validateMsg = val.validateMsg
          this.isCustom = val.isCustom
          this.expression = val.expression
          this.customMsg = val.customMsg
        } else {
          this.isRequired = false
          this.requiredMsg = ''
          this.isValidate = false
          this.validateType = ''
          this.validateMsg = ''
          this.isCustom = false
          this.expression = ''
          this.customMsg = ''
        }
      },
      immediate: true,
      deep: true
    }
  },
  props: ['result'],
  methods: {
    getResult() {
      const { isRequired, requiredMsg, isValidate, validateType, validateMsg, isCustom, expression, customMsg } = this
      this.$emit('getResult', { isRequired, requiredMsg, isValidate, validateType, validateMsg, isCustom, expression, customMsg })
    }
  }
}
</script>
<style lang="less" scoped>
.validate-block{
    .row{
        margin-bottom: 10px;
        div{
              margin-bottom: 10px;
        }
    }
    /deep/ .el-checkbox{
        margin-right:10px;
    }
    /deep/ .el-input__inner{
        height:32px !important;
        line-height: 32px;
    }
}
</style>
