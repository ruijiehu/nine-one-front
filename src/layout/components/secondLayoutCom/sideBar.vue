<template>
  <div class="thirdNav" :style="{ backgroundColor: settings.theme }">
    <el-menu :default-active="activeMenu" :background-color="settings.theme"
             :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
             :unique-opened="true"
             :active-text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
             :collapse-transition="false" mode="vertical" :class="[
               settings.sideTheme === 'theme-dark'
                 ? 'theme-dark-class'
                 : 'theme-light-class',
               navType === 'left' ? 'leftNavClass' : 'topNavClass',
             ]" :style="{ '--theme': theme }" @select="handleSelect">
      <el-menu-item v-for="(route, index) in thirdRouters.children" :key="route.path + index"
                    :index="resolvePath(route.path)">
        <span slot="title">
          <div class="line" v-if="activeMenu === resolvePath(route.path)"
               :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor }">
          </div>
          {{ route.name }}
        </span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
// import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'

export default {
  // components: { SidebarItem },
  data() {
    return {
      theme: this.$store.state.settings.theme
    }
  },
  computed: {
    ...mapState(['settings']),
    ...mapGetters(['thirdRouters', 'sidebar']),
    navType() {
      return this.$store.state.settings.navType
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    }
  },
  methods: {
    resolvePath(routePath) {
      return this.thirdRouters.path + '/' + routePath
    },
    handleSelect(index) {
      this.$router.push(index)
    }
  }
}
</script>
<style lang="scss" scoped>
.thirdNav {
  width: 270px;
  padding: 20px 0;
  box-sizing: border-box;
  border-radius: 10px 0px 0px 10px;
  box-shadow: -8.56px -2.78px 20px 9px rgba(212, 224, 248, 0.18);

  .el-menu {
    width: 271px !important;
  }

  .el-menu-item {
    margin-left: 22px;
    width: 226px;
    height: 46px;
    border-radius: 4px;
    font-size: 16px;
    line-height: 46px;
  }

  .line {
    width: 4px;
    position: absolute;
    top: 9px;
    left: -2px;
    border-radius: 5px;
    height: 25px;
  }
}

.topNavClass {
  .is-active {
    // background: var(--theme);
    // color: rgba(0, 0, 0, 0.7) !important;
    background: rgba(0, 0, 0, 0.2) !important;

    .el-submenu__title {
      background-color: var(--theme) !important;
    }
  }
}
</style>
