<template>
  <section class="app-main">
    <!-- //面包屑 -->
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="breadcrumb" />
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>

  </section>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: 'AppMain',
  components: {
    Breadcrumb
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    breadcrumb() {
      return this.$store.state.settings.breadcrumb
    },
    key() {
      return this.$route.path
    }

  },
  data() {
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  // min-height: calc(100vh - 70px);
  width: 100%;
  height: calc(100vh - 187px);
  overflow: auto;
  background: #fff;
  border-radius: 4px;
  position: relative;
  .breadcrumb-container{
    margin-top: 20px;
  }
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 70 + 48 */
    min-height: calc(100vh - 120px);
  }

  .fixed-header+.app-main {
    padding-top: 138px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}

// 取消默认外边框虚线
.vdr.active:before {
  display: none;
}

// .vdr,
// .vdr.active:before {
//   position: fixed !important;
// }
.vdr-stick {
  display: none;
}
</style>
