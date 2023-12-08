<template>
  <div
    class="TopNavBox"
    ref="TopNavBox"
    :style="{ height: isMore ? 'auto' : '70px' }"
  >
    <el-menu
      class="TopNav"
      :default-active="activeMenu"
      mode="horizontal"
      @select="handleSelect"
      :background-color="theme"
      :unique-opened="true"
      :collapse-transition="false"
      :text-color="
        sideTheme === 'theme-dark'
          ? variables.menuColor
          : variables.menuLightColor
      "
      :active-text-color="
        sideTheme === 'theme-dark'
          ? variables.menuColor
          : variables.menuLightColor
      "
    >
      <template v-for="(item, index) in topMenus">
        <el-menu-item
          :style="{ '--theme': theme }"
          :index="item.path"
          :key="index"
        >
          <!-- v-if="index < visibleNumber" -->
          <svg-icon :icon-class="item.meta.icon" />
          {{ item.meta.menuName }}
        </el-menu-item>
      </template>
      <!-- 顶部菜单超出数量折叠 -->
      <!-- <el-submenu
      :style="{ '--theme': theme }"
      index="more"
      v-if="topMenus.length > visibleNumber"
    >
      <template slot="title">更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item
          :index="item.path"
          :key="index"
          v-if="index >= visibleNumber"
          ><svg-icon :icon-class="item.meta.icon" />
          {{ item.meta.title }}</el-menu-item
        >
      </template>
    </el-submenu> -->
    </el-menu>
    <div
      class="more"
      @click="isMore = true"
      :style="{
        color:
          sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor,
      }"
      v-if="topMenus.length > visibleNumber && !isMore"
    >
      更多<i class="el-icon-arrow-down"></i>
    </div>
    <div
      class="more"
      @click="isMore = false"
      :style="{
        color:
          sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor,
      }"
      v-if="topMenus.length > visibleNumber && isMore"
    >
      收起<i class="el-icon-arrow-up"></i>
    </div>
  </div>
</template>

<script>
import { constantRoutes } from '@/router'
import variables from '@/assets/styles/variables.scss'

// 隐藏侧边栏路由
const hideList = ['/index', '/user/profile']

export default {
  data() {
    return {
      // 顶部栏初始数
      visibleNumber: 5,
      // 当前激活菜单的 index
      currentIndex: undefined,
      isMore: false, // 是否展开
      defaultPath: ''// 点击一级导航默认路由
    }
  },
  computed: {
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
      return this.$store.state.permission.topbarRouters
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
      const path = this.$route.path
      let activePath = path
      if (
        path !== undefined &&
        path.lastIndexOf('/') > 0 &&
        hideList.indexOf(path) === -1
      ) {
        const tmpPath = path.substring(1, path.length)
        activePath = '/' + tmpPath.substring(0, tmpPath.indexOf('/'))
        this.$store.dispatch('app/toggleSideBarHide', false)
      } else if (!this.$route.children) {
        activePath = path
        this.$store.dispatch('app/toggleSideBarHide', true)
      }
      this.activeRoutes(activePath)
      return activePath
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
      const width = document.body.getBoundingClientRect().width / 3
      this.visibleNumber = parseInt(width / 85)
    },
    // 菜单选择事件
    handleSelect(key) {
      this.currentIndex = key
      const route = this.routers.find((item) => item.path === key)
      if (this.ishttp(key)) {
        // http(s):// 路径新窗口打开
        window.open(key, '_blank')
      } else if (!route || !route.children) {
        // 没有子路由路径内部打开
        this.$router.push({ path: key })
        this.$nextTick(() => {
          this.$store.dispatch('app/toggleSideBarHide', true)
        })
      } else {
        // 显示左侧联动菜单
        this.$nextTick(() => {
          this.activeRoutes(key)
          this.$store.dispatch('app/toggleSideBarHide', false)
          this.$router.push({ path: this.defaultPath })
        })
      }
    },
    // 设置找不到页面跳转有权限第一页
    getdefaultUrl(route, result = []) {
      for (let i = 0; i < route.length; i++) {
        if (!route[i].hidden) {
          result.push(route[i].path)
          if (route[i] && route[i].children) {
            this.getdefaultUrl(route[i].children, result)
          }
          break
        }
      }
      return result
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
      if (routes.length > 0) {
        this.$store.commit('SET_SIDEBAR_ROUTERS', routes)
      }
      this.defaultPath = this.getdefaultUrl(routes, [])[0]
    },
    ishttp(url) {
      return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu.el-menu--horizontal {
  border-bottom: none !important;
  // height: 70px;
}
.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 70px !important;
  line-height: 70px !important;
  padding: 0 10px !important;
  // margin: 0 10px !important;
  font-size: 16px;
  // background: var(--theme) !important ;
}
.el-menu--horizontal > .el-menu-item:hover{
  background:rgba(0, 0, 0, 0.1) !important ;
}

.el-menu--horizontal > .el-menu-item.is-active,
.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  // border-bottom: 2px solid #{"var(--theme)"} !important;
  color: #303133;
  border-bottom: none !important;
  height: 100%;
}

/* submenu item */
.el-menu--horizontal > .el-submenu .el-submenu__title {
  float: left;
  height: 70px !important;
  line-height: 70px !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}
.TopNavBox {
  display: flex;
  .more {
    cursor: pointer;
    width: 88px;
    line-height: 70px;
  }
}
.TopNav {
  display: flex;
  flex-wrap: wrap;
  .is-active {
    background: rgba(0, 0, 0, 0.2) !important;
  }
}
</style>
