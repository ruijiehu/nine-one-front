<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">

    <template v-if="navType">
      <!-- 左侧导航布局 -->
      <div class="left-layout">
        <template v-if="navType === 'left'">
          <sidebar class="sidebar-container" />
          <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="left-main-container">
            <div :class="{ 'fixed-header': fixedHeader }">
              <navbar />
              <tags-view v-if="needTagsView" />
            </div>
            <app-main />
            <right-panel>
              <settings />
            </right-panel>
          </div>
        </template>
      </div>

      <!-- 混合导航布局 -->
      <template v-if="navType === 'mix'">
        <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="mix-main-container">
          <div>
            <div class="flex">
              <logo v-if="showLogo" :collapse="isCollapse" />
              <navbar />
            </div>
          </div>
          <div class="mix-main">
            <sidebar v-if="!sidebar.hide" class="mix-sidebar-container" />
            <div class="mix-main-content" :style="{
              '--offsetHeight': offsetHeight,
              flex: sidebar.hide ? '1' : '',
            }">
              <tags-view v-if="needTagsView" />
              <app-main :class="{ 'fixed-mix-app-main': fixedHeader }" />
            </div>
          </div>

          <right-panel>
            <settings />
          </right-panel>
        </div>
      </template>

      <!-- 顶部导航布局 -->
      <template v-if="navType === 'top'">
        <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="top-main-container">
          <div :class="{ 'fixed-header': fixedHeader }">
            <div class="flex">
              <logo v-if="showLogo" :collapse="isCollapse" />
              <navbar />
            </div>
          </div>
          <div class="top-main" :class="{ 'top-main-fixed-header': fixedHeader }">
            <tags-view v-if="needTagsView" />
            <app-main />
          </div>

          <right-panel>
            <settings />
          </right-panel>
        </div>
      </template>

      <!-- 多级站点导航布局 -->
      <div class="second-layout" v-if="navType === 'multistage'">
        <SecondNavbar />
        <div class="main" :class="{ 'top-main-fixed-header': fixedHeader }">
          <SecondSideBar v-if="thirdRouters" />
          <SecondAppMain :style="{ width: thirdRouters ? 'calc(100% - 270px)' : '100%' }" />
        </div>

        <right-panel>
          <settings />
        </right-panel>
      </div>
    </template>

    <template v-else>
      <!-- /**#ifmodule[STYLE_3]**/ -->
      <!-- 第三套布局样式 -->
      <ThirdLayoutCom />
      <!-- /**#endmodule**/ -->
    </template>

  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState, mapGetters } from 'vuex'
import variables from '@/assets/styles/variables.scss'
import Logo from './components/Sidebar/Logo'
import SecondNavbar from './components/secondLayoutCom/Navbar'
import SecondAppMain from './components/secondLayoutCom/AppMain'
import SecondSideBar from './components/secondLayoutCom/sideBar'
/** #ifmodule[STYLE_3]**/
import ThirdLayoutCom from './components/thirdLayoutCom/index'
/** #endmodule**/

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    Logo,
    SecondNavbar,
    SecondAppMain,
    SecondSideBar,
    /** #ifmodule[STYLE_3]**/
    ThirdLayoutCom
    /** #endmodule**/
  },
  mixins: [ResizeMixin],
  data() {
    return {
      offsetHeight: null
    }
  },
  computed: {
    ...mapState({
      theme: (state) => state.settings.theme,
      sideTheme: (state) => state.settings.sideTheme,
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
      // navType: (state) => state.settings.navType,
      navType: (state) => '',
      showLogo: (state) => state.settings.sidebarLogo,
      isCollapse() {
        return !this.sidebar.opened
      }
    }),
    ...mapGetters(['thirdRouters']),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
        // mobile: this.device === 'mobile'
      }
    },
    variables() {
      return variables
    }
  },
  mounted() {
    this.offsetHeight = document.body.scrollHeight - 118 + 'px'
    window.onresize = () => {
      return (() => {
        // 屏幕总高度-顶部导航和tags高度
        this.offsetHeight = document.body.scrollHeight - 118 + 'px'
      })()
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>
<style lang="scss">
.fixed-mix-app-main {
  height: var(--offsetHeight);
  overflow: auto !important;
}
</style>
<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.top-main-container {
  .fixed-header {
    width: 100%;
  }

  .top-main-fixed-header {
    margin-top: 70px;
  }
}

.hideSidebar .left-main-container .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}

.mix-main {
  display: flex;
  // .mix-main-content{
  //   flex: 1;
  // }
}

.flex {
  display: flex;
}

.robot {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 80px;
  height: 80px;
  cursor: pointer;

  img {
    width: 80px;
    height: 80px;
  }
}

//第二套布局样式
.second-layout {
  width: 100%;
  height: 100%;
  background: rgb(248, 248, 252);

  .top {
    width: 100%;
  }

  .main {
    width: 96%;
    margin: 30px 2%;
    display: flex;
    // height: calc(100% - 185px);
  }
}
</style>
