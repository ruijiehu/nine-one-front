<template>
  <div @click.stop="clickLabel" class="select-depart" :style="{ maxWidth: maxWidth + 'px' }">
    <div class="select-depart-inner">
      <span :style="{ maxWidth: maxWidth - 2 - 12 + 'px' }" class="childs-label childs" :title="departShowLabel">
        {{ departShowLabel }}
      </span>
      <span title="清楚选择的项目" class="childs clear-icon" @click.stop="clickClear" v-if="false">
        <a-icon type="close" />
      </span>
    </div>

    <div class="choose-tabs" v-if="showModal" @click.stop="clickTabs">
      <div class="label0">
        <span
          v-for="(item, index) in tempLabelArr"
          :key="index"
          @click="clickBackItem(item, index)"
          class="label0-item"
        >
          {{ item.departName }}
          <template v-if="tempLabelArr.length !== index + 1"> / </template>
        </span>
      </div>
      <div class="label1">
        <span v-for="(item, index) in childsArr" :key="index" class="label1-item" @click="getChooseItem(item, false)">
          {{ item.departName }}
        </span>
        <span v-if="(childsArr && childsArr.length === 0) || !childsArr" class="label1-nodata"> 暂无数据 </span>
      </div>
      <div class="label2">
        <span class="label2-qx" @click="clickCancel">取消</span>
        <span class="label2-qd" @click="clickConfirm">确定</span>
      </div>
    </div>
  </div>
</template>
<script>
import { queryDepartTreeList, queryMyDepartTreeList } from '@/api/api'
function getPathByKey(value, key, arr) {
  const temppath = []
  try {
    var getNodePath = (node) => {
      // 这里可以自定义push的内容，而不是整个node,而且这里node也包含了children
      temppath.push(node)
      // 找到符合条件的节点，通过throw终止掉递归
      if (node[key] === value) {
        // eslint-disable-next-line no-throw-literal
        throw 'GOT IT!'
      }
      if (node.children && node.children.length > 0) {
        for (var i = 0; i < node.children.length; i++) {
          getNodePath(node.children[i])
        }

        // 当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
        temppath.pop()
      } else {
        // 找到叶子节点时，删除路径当中的该叶子节点
        temppath.pop()
      }
    }
    for (let i = 0; i < arr.length; i++) {
      getNodePath(arr[i])
    }
  } catch (e) {
    return temppath
  }
}
export default {
  props: {
    isAuth: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: Number,
      default: 267,
    },
  },
  computed: {
    departShowLabel() {
      return this.allLabelArr.map((i) => i.departName).join(' / ')
    },
  },
  data() {
    return {
      defaultDepartOrder: 2, // 嘉兴=2，南湖=3，街镇=4
      allLabelArr: [],
      tempLabelArr: [],
      defaultItem: {},
      departLabel: '嘉兴市',
      departOrder: 1,
      showModal: false,
      departTree: [],
      childsArr: [],
      activeOrgCode: '',
    }
  },
  watch: {
    showModal: {
      immediate: true,
      handler(nv) {
        if (nv) {
          this.tempLabelArr = _.cloneDeep(this.allLabelArr)
          this.childsArr = this.tempLabelArr[this.tempLabelArr.length - 1].children
        }
      },
    },
  },
  methods: {
    setOrgCode(value) {
      this.activeOrgCode = value
      const handleCurrentPath = () => {
        const temppath = getPathByKey(value, 'orgCode', _.cloneDeep(this.departTree))
        this.tempLabelArr = _.cloneDeep(temppath)
        this.allLabelArr = _.cloneDeep(temppath)
        this.childsArr = this.tempLabelArr[this.tempLabelArr.length - 1].children
      }
      if (this.departTree.length > 0) {
        handleCurrentPath()
      } else {
        const unwatch = this.$watch(
          'departTree',
          (nv, ov) => {
            if (nv && nv.length > 0) {
              handleCurrentPath()
              unwatch()
            }
          },
          { deep: true }
        )
      }
    },
    clickConfirm() {
      this.allLabelArr = _.cloneDeep(this.tempLabelArr)
      this.activeOrgCode = this.allLabelArr[this.allLabelArr.length - 1]['orgCode']
      console.log('click')
      this.$emit('changeDept', this.activeOrgCode)
      this.showModal = false
    },
    clickCancel() {
      this.showModal = false
    },
    clickTabs() {},
    clickLabel() {
      this.showModal = !this.showModal
    },
    init() {
      let api
      if (this.isAuth) {
        api = queryMyDepartTreeList
      } else {
        api = queryDepartTreeList
      }
      api().then((res) => {
        if (res.success) {
          this.departTree = res.result
          this.defaultDepartOrder = this.departTree[0].departOrder

          this.defaultItem = _.cloneDeep(this.departTree[0])

          this.activeOrgCode = this.departTree[0].orgCode

          this.getChooseItem(this.defaultItem, true)
          console.log('api')
          // this.$emit('changeDept',this.activeOrgCode)
        }
      })
    },
    clickClear() {
      const arr = _.cloneDeep(this.allLabelArr)
      this.getChooseItem(arr[0], true)
    },
    clickBackItem(item, index) {
      const arr = _.cloneDeep(this.tempLabelArr)
      let i = 0
      while (index >= i) {
        this.getChooseItem(arr[i], false)
        i++
      }
    },
    getChooseItem(item, isReal) {
      if (item.departOrder > 4) {
        return
      }
      if (item.departOrder === this.defaultDepartOrder) {
        this.tempLabelArr = [item]
      } else {
        this.tempLabelArr.push(item)
      }
      if (isReal) {
        this.allLabelArr = _.cloneDeep(this.tempLabelArr)
      }

      this.departLabel = item.departName
      this.departOrder = item.departOrder
      this.childsArr = item.children || []
    },
  },
  created() {
    this.init()
  },
}
</script>
<style lang="less" scoped>
.select-depart {
  width: 267px;
  display: inline-block;
  padding: 0px 0px;
  // background-color: #fff;
  height: 40px;
  color: rgba(0, 0, 0, 0.65);
  position: relative;
  margin-top: -2px;
  box-sizing: border-box;
  padding-top: 7px;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 14px;
  .select-depart-inner {
    border: 1px solid #d9d9d9;
    display: flex;
    border-radius: 4px;
    justify-content: flex-start;
    align-items: center;
    height: 32px;
    padding: 0 5px;
    // border: 1px solid #ccc;
    // border-radius: 4px;
    .childs {
      display: inline-block;
      height: 40px;
      line-height: 40px;
    }
    .childs-label {
      // font-family: 'Segoe UI Symbol';
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      // margin-left: 12px;
    }
    .clear-icon {
      margin-left: 6px;
      margin-right: 10px;
      display: inline-block;
      height: 40px;
      width: 15px;
    }
    // &:hover{
    //   color: #333;
    //   background-color: #e0e0e0;
    //   border: 1px solid #aaa;
    // }
  }

  .choose-tabs {
    width: 450px;
    min-height: 235px;
    background-color: #fff;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #dcdfe6;
    z-index: 2013;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    top: 48px;
    left: -80px;
    position: absolute;
    display: flex;
    flex-direction: column;

    .label0 {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      box-sizing: border-box;
      border-bottom: 1px solid #e8eaec;
      box-sizing: border-box;
      padding: 0 24px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow-x: auto;
      overflow-y: hidden;
      .label0-item {
        display: inline-block;
        height: 50px;
        margin: 0 2px;
        line-height: 50px;
        cursor: pointer;
      }
    }
    .label1 {
      width: 100%;
      height: 135px;
      box-sizing: border-box;
      padding: 0 12px;
      overflow: auto;
      .label1-item {
        display: inline-block;
        height: 45px;
        margin: 0 12px;
        line-height: 45px;
        cursor: pointer;
      }
      .label1-nodata {
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #aaa;
      }
    }
    .label2 {
      width: 100%;
      height: 50px;
      border-top: 1px solid #e8eaec;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .label2-qx {
        width: 56px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        cursor: pointer;
        background-color: #909399;
        border-radius: 3px;
        font-size: 12px;
      }
      .label2-qd {
        width: 56px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        cursor: pointer;
        background-color: #409eff;
        border-radius: 3px;
        margin-left: 15px;
        margin-right: 15px;
        font-size: 12px;
      }
    }
  }
}
</style>