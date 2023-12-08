<template>
  <div class="options">
    <editor v-model="optionConfig" @init="init" lang="javascript" theme="textmate" height="800"></editor>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  components: { editor: require('vue2-ace-editor') },
  data() {
    return {
    }
  },
  computed: {
    ...mapState('chartConfig', ['optionConfig']),
    optionConfig: {
      set(val) {
        this.setOptionConfig(val)
      },
      get() {
        return this.$store.state.chartConfig.optionConfig
      }
    }
  },
  methods: {
    ...mapMutations('chartConfig', ['setOptionConfig']),
    init() {
      require('brace/ext/language_tools')
      require('brace/mode/html')
      require('brace/mode/javascript')
      require('brace/snippets/javascript')
      require('brace/mode/less')
      require('brace/theme/textmate')
      require('brace/mode/json')
    }
  }
}
</script>
