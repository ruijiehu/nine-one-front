<template>
  <div>
    <div class="navbar" :style="{ paddingLeft: navType === 'top' ? '40px' : '' }">
      <div class="left">
        <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
                   @toggleClick="toggleSideBar" />
        <div class="tip">欢迎,进入{{ title }}</div>
      </div>
      <div class="right-menu" :style="{ background: `${colorList[themeColor]}` }">
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar" class="user-avatar" />
            欢迎,{{ userName }}
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <!-- <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link> -->
            <el-dropdown-item divided @click.native="getUserInfo" style="border-top:none;margin-top:0">
              <span>用户信息</span>
            </el-dropdown-item>
            <!-- <el-dropdown-item divided @click.native="editPasw">
              <span>修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="setting = true">
              <span>布局设置</span>
            </el-dropdown-item> -->
            <el-dropdown-item divided @click.native="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" :close-on-press-escape="false"
               :close-on-click-modal="false">
      <component :is="comName" @closeDialog="dialogVisible = false" />
    </el-dialog>
  </div>
</template>

<script>
import color from '../color'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import UserInfo from '@/views/system/user/profile/userInfo.vue'
import ResetPwd from '@/views/system/user/profile/resetPwd.vue'
import TopBar from '../../Topbar'

export default {
  data() {
    return {
      dialogTitle: '',
      dialogVisible: false,
      comName: 'UserInfo',
      colorList: color,
      title: '玖易贸易订单管理系统'
    }
  },
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc,
    UserInfo,
    ResetPwd,
    TopBar
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device']),
    theme() {
      return this.$store.state.settings.theme
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme
    },
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    },
    navType: {
      get() {
        return this.$store.state.settings.navType
      }
    },
    userName: {
      get() {
        return (
          this.$store.state.user.name ||
          this.$store.state.user.userInfo.user.username ||
          this.$store.state.user.userInfo.user.nickName || ''
        )
      }
    },
    themeColor() {
      return this.$store.state.settings.colorType
    }
  },
  methods: {
    editPasw() {
      this.comName = 'ResetPwd'
      this.dialogTitle = '修改密码'
      this.dialogVisible = true
    },
    getUserInfo() {
      this.comName = 'UserInfo'
      this.dialogTitle = '用户信息'
      this.dialogVisible = true
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = '/index'
          })
        })
        .catch(() => { })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  // height: 70px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 70px;
  padding: 0 45px 0 55px;
  box-sizing: border-box;

  .left {
    width: 30%;
    display: flex;
    align-items: center;

    .tip {
      font-size: 18px;
      font-family: Source Han Sans CN, Source Han Sans CN-Regular;
      font-weight: 400;
      color: #666666;
    }
  }

  .hamburger-container {
    line-height: 68px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .mix-menu-container {
    flex: 1;
  }

  .top-menu-container {
    flex: 1;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    padding: 0 20px;
    height: 55px;
    background: #377efa;
    border-radius: 8px;
    float: right;
    margin: 14px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // line-height: 70px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: flex;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        color: #fff;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 12px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -12px;
          // top: 32px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
