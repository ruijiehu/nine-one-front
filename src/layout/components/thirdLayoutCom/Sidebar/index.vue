<template>
  <div class="sidebar" :class="[themeColor]">
    <!-- <el-scrollbar  wrap-class="scrollbar-wrapper"> -->
    <!-- :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground" -->
    <!-- :background-color="navType === 'left' ? settings.theme : '#1F232B'" :text-color="settings.sideTheme === 'theme-dark'
                 ? variables.menuColor
                 : variables.menuLightColor
               " -->
    <el-menu :default-active="activeMenu" :collapse="isCollapse" :unique-opened="true" active-text-color="#fff"
             :collapse-transition="false" mode="vertical">
      <sidebar-item v-for="(route, index) in sidebarRouters" :key="route.path + index" :item="route"
                    :base-path="route.path" />
    </el-menu>
    <!-- </el-scrollbar> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'

export default {
  components: { SidebarItem },
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
    themeColor() {
      return this.$store.state.settings.colorType
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
.sidebar {
  margin-top: 78px;
  height: 100%;

  .el-menu {
    background: #ffffff00;
  }

  .router-link-active {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-submenu__title,
  .el-menu-item {
    font-size: 18px;
    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
    color: #666666;
  }

  .el-menu-item.is-active {
    width: 220px;
    margin: 0 auto;
    height: 53px;
    border-radius: 8px;
    font-size: 18px;
    color: #fdfdfd;
    line-height: 53px;
    padding-left: 7px !important;
  }

  .is-active {
    .el-submenu__title {
      width: 220px;
      margin: 0 auto;
      height: 53px;
      border-radius: 8px;
      font-size: 18px;
      color: #fdfdfd;
      line-height: 53px;
      padding-left: 7px !important;
    }
  }

  .nest-menu {
    .el-submenu__title {
      padding-left: 26px !important;
      color: #666666;
    }

    .is-active {
      .el-submenu__title {
        width: 200px !important;
        color: #fdfdfd;
        padding-left: 17px !important;
      }
    }

    .el-menu-item.is-active {
      width: 200px !important;
      padding-left: 17px !important;
    }

    ul {
      .el-menu-item.is-active {
        width: 138px !important;
        min-width: 138px;
        height: 40px;
        line-height: 40px;
        padding-left: 2px !important;
        border-radius: 8px;
      }
    }
  }

  .svg-icon {
    margin-right: 18px;
  }
}

$blue: #377EFA;
$red: #D63335;
$orange: #F48D14;
$green: #2BA274;
$purple:#4E59E6;

.blue {
  .el-menu-item.is-active {
    background: $blue;
  }

  .is-active {
    .el-submenu__title {
      background: $blue;
    }
  }

  .nest-menu {
    .el-submenu__title {
      background: #fdfdfd00;
    }

    .is-active {
      .el-submenu__title {
        background: $blue !important;
      }
    }

    ul {
      .el-menu-item.is-active {
        color: $blue !important;
        background: #377efa1a !important;
      }
    }
  }
}

.red {
  .el-menu-item.is-active {
    background: $red;
  }

  .is-active {
    .el-submenu__title {
      background: $red;
    }
  }

  .nest-menu {
    .el-submenu__title {
      background: #fdfdfd00;
    }

    .is-active {
      .el-submenu__title {
        background: $red !important;
      }
    }

    ul {
      .el-menu-item.is-active {
        color: $red !important;
        background: #f53f3f1a !important;
      }
    }
  }
}

.orange {
  .el-menu-item.is-active {
    background: $orange;
  }

  .is-active {
    .el-submenu__title {
      background: $orange;
    }
  }

  .nest-menu {
    .el-submenu__title {
      background: #fdfdfd00;
    }

    .is-active {
      .el-submenu__title {
        background: $orange !important;
      }
    }

    ul {
      .el-menu-item.is-active {
        color: $orange !important;
        background: #F48D141a !important;
      }
    }
  }
}

.green{
  .el-menu-item.is-active {
    background: $green;
  }

  .is-active {
    .el-submenu__title {
      background: $green;
    }
  }

  .nest-menu {
    .el-submenu__title {
      background: #fdfdfd00;
    }

    .is-active {
      .el-submenu__title {
        background: $green !important;
      }
    }

    ul {
      .el-menu-item.is-active {
        color: $green !important;
        background: #2BA2741a !important;
      }
    }
  }
}

.purple{
  .el-menu-item.is-active {
    background: $purple;
  }

  .is-active {
    .el-submenu__title {
      background: $purple;
    }
  }

  .nest-menu {
    .el-submenu__title {
      background: #fdfdfd00;
    }

    .is-active {
      .el-submenu__title {
        background: $purple !important;
      }
    }

    ul {
      .el-menu-item.is-active {
        color: $purple !important;
        background: #4E59E61a !important;
      }
    }
  }
}
</style>
