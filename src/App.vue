<template>
  <div id="app">
    <layout v-if="$route.path !== '/login'" />
    <router-view v-else />
  </div>
</template>

<script>
import layout from '@/layout/index'
export default {
  name: 'App',
  components: { layout },
  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: title => {
        return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
      }
    }
  },
  methods: {

  }
}
</script>
<style>
/**#ifmodule[STYLE_2]**/
@import "~@/assets/styles2/second-style.scss";
/**#endmodule**/
</style>
