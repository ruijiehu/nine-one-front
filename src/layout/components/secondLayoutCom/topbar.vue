<template>
  <div class="TopBarBox" ref="TopNavBox">
    <el-menu class="TopBar" :default-active="activeMenu" mode="horizontal" @select="handleSelect"
             background-color="#EAECF7" :unique-opened="true" :collapse-transition="false" :text-color="sideTheme === 'theme-dark'
               ? variables.menuColor
               : variables.menuLightColor
             " :active-text-color="sideTheme === 'theme-dark'
               ? variables.menuColor
               : variables.menuLightColor
             " :class="[
               sideTheme === 'theme-dark' ? 'theme-dark-class' : 'theme-light-class',
               navType === 'left' ? 'leftNavClass' : 'topNavClass',
             ]">
      <template v-for="(route, index) in sidebarRouters">
        <bar-item v-if="index < visibleNumber" :key="route.path + index" :item="route" :base-path="route.path"
                  :activeMenu="activeMenu" />
      </template>

      <el-submenu :style="{ '--theme': theme }" index="more" v-if="sidebarRouters.length > visibleNumber">
        <template slot="title">更多菜单</template>
        <template v-for="(item, index) in sidebarRouters">
          <el-menu-item :index="item.path" :key="index" v-if="index >= visibleNumber">
            <svg-icon :icon-class="item.meta.icon" />
            {{ item.meta.menuName }}</el-menu-item>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { constantRoutes } from '@/router'
import variables from '@/assets/styles/variables.scss'
import BarItem from './BarItem-second.vue'

// 隐藏侧边栏路由
// const hideList = ['/index', '/user/profile']

export default {
  data() {
    return {
      // 顶部栏初始数
      visibleNumber: 5,
      // 当前激活菜单的 index
      currentIndex: undefined,
      isMore: false // 是否展开
    }
  },
  components: {
    BarItem
  },
  computed: {
    // ...mapGetters(["sidebarRouters", "sidebar"]),
    navType() {
      return this.$store.state.settings.navType
    },
    sidebarRouters() {
      return this.$store.state.permission.sidebarRouters
    },
    theme() {
      return this.$store.state.settings.theme
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme
    },
    // 顶部显示菜单
    topMenus() {
      const topMenus = []
      this.routers.map((menu) => {
        if (menu.hidden !== true) {
          // 兼容顶部栏一级菜单内部跳转
          if (menu.path === '/') {
            topMenus.push(menu.children[0])
          } else {
            topMenus.push(menu)
          }
        }
      })
      return topMenus
    },
    // 所有的路由信息
    routers() {
      return this.$store.state.permission.routes
    },
    // 设置子路由
    childrenMenus() {
      var childrenMenus = []
      this.routers.map((router) => {
        for (var item in router.children) {
          if (router.children[item].parentPath === undefined) {
            if (router.path === '/') {
              router.children[item].path = '/' + router.children[item].path
            } else {
              if (!this.ishttp(router.children[item].path)) {
                router.children[item].path =
                  router.path + '/' + router.children[item].path
              }
            }
            router.children[item].parentPath = router.path
          }
          childrenMenus.push(router.children[item])
        }
      })
      return constantRoutes.concat(childrenMenus)
    },
    // 默认激活的菜单
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      if (path.split('/').length > 3) {
        return `/${path.split('/')[0]}/${path.split('/')[1]}`
      }
      if (!this.$route.children) {
        this.$store.commit(
          'SET_THIRD_ROUTERS',
          null
        )
      }
      return path
    },
    variables() {
      return variables
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.setVisibleNumber)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setVisibleNumber)
  },
  mounted() {
    this.setVisibleNumber()
  },
  methods: {
    // 根据宽度计算设置显示栏数
    setVisibleNumber() {
      const width = document.body.getBoundingClientRect().width * 0.9
      this.visibleNumber = parseInt(width / 85)
    },
    // 菜单选择事件
    handleSelect(key) {
      this.currentIndex = key
      const route = this.routers.find((item) => item.path === key)
      const routeChildren = this.sidebarRouters.find((item) => item.path === key)
      if (this.ishttp(key)) {
        // http(s):// 路径新窗口打开
        window.open(key, '_blank')
      } else if ((!route || !route.children) && !routeChildren.children) {
        // 没有子路由路径内部打开
        this.$router.push({ path: key })
        this.$store.dispatch('app/toggleSideBarHide', true)
      } else {
        // 显示左侧联动菜单
        this.activeRoutes(key)
        this.$store.dispatch('app/toggleSideBarHide', false)
      }
    },
    // 当前激活的路由
    activeRoutes(key) {
      var routes = []
      if (this.childrenMenus && this.childrenMenus.length > 0) {
        this.childrenMenus.map((item) => {
          if (key == item.parentPath || (key == 'index' && item.path == '')) {
            routes.push(item)
          }
        })
      }
      //   if (routes.length > 0) {
      //     this.$store.commit("SET_SIDEBAR_ROUTERS", routes);
      //   }
    },
    ishttp(url) {
      return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
    }
  }
}
</script>

<style lang="less" scoped >
.el-menu.el-menu--horizontal {
  border-bottom: none !important;
  // height: 40px;
}

/deep/.el-menu--horizontal>.el-menu-item {
  float: left;
  height: 40px !important;
  line-height: 40px !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
  font-size: 16px;
}

.el-menu--horizontal>.el-menu-item.is-active,
.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
  background: rgba(0, 0, 0, 0.2) !important;
  color: #303133;
  border-bottom: none !important;
  height: 40px !important;
  line-height: 40px !important;
}

/* submenu item */
.el-menu--horizontal>.el-submenu .el-submenu__title {
  float: left;
  height: 40px !important;
  line-height: 40px !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}

.TopBarBox {
  width: 96%;
  height: 57px;
  background: #eaecf7;
  border-radius: 10px 10px 0px 0px;
  display: flex;
  padding: 0 30px;
  margin: 0 2%;

  .more {
    cursor: pointer;
    width: 88px;
    line-height: 70px;
  }

  .el-submenu__title {
    height: 40px !important;
    line-height: 40px !important;
  }
}

.TopBar {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
}
</style>
