<template>
  <el-card style="position: relative">
    <el-tabs value="1">
      <el-tab-pane label="未完结" name="1"></el-tab-pane>
      <el-tab-pane name="2" label="已完结"></el-tab-pane>
    </el-tabs>
    <ProTable :config="config" :card="false">
      <!-- <template slot="header" slot-scope="text, record">
        1
        <span>{{ text }}</span>
      </template> -->
    </ProTable>
  </el-card>
</template>

<script>
import ProTable from '@/components/ProTable'
import FileUpload from '@/components/FileUpload'
const required = { required: true, message: '请填写' }
export default {
  components: {
    ProTable
  },
  data() {
    return {
      config: {},
      visible: false,
      activeData: {},
      status: 'dealing'
    }
  },

  created() {
    const config = {
      labelWidth: '100px',
      actionColumn: { width: 400 },
      spreadTableAction: true,
      actions: {
        create: {
          btnText: '我要上架',
          api: '/create'

        },
        delete: '/delete',
        list: (
          queryParam // axios.get('/elements/list', { params: queryParam }),
        ) =>
          new Promise((resolve, reject) =>
            resolve({
              result: { records: [{ appId: 1 }, { appId: 2 }], total: 2 },
              success: true
            })
          ), // '/interllectual/elementPublic/list',

        pick: {
          btnText: '拾取',
          callback: (record) => { record.appId = 5 }
        },
        deal: {
          btnText: '处理',
          callback: (record) => {
            this.visible = true
            this.activeData = record
            this.status = 'dealing'
          }
        }
      },
      fields: [
        {

          subtitle: '标题一',
          prop: 'appId',
          label: '申请单号',
          edit: false,
          formType: 'richText',
          list: true,
          search: false,
          rules: [required],
          column: {
            scopedSlots: {
              customRender: 'header'
            }
          }
        },
        {
          span: 12,
          prop: 'title',
          label: '申请标题',
          formType: 'select',
          dictCode: 'sys_region',
          component: FileUpload,
          list: true,
          search: true,
          rules: [required]
        },
        {
          span: 12,
          prop: 'elementType',
          tableProp: 'elementType_dictText',
          label: '类型',
          formType: 'select',
          list: true,
          search: true,
          dictCode: 'elements_type'
        },
        {
          prop: 'createTime',
          label: '发起时间',
          list: true,
          form: false
        },
        {
          prop: 'supportExp_dictText',
          label: '申请状态',
          formType: 'select',
          search: true,
          list: true,
          dictCode: 'onoff'
        },
        {
          subtitle: '标题er',
          prop: '$开始时间',
          label: '输入开始时间',
          formType: 'datetime',
          search: true
        },
        {
          prop: '$结束时间',
          label: '输入结束时间',
          formType: 'datetime',
          search: true
        }
      ]
    }

    this.config = config
  },
  methods: {}
}
</script>

<style>
</style>
