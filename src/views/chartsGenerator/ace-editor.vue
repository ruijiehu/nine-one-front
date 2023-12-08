<template>
  <div>
    <editor v-model="value" @init="init" :lang="lang" theme="textmate" height="500"></editor>
  </div>
</template>
<script>
export default {
  name: 'AceEditor',
  components: {
    editor: require('vue2-ace-editor')
  },
  props: ['lang', 'content'],
  model: {
    prop: 'content',
    event: 'change'
  },
  computed: {
    value: {
      get() { return this.content },
      set(val) { this.$emit('change', val) }
    }
  },
  methods: {
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
