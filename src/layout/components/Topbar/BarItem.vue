<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.alwaysShow
      "
    >
      <app-link
        v-if="onlyOneChild.meta"
        :to="resolvePath(onlyOneChild.path, onlyOneChild.query)"
      >
        <el-menu-item
          class="item-menu"
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.menuName"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu
      v-else
      class="item-submenu"
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.menuName"
        />
      </template>
      <bar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="bar-menu"
        :style="{ '--theme': theme }"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from '../Sidebar/Item'
import AppLink from '../Sidebar/Link'
import FixiOSBug from '../Sidebar/FixiOSBug'

export default {
  name: 'BarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null
    return {
      theme: this.$store.state.settings.theme
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      if (!children) {
        children = []
      }
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath, routeQuery) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      if (routeQuery) {
        const query = JSON.parse(routeQuery)
        return { path: path.resolve(this.basePath, routePath), query: query }
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style lang="scss" scoped>
.bar-menu {
  .router-link-active {
    .el-menu-item {
      color: var(--theme) !important;
    }
  }
  .is-active {
    color: #fff !important;
    span {
      color: var(--theme) !important;
    }
    .svg-icon {
      fill: var(--theme) !important;
    }
    ::v-deep .el-submenu__title i {
      color: var(--theme) !important;
    }
  }
  .el-submenu__title:hover {
    color: var(--theme) !important;
  }
  .item-menu:hover {
    background-color: var(--theme) !important;
    color: #fff !important;
  }
  .item-submenu:hover {
    background-color: var(--theme) !important;
    color: #fff !important;
    span {
      color: #fff !important;
    }
    .svg-icon {
      fill: #fff !important;
    }
    .el-submenu__icon-arrow {
      color: #fff !important;
    }
  }
}
</style>
  <style lang="less" scoped>
.bar-menu {
  background-color: #fff !important;
  .item-menu {
    height: 32px !important;
    line-height: 32px !important;
    border-radius: 4px;
    font-size: 16px;
    svg {
      margin-right: 8px;
    }
  }
  /deep/.el-menu-item {
    background-color: #fff !important;
    color: #999 !important;
  }
  .item-submenu {
    height: 32px !important;
    line-height: 32px !important;
    font-size: 16px;
    /deep/.el-submenu__title {
      height: 32px !important;
      line-height: 32px !important;
      background-color: #c2bbef00 !important;
      color: #999 !important;
      font-size: 16px;
      svg {
        margin-right: 8px;
      }
    }
    /deep/.el-submenu__icon-arrow {
      right: 8px;
      margin-top: -4px;
    }
  }
}
.item-submenu {
  // margin: 0 12px;
  height: 70px !important;
  line-height: 70px !important;
  // border-radius: 4px;
  /deep/.el-submenu__title {
    height: 70px !important;
    line-height: 70px !important;
    font-size: 16px;
    svg {
      margin-right: 13px;
    }
  }
  /deep/.el-submenu__icon-arrow {
    right: 12px;
    margin-top: -4px;
  }
}
.item-submenu:hover {
  /deep/.el-submenu__icon-arrow {
    color: #fff !important;
  }
}
.item-menu {
  // margin: 0 12px;
  font-size: 16px;
  height: 70px !important;
  line-height: 70px !important;
  svg {
    margin-right: 13px;
  }
}
/deep/.el-submenu__title {
  padding: 0 24px 0 12px !important;
}
/deep/.el-menu-item {
  padding: 0 12px !important;
}
/deep/.el-menu-item:hover {
  background-color: rgba(0, 0, 0, 0.1) !important;
  span {
    color: #fff !important;
  }
  .svg-icon {
    fill: #fff !important;
  }
}
/deep/.item-submenu:hover {
  background-color: rgba(0, 0, 0, 0.1) !important;
  span {
    color: #fff !important;
  }
  .svg-icon {
    fill: #fff !important;
  }
}
/deep/.el-submenu__title:hover {
  background-color: #72ddc200 !important;
  span {
    color: #fff !important;
  }
  .svg-icon {
    fill: #fff !important;
  }
  /deep/.el-submenu__icon-arrow {
    color: red;
  }
}
</style>

