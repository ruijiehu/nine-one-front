<template>
  <div class="page-attr">
    <div class="fillAccess">
      <el-radio-group v-model="fillAccess" class="fillAccessGroup">
        <el-radio :label="1">swagger填充</el-radio>
        <el-radio :label="2">手动填充</el-radio>
      </el-radio-group>
      <el-input  placeholder="服务器地址" v-model="pageAttr.serverUrl"/>
    </div>
    <el-button @click="showDialog=true" type="primary" v-if="fillAccess === 1" class="fillSwaggerBtn">选择模块</el-button>
    <template >
      <div class="pageattrName">
        <el-input placeholder="请输入页面中文名" v-model="pageAttr.pageName">
        </el-input>
        <el-input placeholder="请输入页面英文名" v-model="pageAttr.pageNameEn">
        </el-input>
      </div>
      <div class="line">
        <div class="txt">列表</div>
        <el-input placeholder="请输入列表接口地址" v-model="pageAttr.getMethod" />
        <el-select
          v-model="pageAttr.getMethodType"
          class="select"
          placeholder="类型"
        >
          <el-option
            v-for="(item, index) in methodList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="line">
        <div class="txt">详情</div>
        <el-input placeholder="请输入详情接口地址" v-model="pageAttr.detailMethod" />
        <el-select
          v-model="pageAttr.detailMethodType"
          class="select"
          placeholder="类型"
        >
          <el-option
            v-for="(item, index) in methodList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="line">
        <div class="txt">新增</div>
        <el-input placeholder="请输入新增接口地址" v-model="pageAttr.postMethod" />
        <el-select
          v-model="pageAttr.postMethodType"
          class="select"
          placeholder="类型"
        >
          <el-option
            v-for="(item, index) in methodList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="line">
        <div class="txt">编辑</div>
        <el-input placeholder="请输入编辑接口地址" v-model="pageAttr.putMethod" />
        <el-select
          v-model="pageAttr.putMethodType"
          class="select"
          placeholder="类型"
        >
          <el-option
            v-for="(item, index) in methodList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="line">
        <div class="txt">删除</div>
        <el-input placeholder="请输入删除接口地址" v-model="pageAttr.deleteMethod" />
        <el-select
          v-model="pageAttr.deleteMethodType"
          class="select"
          placeholder="类型"
        >
          <el-option
            v-for="(item, index) in methodList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </template>
    <open-dialog width="1400px" title="填充swagger接口" :isShow="showDialog" @on-close="showDialog=false" class="swaggerDialog">
      <swagger-pciker @close="showDialog=false"></swagger-pciker>
    </open-dialog>
  </div>
</template>
<script>
import OpenDialog from '@/components/open-dialog'
import SwaggerPicker from './swagger-pciker.vue'
export default {
  computed: {
    pageAttr: {
      get() {
        return this.$store.state.currentConfig.pageAttr
      },
      set(val) {
        this.$store.commit('currentConfig/setPageAttr', val)
      }
    },
    // 已经填充了swagger接口
    swaggerFilled() {
      return this.pageAttr.pageName && this.pageAttr.pageNameEn
    }
  },
  components: {
    'open-dialog': OpenDialog,
    'swagger-pciker': SwaggerPicker
  },
  data() {
    return {
      // 当前的接口填充方式
      fillAccess: 1,
      // 填充对象
      apiOrm: {
      },
      //
      showDialog: false,
      methodList: [
        {
          value: 'get',
          label: 'get'
        },
        {
          value: 'post',
          label: 'post'
        },
        {
          value: 'delete',
          label: 'delete'
        },
        {
          value: 'put',
          label: 'put'
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.line{
  display: flex;
  align-items: center;
  .txt{
    width: 80px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    background: #F5F7FA;
    border: 1px solid #DCDFE6;
    color: #909399;
    border-radius: 4px 0 0 4px;
  }
  .select{
    width: 160px;
  }
  /deep/.el-input__inner{
    border-radius: 0 !important;
  }
}
.page-attr {
  padding: 20px 10px;
  box-sizing: border-box;
  .fillAccessGroup{
    width:100%;
    /deep/ label{
      margin-right:30px;
    }
  }
  .fillSwaggerBtn {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .pageattrName {
    display: flex;
  }
  label {
    display: inline-block;
    margin: 10px 0;
    color: #606266;
  }
  /deep/ .el-input {
    margin: 5px 0;
  }
  .swaggerDialog{
    /deep/ .model-content{
      max-height: 900px !important;
      overflow: hidden;
    }
  }
}
</style>
