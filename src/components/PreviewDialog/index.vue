<template>
  <el-dialog
    :visible.sync="visible"
    destroy-on-close
    width="80%"
    min-width="500px"
  >
    <div slot="title" style="display:flex;align-items:center">
      <span> 页面预览 </span>
      <el-form inline style="display:inline-block;margin-left:30px">
        <el-form-item label="模拟接口" style="display:flex;align-items:center;margin-bottom:0">
          <el-switch v-model="mock" @change="refresh" />
        </el-form-item>
      </el-form>
    </div>
    <div id="preview" style="height: 200px"></div>
    <!-- <component :is="previewComponent" /> -->
  </el-dialog>
</template>
<script>
import { previewInitComponent } from './preview'
import { Dialog } from 'element-ui'
// import Vue from 'vue'
// import { parseComponent, compileToFunctions } from 'vue-template-compiler'

export default {
  name: 'PreviewDialog',
  components: { [Dialog.name]: Dialog },
  data() {
    return {
      visible: false,
      resetGlobal: () => {},
      previewComponent: null,
      mock: false,
      data: null
    }
  },
  watch: {
    visible(val) {
      if (!val) this.resetGlobal()
    }
  },
  methods: {
    show(data) {
      this.visible = true
      this.data = data
      // let sfc = parseComponent(str);
      // let sfcf = compileToFunctions(str);
      // const { render, staticRenderFns } = sfcf;

      // console.log(sfcf, sfc);
      // this.previewComponent = Vue.extend({
      //   name: sfc.script ? sfc.script.id : "Test",
      //   render,
      //   staticRenderFns,
      //   ...(sfc.script && sfc.script.content.default),
      // });
      setTimeout(() => {
        if (data) {
          this.resetGlobal = previewInitComponent(data, { mock: this.mock })
        }
      }, 200)
    },
    refresh() {
      previewInitComponent(this.data, { mock: this.mock })
    }
  }
}
</script>
