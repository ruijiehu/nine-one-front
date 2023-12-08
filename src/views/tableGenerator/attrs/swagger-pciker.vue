<template>
  <div class="swaggerPicker">
    <h3>选择模块</h3>
    <div class="apiModules">
      <div v-for="(item,key) in moduleList" :key="key" class="apiModule">
        <el-radio v-model="moduleName" @input="chooseModule" :label="item.name"></el-radio>
      </div>
    </div>
    <h3>选择接口配置</h3>
    <el-table :data="apiList" :cell-style="{'textAlign':'center'}"
              :header-cell-style="{textAlign:'center',background:'#f8f8fc'}"
              class="configTable"
              :max-height="300"
    >
      <el-table-column label="方法" width="90px">
        <template slot-scope="data">
          <span class="method" :class="data.row.method">{{ data.row.method}}</span>
        </template>
      </el-table-column>
      <el-table-column label="接口名" width="300px">
        <template slot-scope="data">
          <span class="name" :class="data.row.method">{{data.row.summary || data.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column label="接口地址">
        <template slot-scope="data">
          <span class="address" :class="data.row.method">{{data.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置">
        <template slot-scope="data">
          <el-select @change="configChange(data,$event)" v-model="form[data.$index]" clearable>
            <el-option v-for="(item,key) in apiOrmOption"
                       :label="item.label"
                       :value="item.value"
                       :key="key"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <div class="action">
      <el-button type="primary" @click="fillApis">填充接口</el-button>
      <el-button type="primary" @click="fillAndGenerate">填充并生成布局</el-button>
    </div>
  </div>
</template>

<script>
import VInput from '../components/base/v-input/setting'
import VDatePicker from '../components/base/v-date-picker/setting'
import TableItem from '../components/business/tableItem/setting'
import { randomString } from '@/utils/index'
import { getSwaggerApiList } from '@/api/tool/gen'
import _ from 'lodash'
// 识别的查询参数需要排除的部分
const EXCLUDE_QUERY_FIELDS = ['uuid', 'pageNum', 'pageSize', 'sort', 'order', 'deletedFlag', 'ID', 'id']
// 需要排除的表格属性
const EXCLUDE_TABLE_FIELDS = ['creator', 'modifyDate', 'uuid',
  'createDate', 'sort', 'order', 'modifier', 'pageNum', 'pageSize', 'deletedFlag']
// 需要排除的编辑表单字段
const EXCLUDE_FORM_FIELDS = ['creator', 'modifyDate', 'uuid',
  'createDate', 'sort', 'order', 'modifier', 'pageNum', 'pageSize', 'deletedFlag']
const PAGE_ATTR_ORM = {
  列表: ['getMethod', 'getMethodType'],
  详情: ['detailMethod', 'detailMethodType'],
  新增: ['postMethod', 'postMethodType'],
  编辑: ['putMethod', 'putMethodType'],
  删除: ['deleteMethod', 'deleteMethodType']
}
const QUERY = '列表'
const ADD = '新增'
// 查询组件的属性获取
const INPUT_SETTING = VInput.props.settingDefinition
const DATE_PICKER_SETTING = VDatePicker.props.settingDefinition
const TABLE_ITEM_SETTING = TableItem.props.settingDefinition
export default {
  data() {
    return {
      moduleList: [],
      moduleName: '',
      moduleNameEn: '',
      apiList: [],
      // swagger中对应的查询接口
      queryApi: {},
      // swagger对应的新增API
      addApi: {},
      // 模型定义对象
      definitions: {},
      apiOrmOption: [
        {
          label: '列表',
          value: '列表'
        }, {
          label: '详情',
          value: '详情'
        }, {
          label: '新增',
          value: '新增'
        }, {
          label: '编辑',
          value: '编辑'
        }, {
          label: '删除',
          value: '删除'
        }
      ],
      form: {

      }
    }
  },
  watch: {
    // 切换模块时，将form的值重置
    moduleName() {
      this.form = {}
      this.apiOrmOption = this.$options.data.call(this).apiOrmOption
    }
  },
  computed: {
  },
  methods: {
    // 获取swagger文档接口
    async getSwaggerApiInfo() {
      const res = await getSwaggerApiList()
      const { tags, paths, definitions } = res
      this.definitions = definitions
      const pathKeys = Object.keys(paths)
      const groupedPathes = tags.map(item => {
        const groupKey = item.name
        const pGroup = []
        pathKeys.forEach(pItem => {
          const keys = Object.keys(paths[pItem])
          keys.forEach(key => {
            const methodValue = paths[pItem][key]
            const tags = methodValue.tags
            if (tags.includes(groupKey)) {
              pGroup.push({
                path: pItem,
                method: key,
                ...methodValue
              })
            }
          })
        })
        return {
          name: groupKey,
          nameEn: item.description,
          methods: pGroup
        }
      })
      this.moduleList = groupedPathes
    },
    // 选择模块后的方法
    chooseModule(moduleName) {
      const pickedModule = this.moduleList.find(item => item.name === moduleName)
      this.apiList = pickedModule.methods
      this.moduleNameEn = pickedModule.nameEn.replace(/\s+|Controller/g, '')
    },
    configChange() {

    },
    // 填充接口
    fillApis() {
      const ormObj = {}
      for (const i in this.form) {
        const methodName = this.form[i]
        const pageAttrObj = PAGE_ATTR_ORM[methodName]
        const targetApi = this.apiList[i]
        if (methodName === QUERY) {
          this.queryApi = targetApi
        } else if (methodName === ADD) {
          this.addApi = targetApi
        }
        console.log(this.queryApi, this.addApi)
        ormObj[pageAttrObj[0]] = targetApi.path
        ormObj[pageAttrObj[1]] = targetApi.method
      }
      this.$store.commit('currentConfig/setPageAttr', {
        pageName: this.moduleName,
        pageNameEn: this.moduleNameEn,
        ...ormObj
      })
      this.$emit('close')
    },
    // 填充过滤区域
    fillFilters(parameters) {
      // 需要排除的条件
      const excludeCondition = (item) => {
        return !EXCLUDE_QUERY_FIELDS.includes(item.name) &&
        item.type !== 'array'
      }
      const configArr = []
      // 排除数据库常用字段，并过滤array类型的数据
      const pureQueryFields = parameters.filter(item => excludeCondition(item))
      pureQueryFields.forEach(item => {
        if (item.format && item.format === 'date-time') {
          // 放置时间组件
          const datePickerClone = _.cloneDeep(DATE_PICKER_SETTING)
          datePickerClone.label.value = item.description || item.name
          datePickerClone.ref.value = randomString(24)
          datePickerClone.paramName.value = item.name
          datePickerClone.pickerType.value = 'datetime'
          configArr.push(datePickerClone)
        } else {
          // 默认放置输入框组件
          const inputClone = _.cloneDeep(INPUT_SETTING)
          inputClone.label.value = item.description || item.name
          inputClone.paramName.value = item.name
          inputClone.ref.value = randomString(24)
          configArr.push(inputClone)
        }
      })
      this.$store.dispatch('formFilterConfig/setAllConfig', _.cloneDeep(configArr))
    },
    // 填充编辑区域字段
    fillFormFields(schema) {
      const excludeCondition = (propName, propObj) => {
        return !EXCLUDE_FORM_FIELDS.includes(propName) &&
        propObj.type !== 'array'
      }
      const formConfig = []
      const originalRef = schema.originalRef
      if (originalRef) {
        const originDtoName = originalRef.replace(/WebResult«|PageInfo«|»/g, '')
        if (originDtoName) {
          const originDto = this.definitions[originDtoName]
          if (originDto) {
            const { properties } = originDto || {}
            for (const propName in properties) {
              const propObj = properties[propName]
              // 一些数据库固有的字段需要排除掉，如果字段是array类型也需要排除
              if (excludeCondition(propName, propObj)) {
                const tableFieldData = _.cloneDeep(TABLE_ITEM_SETTING)
                tableFieldData.label.value = propObj.description || propName
                tableFieldData.props.value = propName
                if (propObj.format === 'date-time') {
                  tableFieldData.editType.value = 'el-date-picker'
                }
                formConfig.push(tableFieldData)
              }
            }
          }
        }
      }
      this.$store.dispatch('tableConfig/setFormColums', formConfig)
    },
    // 填充表头配置
    fillTheadFields(schema) {
      const excludeFunc = (propName, propObj) => {
        return !EXCLUDE_TABLE_FIELDS.includes(propName) &&
         propObj.type !== 'array' &&
          propName.indexOf('id') === -1 && propName.indexOf('Id') === -1
      }
      const theadConfig = []
      const originalRef = schema.originalRef
      if (originalRef) {
        const originDtoName = originalRef.replace(/WebResult«|PageInfo«|»/g, '')
        if (originDtoName) {
          // 拿到具体的模型对象
          const originDto = this.definitions[originDtoName]
          if (originDto) {
            const { properties } = originDto || {}
            for (const propName in properties) {
              const propObj = properties[propName]
              // 一些数据库固有的字段需要排除掉，如果字段是array类型也需要排除
              if (excludeFunc(propName, propObj)) {
                const tableFieldData = _.cloneDeep(TABLE_ITEM_SETTING)
                tableFieldData.label.value = propObj.description || propName
                tableFieldData.props.value = propName
                theadConfig.push(tableFieldData)
              }
            }
          }
        }
      }
      this.$store.dispatch('tableConfig/setTableColumns', theadConfig)
    },
    // 填充并生成布局
    fillAndGenerate() {
      // 先填充接口，再填充布局
      this.fillApis()
      if (this.queryApi) {
        // 填充过滤区域的参数
        const { parameters, responses } = this.queryApi
        if (parameters) {
          this.fillFilters(parameters)
        }
        const schema = responses['200'].schema
        // 需要对结果进行处置，拿出原始的response字段
        this.fillTheadFields(schema)
      }
      if (this.addApi) {
        const addParams = this.addApi.parameters
        if (Array.isArray(addParams) && addParams.length > 0) {
          const postDto = addParams[0]
          const addParamScema = postDto.schema
          if (addParamScema) {
          // 对新增的接口进行分析，分析出新增的参数
            this.fillFormFields(addParamScema)
          }
        }
      }
    }
  },
  created() {
    this.getSwaggerApiInfo()
  }
}
</script>

<style lang="less" scoped>
.swaggerPicker{
    .apiModules{
        display: flex;
        flex-wrap: wrap;
        max-height: 160px;
        overflow:auto;
        .apiModule{
            margin-right: 20px;
            margin-bottom: 12px;
            /deep/ .el-radio__label{
                font-size: 18px;
            }
        }
    }
    .action{
        margin-top: 40px;
        text-align: center;
    }
    .configTable{
       .method{
         color: #fff;
         width: 50px;
         display: block;
         height: 26px;
         &.get{
            background-color: #0f6ab4;
         }
         &.put{
            background-color: #c5862b;
         }
         &.post{
            background-color: #10a54a;
         }
         &.delete{
            background-color: #a41e22;
         }
       }
       .name{
        &.get{
           color: #0f6ab4;
         }
         &.put{
            color: #c5862b;
         }
         &.post{
            color: #10a54a;
         }
         &.delete{
            color: #a41e22;
         }
       }
    }
}
</style>
