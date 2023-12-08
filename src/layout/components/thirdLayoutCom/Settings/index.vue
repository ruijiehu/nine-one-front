<template>
  <div class="drawer-container">
    <div>
      <div class="setting-drawer-content">
        <div class="drawer-item">
          <span>主题颜色</span>
          <theme-picker style="opacity: 0;" @change="themeChange" />

          <div class="themeBox">
            <img v-for="(item, index) in colorList" :key="index"
                 :src="item.type === colorType ? item.imgurlHl : item.imgurl" @click="colorthemeChange(item.type)" />
          </div>
        </div>
        <div class="drawer-item">
          <span>弹窗布局</span>
          <div class="setting-drawer-block-checbox">
            <div class="setting-drawer-block-checbox-item" @click="handleDialog('center')">
              <img v-if="dialogType === 'center'" src="@/assets/img/center_hl.png" alt="dark" />
              <img v-else src="@/assets/img/center.png" alt="dark" />
            </div>
            <div class="setting-drawer-block-checbox-item" @click="handleDialog('right')">
              <img v-if="dialogType === 'right'" src="@/assets/img/right-dialog_hl.png" alt="dark" />
              <img v-else src="@/assets/img/right-dialog.png" alt="light" />
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <h3 class="drawer-title">系统布局配置</h3>

      <!-- <div class="drawer-item">
        <span>开启 TopNav</span>
        <el-switch v-model="topNav" class="drawer-switch" />
      </div> -->

      <div class="drawer-item">
        <span>开启 Tags-Views</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>固定 Header</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>显示 Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>显示面包屑</span>
        <el-switch v-model="breadcrumb" class="drawer-switch" />
      </div>

      <!-- <div class="drawer-item">
        <span>动态标题</span>
        <el-switch v-model="dynamicTitle" class="drawer-switch" />
      </div> -->

      <el-divider />

      <el-button size="small" type="primary" icon="el-icon-document-add" @click="saveSetting">保存配置</el-button>
      <el-button size="small" icon="el-icon-refresh" @click="resetSetting">重置配置</el-button>
    </div>
  </div>
</template>

<script>
import color from '../color'
import ThemePicker from '@/components/ThemePicker'

export default {
  components: { ThemePicker },
  data() {
    return {
      theme: this.$store.state.settings.theme,
      sideTheme: this.$store.state.settings.sideTheme,
      navType: this.$store.state.settings.navType,
      dialogType: this.$store.state.settings.dialogType,
      colorType: this.$store.state.settings.colorType,
      colorList: [
        {
          imgurl: require('@/assets/img/red-theme.png'),
          imgurlHl: require('@/assets/img/red-theme-hl.png'),
          type: 'red'
        },
        {
          imgurl: require('@/assets/img/orange-theme.png'),
          imgurlHl: require('@/assets/img/orange-theme-hl.png'),
          type: 'orange'
        },
        {
          imgurl: require('@/assets/img/green-theme.png'),
          imgurlHl: require('@/assets/img/green-theme-hl.png'),
          type: 'green'
        },
        {
          imgurl: require('@/assets/img/blue-theme.png'),
          imgurlHl: require('@/assets/img/blue-theme-hl.png'),
          type: 'blue'
        },
        {
          imgurl: require('@/assets/img/purple-theme.png'),
          imgurlHl: require('@/assets/img/purple-theme-hl.png'),
          type: 'purple'
        }
      ]
    }
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'topNav',
          value: val
        })
        if (!val) {
          this.$store.dispatch('app/toggleSideBarHide', false)
          this.$store.commit(
            'SET_SIDEBAR_ROUTERS',
            this.$store.state.permission.defaultRoutes
          )
        }
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    },
    dynamicTitle: {
      get() {
        return this.$store.state.settings.dynamicTitle
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'dynamicTitle',
          value: val
        })
      }
    },
    breadcrumb: {
      get() {
        return this.$store.state.settings.breadcrumb
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'breadcrumb',
          value: val
        })
      }
    }
  },
  methods: {
    colorthemeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'colorType',
        value: val
      })
      this.colorType = val
      this.themeChange(color[val])
    },
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
      this.theme = val
    },
    handleNavType(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'navType',
        value: val
      })
      this.navType = val
      if (val === 'left') {
        this.$store.dispatch('app/toggleSideBarHide', false)
      }
      this.$store.commit(
        'SET_SIDEBAR_ROUTERS',
        this.$store.state.permission.defaultRoutes
      )
    },
    handleTheme(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'sideTheme',
        value: val
      })
      this.sideTheme = val
    },
    handleDialog(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'dialogType',
        value: val
      })
      this.dialogType = val
    },
    saveSetting() {
      this.$modal.loading('正在保存到本地，请稍候...')
      this.$cache.local.set(
        'layout-setting',
        `{  
            "navType":"${this.navType}",
            "topNav":${this.topNav},
            "tagsView":${this.tagsView},
            "fixedHeader":${this.fixedHeader},
            "sidebarLogo":${this.sidebarLogo},
            "dynamicTitle":${this.dynamicTitle},
            "sideTheme":"${this.sideTheme}",
            "theme":"${this.theme}",
            "dialogType":"${this.dialogType}",
            "breadcrumb":${this.breadcrumb},
            "colorType":"${this.colorType}"
          }`
      )
      setTimeout(this.$modal.closeLoading(), 1000)
    },
    resetSetting() {
      this.$modal.loading('正在清除设置缓存并刷新，请稍候...')
      this.$cache.local.remove('layout-setting')
      // eslint-disable-next-line no-implied-eval
      setTimeout('window.location.reload()', 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-drawer-content {
  .setting-drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
    font-weight: bold;
  }

  .setting-drawer-block-checbox {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;

    .setting-drawer-block-checbox-item {
      position: relative;
      margin-right: 16px;
      cursor: pointer;

      img {
        border-radius: 4px;
        width: 40px;
        height: 40px;
      }

      .setting-drawer-block-checbox-selectIcon {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        padding-top: 15px;
        padding-left: 24px;
        color: #1890ff;
        font-weight: 700;
        font-size: 14px;
      }
    }
  }
}

.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;

    .themeBox {
      display: flex;

      img {
        width: 40px;
        margin-right: 5px;
        cursor: pointer;
      }
    }
  }

  .drawer-switch {
    float: right;
  }
}
</style>
