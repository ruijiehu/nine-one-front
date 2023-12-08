<template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect'  || index == levelList.length - 1"
          class="no-redirect"  :style="{color:index===levelList.length-1?theme:''}">{{ item.name
          }}</span>
        <a v-else @click.prevent="handleLink(item)" :style="{color:index===levelList.length-1?theme:''}">{{ item.name }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      levelList: null
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      // let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      // const first = matched[0]

      // if (!this.isDashboard(first)) {
      //   matched = [{ path: '/index', meta: { title: '首页' }}].concat(matched)
      // }

      // this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
      // this.levelList = this.$route.matched
      this.levelList = []
      const matched = this.$route.matched
      const routers = this.$store.state.permission.defaultRoutes.filter(item => { return item.name === matched[0].name })
      this.flatRouters(routers, matched)
    },
    flatRouters(routers, matched) {
      let isFinish = false
      routers.forEach(element => {
        if (element.name === matched[matched.length - 1].name) {
          this.levelList.push(element)
          isFinish = true
        }
        if (!isFinish && element.children && element.children.length) {
          this.levelList.push(element)
          this.flatRouters(element.children, matched)
        }
      })
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim() === 'Index'
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  line-height: 20px;
  margin-left: 8px;
  font-size: 18px;
  color: #999999;
  margin-bottom: 10px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }

}</style>
