<template>
  <el-form-item v-bind="attrs">
    <el-input
      v-if="type == 'input'"
      :placeholder="`请输入${$attrs.label}`"
      v-model="innerValue"
      v-bind="inputProps"
    />
    <el-input
      v-if="type == 'textarea'"
      :placeholder="`请输入${attrs.label || ''}`"
      :max-length="$attrs.maxLength"
      v-model="innerValue"
      v-bind="inputProps"
    />
    <FileUpload v-if="type=='file'" v-model="innerValue" v-bind="inputProps"/>
    <ImageUpload v-if="type=='image'" v-model="innerValue" v-bind="inputProps"/>
    <Editor v-if="type=='richText'" v-model="innerValue" v-bind="inputProps" :min-height='200'/>
    <el-date-picker
      v-if="type=='date'"
      v-model="innerValue"
      type="date"
      :placeholder="`请选择${attrs.label || ''}`"
      v-bind="inputProps"
    >
    </el-date-picker>
    <el-date-picker
      v-if="type=='daterange'"
      v-model="innerValue"
      type="daterange"
      range-separator="至"
      start-placeholder="请选择开始日期"
      end-placeholder="请选择结束日期">
    </el-date-picker>
    <el-date-picker
      v-if="type=='datetime'"
      v-model="innerValue"
      type="datetime"
      :placeholder="`请选择${attrs.label || ''}`">
    </el-date-picker>
    <el-date-picker
      v-if="type=='datetimerange'"
      v-model="innerValue"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <DictSelectTag
      v-model="innerValue"
      clearable
      v-if="type == 'select'"
      :placeholder="`请选择${attrs.label || ''}`"
      :dict-code="attrs.dictCode"
      v-bind="inputProps"
    />

    <component
      v-if="type == 'custom'"
      v-model="innerValue"
      :is="attrs.component"
    />
  </el-form-item>
</template>

<script>
import FileUpload from '../FileUpload'
import ImageUpload from '../ImageUpload'
import Editor from '../Editor'
import DictSelectTag from '../DictSelectTag'
export default {
  components: { FileUpload, ImageUpload, Editor, DictSelectTag },
  props: {
    value: [String, Number, Array, Object, Boolean],
    type: String,
    inputProps: Object,
    formItemProps: Object,
    hideLabel: Boolean
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    innerValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('change', val)
      }
    },
    attrs() {
      return this.hideLabel
        ? { ...this.$attrs, label: undefined, ...this.formItemProps }
        : { ...this.$attrs, ...this.formItemProps }
    }
  }
}
</script>

<style scoped>
.j-dict-select-tag {
  min-width: 150px;
}
</style>
