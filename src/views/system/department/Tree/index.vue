<template>
  <div class="xh_tree" v-loading="loading">
    <div class="xh_tree_head">
      <el-input :placeholder="searchHolder" v-model="filterText" class="xh_tree_input"></el-input>
      <!-- <el-button type="primary">搜索</el-button> -->
      <el-button type="primary" @click="newDepart('all')" v-hasPermi="['system:dept:add']">新增部门</el-button>

    </div>
    <!-- 树标题，可通过 title 的传值显示隐藏 -->
    <div class="xh_tree_root"  v-if="setDraggable">
      <span class="xh_text_s">{{ title }}</span>
      <!-- <i :class="`el-icon-arrow-${isExpand ? 'down' : 'up'}`"></i> -->
    </div>
    <!-- 树本体 -->
    <transition name="fade">
      <el-tree
        highlight-current
        :node-key="mergeProps.nodeKey"
        :data="data"
        :props="mergeProps"
        :show-checkbox="showCheckbox"
        default-expand-all
        :filter-node-method="filterNode"
        :ref="uuid"
        v-show="isExpand"
        @node-click="nodeClick"
        :default-expanded-keys="defaultExpandedKeys"
        :expand-on-click-node="false"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        :draggable="setDraggable"
      >
        <span
          class="custom_tree_node"
          slot-scope="{ node, data }"
          :style="{
            width: 380 - data[mergeProps.level] * 20 + 'px',
          }"
        >
          <div class="custom_tree_node_label custom_tree_node_has_tag">
            <!-- 文字过多溢出时进行文字提示 -->
            <el-tooltip
              :content="data[mergeProps.label]"
              :placement="showCheckbox ? 'right' : 'left'"
              effect="dark"
              :disabled="isOverflow(data[mergeProps.nodeKey])"
            >
              <span
                :id="data[mergeProps.nodeKey]"
                class="custom_tree_node_title"
                :class="[
                  checkedNodeId === data[mergeProps.nodeKey]
                    ? 'custom_tree_node_checked'
                    : '',
                ]"
              >{{ data[mergeProps.label] }}</span>
            </el-tooltip>
          </div>
          <div class="hover_show ">

            <!-- <span class="xh_tag_solid" @click="newDepart('kid',data)">添加子菜单</span>
            <span class="xh_tag_solid" @click="delDepart">删除</span>
            <span class="xh_tag_solid">移动</span> -->
          </div>
        </span>
      </el-tree>
    </transition>
  </div>
</template>

<script>
import store from '@/store'
import {
  updateDeptSort,
  updateDeptParent
} from '@/api/system/department.js'
export default {
  props: {
    searchHolder: {
      type: String,
      default: '请输入关键词'
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '拖动可调节各节点顺序'
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => []
    },
    defaultExpandedKeys: {
      type: Array,
      default: () => []
    },
    currentNodeKey: {
      type: String,
      default: () => {
        return ''
      }
    },
    props: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      uuid: '',
      isExpand: true,
      filterText: '',
      checkedNodeId: '',
      deptId: '',
      deptNode: {},
      preDeptId: '',
      preDeptNode: {},
      setDraggable: true
    }
  },
  computed: {
    // 和默认值合并后的 props ，输入给 Tree 组件
    mergeProps() {
      const defaultProps = {
        // 标签 id
        nodeKey: 'uuid',
        // 子节点
        children: 'children',
        // 标签文本
        label: 'label',
        // 树的层级
        level: 'deptLevel'
      }
      return {
        ...defaultProps,
        ...this.props
      }
    }
  },
  watch: {
    currentNodeKey(val) {
      this.$nextTick(() => {
        this.$refs[this.uuid].setCurrentKey(val)
        // 返回当前选择的节点, 此 API 作用和功能待定
        const node = this.$refs[this.uuid].getCurrentNode()
        if (node) {
          this.checkedNodeId = node[this.mergeProps.nodeKey]
          this.$emit('getCurrNode', node)
        }
      })
    },
    filterText(val) {
      this.$refs[this.uuid].filter(val)
    },
    defaultCheckedKeys: {
      handler: function(val) {
        console.log(val)
        val.length > 0 && this.$refs[this.uuid].setCheckedKeys(val)
      },
      immediate: true
    }
  },
  created() {
    this.getUUID()
    console.log(this.data, '--------------')
  },
  methods: {
    getUUID() {
      let d = new Date().getTime()
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function(c) {
          const r = (d + Math.random() * 16) % 16 | 0
          d = Math.floor(d / 16)
          return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
        }
      )
      this.uuid = uuid
    },
    // 判断文字是否溢出
    isOverflow(id) {
      const v = document.getElementById(id)
      if (v && v.scrollWidth > v.clientWidth) {
        return false
      } else {
        return true
      }
    },
    // 树节点点击回调
    nodeClick(data) {
      this.checkedNodeId = data.id
      this.$emit('click', data)
    },

    onExpand() {
      this.isExpand = !this.isExpand
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.mergeProps.label].indexOf(value) !== -1
    },
    newDepart(val, data) {
      // event.stopPropagation()
      this.$emit('newDepart', val, data)
    },
    delDepart() {
      this.$emit('delDepart')
    },
    handleDragStart(node, ev) {
      this.deptId = node.data.uuid
      this.deptNode = node.data
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      // console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      // console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      this.preDeptId = dropNode.data.uuid
      this.preDeptNode = dropNode.data
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode, dropType)
      // if(dropType)
      // type为inner，则直接用结束节点的uuid为开始节点的parentid,调用修改上级部门接口
      // type为bofore或after，判断开始节点的parentid和结束的parentid，如果一致，说明只是替换了顺序，调用调整顺序接口，
      // 如果不一致，已结束的parentid为新的parentid，调用修改上级部门接口
      if (dropType === 'inner') {
        this.updateDeptParentFun({ uuid: this.deptId, parentId: dropNode.data.uuid })
      } else {
        const front = dropType === 'before' ? '1' : dropType === 'after' ? '0' : ''
        if (this.deptNode.parentId === this.preDeptNode.parentId) {
          this.updateDeptSortFun({ sourceDeptId: this.deptId, targetDeptId: dropNode.data.uuid, front: front })
        } else {
          this.updateDeptParentFun({ uuid: this.deptId, parentId: dropNode.data.uuid })
        }
      }
    },
    updateDeptParentFun(param) {
      updateDeptParent(param).then((res) => {
        if (res.status == 200) {
          console.log(res.data)
        }
        this.$parent.getTree()
        this.$message({
          message: Object.values(res.msgs)[0],
          type: 'info'
        })
      }).catch(() => {
        this.$parent.getTree()
      })
    },
    updateDeptSortFun(param) {
      updateDeptSort(param).then((res) => {
        if (res.status == 200) {
          console.log(res.data)
        }
        this.$parent.getTree()
        this.$message({
          message: Object.values(res.msgs)[0],
          type: 'info'
        })
      }).catch(() => {
        this.$parent.getTree()
      })
    }

  },
  mounted() {
    const draggstr = 'system:dept:drag'
    if (this.$store.getters.permissions.includes(draggstr)) {
      this.setDraggable = true
    } else {
      this.setDraggable = false
    }
  }
}
</script>

<style scoped lang="scss">
.xh_tree::-webkit-scrollbar {
  display: none;
}

.xh_tree {
  position: relative;
  overflow-y: auto;
  height: 100%;
  mask-repeat: no-repeat;
  mask-image: linear-gradient(#000 95%, transparent);
  .xh_tree_head {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    .xh_tree_input {
      width: 100%;
      position: sticky;
      top: 0;
      z-index: 2;
      margin-right: 10px;
    }
  }

  .xh_tree_root {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(73, 119, 252, 0.1);
    border-radius: 4px;
    padding: 12px 17px 10px 16px;
    margin-bottom: 14px;
    cursor: pointer;
    i {
      font-size: 14px;
    }
  }

  .custom_tree_node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    width: 100%;
    .custom_tree_node_has_tag {
      width: calc(100% - 150px) !important;
    }
    .custom_tree_node_label {
      display: flex;
      width: 100%;
      align-items: center;
      // width: calc(100% - 30px);
    }
    .custom_tree_node_pretag {
      margin-right: 5px;
      line-height: 20px;
      text-align: center;
      display: inline-block;
      font-size: 12px;

      color: #fff;
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
    .custom_tree_node_title {
      // 与左边 pretag 类保持距离
      width: calc(100% - 25px);
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .custom_tree_node_checked {
      color: #4977fc;
      position: relative;
    }
  }
  .xh_tag_solid {
    margin-right: 10px;
  }
  .hover_show{
    opacity: 0;
    position: absolute;
    right: 0;
    &:hover{
      opacity: 1;
    }
  }
}
</style>
