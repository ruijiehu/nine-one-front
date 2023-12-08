<template>
  <div v-if="!item.hidden">
    <!-- &&      (!onlyOneChild.children || onlyOneChild.noShowingChildren)  -->
    <template v-if="hasOneShowingChild(item.children, item) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <el-menu-item class="item-menu" :index="resolvePath(onlyOneChild.path)"
                      :class="{ 'submenu-title-noDropdown': !isNest }" @click="getRoutes(onlyOneChild)">
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.menuName" />
        </el-menu-item>
      </app-link>
    </template>
    <template v-if="!hasOneShowingChild(item.children, item) && !item.alwaysShow">
      <el-menu-item class="item-menu"
                    :class="[$route.path.indexOf(resolvePath(onlyOneChild.path)) > -1 ? 'is-active' : '']"
                    :index="resolvePath(onlyOneChild.path)" @click="getRoutes(onlyOneChild)">
        <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.menuName" />
      </el-menu-item>
    </template>
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
    },
    activeMenu: {
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

      // // When there is only one child router, the child router is displayed by default
      // if (showingChildren.length === 1) {
      //   return true
      // }

      // // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true, children: [] }
        return true
      } else {
        this.onlyOneChild = { ...parent, noShowingChildren: true, children: children }
        if (this.$route.path.indexOf(parent.path) > -1) {
          this.getRoutes(this.onlyOneChild)
        }
        return false
      }
      // return false
    },
    getRoutes(r) {
      if (r.children.length) {
        this.$store.commit(
          'SET_THIRD_ROUTERS',
          r
        )
      } else {
        this.$store.commit(
          'SET_THIRD_ROUTERS',
          null
        )
      }
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
.is-active {
    color: #fff !important;
    background: rgba(0, 0, 0, 0.2) !important;

    span {
        color: #fff !important;
        // color: var(--theme) !important;
    }

    .svg-icon {
        fill: #fff !important;
    }

    .item_title {
        line-height: 35px;
    }

    ::v-deep .el-submenu__title i {
        color: var(--theme) !important;
    }
}
</style>
<style lang="less" scoped>
.item_title {
    height: 40px;
    line-height: 40px;
}

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
}

.item-menu {
    // margin: 0 12px;
    font-size: 16px;
    height: 40px !important;
    line-height: 40px !important;
    border-radius: 8px 8px 0px 0px;
    border: 1px solid #ccc;
    margin-right: 9px;
    color: #999 !important;

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

