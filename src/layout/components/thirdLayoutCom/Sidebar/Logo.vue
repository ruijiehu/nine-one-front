<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: collapse }"
    :style="{ backgroundColor: theme }"
  >
    <!-- <transition name="sidebarLogoFade"> -->
    <!-- <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img :src="logo" class="sidebar-logo" />

      </router-link> -->
    <router-link key="expand" class="sidebar-logo-link" to="/">
      <img v-if="logo" :src="logo" class="sidebar-logo" />
      <h1
        v-if="!collapse"
        class="sidebar-title"
        :style="{
          color:
            sideTheme === 'theme-dark'
              ? variables.logoTitleColor
              : variables.logoLightTitleColor,
        }"
      >
        {{ title }}
      </h1>
    </router-link>
    <!-- </transition> -->
  </div>
</template>

<script>
import logoImg from '@/assets/img/logo.png'
import logoBlankImg from '@/assets/img/logo-blank.png'
import variables from '@/assets/styles/variables.scss'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    variables() {
      return variables
    },
    theme() {
      return this.$store.state.settings.theme
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme
    },
    logo() {
      return this.$store.state.settings.sideTheme === 'theme-dark'
        ? logoImg
        : logoBlankImg
    }
  },
  data() {
    return {
      title: '玖易贸易订单管理系统'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 230px;
  // height: 70px;
  // line-height: 70px;
  // background: #2b2f3a;
  text-align: center;
  overflow: hidden;
  // margin-right: 40px;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 22px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      white-space: nowrap;
    }
  }

  &.collapse {
    width: 54px;
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
.left-layout{
  .sidebar-logo-container{
    height: 100px;
    a{
      display: flex !important;
    }
  }
}
</style>
