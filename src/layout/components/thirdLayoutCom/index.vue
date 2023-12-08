<template>
  <!-- 第三套布局样式 -->
  <div class="three-layout" :style="{ background: `${colorList[themeColor + '-easy']}` }">
    <div class="three-layout-top" :style="{
      background: `linear-gradient(${colorList[themeColor + '-deep']} 0%, ${colorList[themeColor]} 0%, ${colorList[themeColor + '-easy']} 100%)`
    }">
      <div class="left" :style="{ width: isCollapse ? '64px' : '249px' }">
        <logo v-if="showLogo" :collapse="isCollapse" />
      </div>
      <div class="right"
           :style="{ background: `${colorList[themeColor + '-easy']}`, width: `calc(100% - ${isCollapse ? '64px' : '249px'})` }">
        <navbar />
      </div>
    </div>
    <div class="three-layout-foot">
      <div class="left" :style="{ width: isCollapse ? '64px' : '249px' }">
        <sidebar />
      </div>
      <div class="right"
           :style="{ background: `${colorList[themeColor + '-easy']}`, width: `calc(100% - ${isCollapse ? '64px' : '249px'})` }">
        <tags-view v-if="needTagsView" />
        <app-main :style="{ height: needTagsView ? 'calc(100% - 48px)' : '100%' }" />
      </div>
    </div>

    <right-panel>
      <settings />
    </right-panel>
  </div>
</template>

<script>
import color from './color'
import Sidebar from './Sidebar'
import ResizeMixin from '../../mixin/ResizeHandler'
import { mapState, mapGetters } from 'vuex'
import variables from '@/assets/styles/variables.scss'
import Logo from './components/Logo'
import Navbar from './components/Navbar'
import AppMain from './components/AppMain'
import RightPanel from '@/components/RightPanel'
import Settings from './Settings'
import { TagsView } from '../../components'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    Logo,
    Settings,
    RightPanel,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      offsetHeight: null,
      colorList: color
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
      navType: (state) => state.settings.navType,
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
    },
    themeColor() {
      return this.$store.state.settings.colorType
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
<style lang="scss" scoped>
.three-layout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .three-layout-top {
    display: flex;
    width: 100%;
    height: 149px;

    .left {
      width: 249px;
      height: 149px;
    }

    .right {
      width: calc(100% - 249px);
      height: 149px;
      border-radius: 68px 0 0 0;
    }
  }

  .three-layout-foot {
    flex: 1;
    display: flex;
    width: 100%;
    // height: calc(100% - 165px); //86 +63
    margin-top: -79px;
    overflow: hidden;

    .left {
      width: 249px;
    }

    .right {
      width: calc(100% - 249px);
      // height: calc(100% + 95px);
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
