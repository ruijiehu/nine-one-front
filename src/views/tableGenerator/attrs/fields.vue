<template>
  <div class="fields">
    <el-form ref="ruleForm" :model="currentConfig">
      <template v-for="(item,key) in currentConfig">
        <el-form-item :prop="key" :rules="item.rules" :key="key">
          <div class="field"  v-if="!item.hidden" >
            <label>{{item.label}}</label>
            <template v-if="key==='editType'">
              <el-select v-model="currentConfig[key].value" placeholder="请选择" @change="currentConfig['editConfig'].value=''">
                <el-option
                  v-for="cell in item.options"
                  :key="cell.value"
                  :label="cell.label"
                  :value="cell.value">
                </el-option>
              </el-select>
            </template>
            <template v-else-if="key==='editConfig'">
              <component  v-if="item.configs[currentConfig['editType'].value].isShow" :is="item.configs[currentConfig['editType'].value].componentName" :types="item.types"  v-model="currentConfig[key].value">
                <template v-if="item.configs[currentConfig['editType'].value].label" slot="prepend">{{item.configs[currentConfig['editType'].value].label}}</template>
              </component>
            </template>
            <template v-else-if="item.type==='el-select'">
              <el-select v-model="currentConfig[key].value" placeholder="请选择" >
                <el-option
                  v-for="cell in item.options"
                  :key="cell.value"
                  :label="cell.label"
                  :value="cell.value">
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <component :is="item.type" :disabled="item.disabled" :types="item.types"  v-model="currentConfig[key].value"></component>
            </template>
            <div class="check-box" v-if="key==='displayType'&&currentConfig[key].value==='按钮'">
              <component :is="currentConfig['displayBtns'].type" :types="currentConfig['displayBtns'].types" v-model="currentConfig['displayBtns'].value"></component>
            </div>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <div class="field" v-if="currentConfig['displayType']&&currentConfig['displayType'].value==='按钮'&&currentConfig['displayBtns'].value&&currentConfig['displayBtns'].value.types.indexOf('删除')!==-1">
      <label>删除操作KEY值</label>
      <el-input v-model="currentConfig['delKey'].value"></el-input>
    </div>
  </div>
</template>
<script>
import options from '../components/select-options'
import tableColumns from '../components/table-columns'
import radioGroup from '../components/radio-group'
import checkboxGroup from '../components/checkbox-group'
import checkboxBtnsGroup from '../components/checkbox-btns-group'
import MultiInput from '../components/multi-input'
import MultiPrependInput from '../components/multi-prepend-input'
import validateBlock from '../components/validate-block'
import { mapMutations } from 'vuex'
export default {
  components: { options, tableColumns, radioGroup, checkboxGroup, MultiInput, MultiPrependInput, validateBlock, checkboxBtnsGroup },
  data() {
    return {
      // 右侧编辑字段中
      hideFields: {
        thead: ['editConfig', 'editType', 'editWeight', 'validate'],
        form: ['delKey', 'displayBtns', 'displayType', 'isTableCheckbox', 'sortable']
      }
    }
  },
  computed: {
    currentConfig() {
      return this.$store.state.currentConfig.currentConfig
    }
  },
  mounted() {
  },
  watch: {
    // 当前的变化值，当编辑表头配置时候将属性同步到编辑字段属性中
    currentConfig: {
      deep: true,
      // eslint-disable-next-line no-unused-vars
      handler(nv, ov) {
        const isEdit = nv.isEdit && nv.isEdit.value
        if (isEdit && !nv.inEditArea) {
          this.$store.dispatch('tableConfig/syncTableColumn2Form', nv)
        }
      }
    }
  },
  methods: {
    ...mapMutations('tableConfig', ['upDateTableColumn']),
    ...mapMutations('formFilterConfig', { upDateConfig: 'upDateConfig' }),
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) resolve()
          else reject()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../styles/property.less');
.fields{
  padding:20px 10px;
  box-sizing: border-box;
  overflow-y: auto;
  height: 800px;
  .field{
      display: flex;
      font-size: 14px;
      flex-direction: column;
      padding-bottom:10px;
      border-bottom: 1px solid #e1e1e1;
      margin-bottom: 15px;
      label{
        padding:5px 0 8px;
        color: #606266;
      }
      .check-box{
        padding:10px 5px;
        border:1px solid #e1e1e1;
        margin-top:5px;
      }
  }
}
</style>
