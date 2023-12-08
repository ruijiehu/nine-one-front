<template>
  <div
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor: navType === 'left' ? settings.theme : '#1F232B',
    }"
  >
    <logo v-if="showLogo && navType === 'left'" :collapse="isCollapse" />
    <el-scrollbar :class="[settings.sideTheme]" wrap-class="scrollbar-wrapper">
      <!-- :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground" -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="navType === 'left' ? settings.theme : '#1F232B'"
        :text-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor
        "
        :unique-opened="true"
        :active-text-color="
          navType !== 'left'
            ? settings.theme
            : settings.sideTheme === 'theme-dark'
              ? variables.menuColor
              : variables.menuLightColor
        "
        :collapse-transition="false"
        mode="vertical"
        :class="[
          settings.sideTheme === 'theme-dark'
            ? 'theme-dark-class'
            : 'theme-light-class',
          navType === 'left' ? 'leftNavClass' : 'topNavClass',
        ]"
        :style="{ '--theme': theme }"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      theme: this.$store.state.settings.theme
    }
  },
  computed: {
    ...mapState(['settings']),
    ...mapGetters(['sidebarRouters', 'sidebar']),
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
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss">
.topNavClass {
  .is-active {
    background: var(--theme);
    .el-submenu__title {
      background-color: var(--theme) !important;
    }
  }
}
.leftNavClass {
  .is-active {
    background-color: rgba(0, 0, 0, 0.2) !important;
  }

  .nest-menu {
    .el-menu-item {
      height: 34px !important;
      line-height: 34px !important;
    }
  }
  .nest-menu .router-link-active {
    width: 210px !important;
    min-width: 210px !important;
    border-radius: 4px;
    margin: 0 10px;
    .is-active {
      margin-left: -10px;
    }
    .el-menu-item,
    .el-submenu__title {
      height: 34px !important;
      line-height: 34px !important;
    }
  }
  .el-menu-item,
  .el-submenu__title {
    height: 44px !important;
    line-height: 44px !important;
    font-size: 16px;

    .svg-icon {
      margin-right: 14px !important;
    }
  }
}
</style>
