<template>
  <div class="main-login">
    <div class="title">玖易贸易订单后台管理系统</div>
    <InputLogin  />
  </div>
</template>

<script>
import InputLogin from './inputLogin'
export default {
  data() {
    return {
      activeTab: 1
    }
  },
  computed: {
    loginType() {
      return this.$store.state.settings.loginType
    }
  },
  components: {
    InputLogin
  }
}
</script>

<style lang="less" scoped>
.main-login {
    flex: 1;
    display: flex;
    flex-direction: column;

    .title {
        font-size: 28px;
        font-family: Source Han Sans CN, Source Han Sans CN-Bold;
        font-weight: 700;
        text-align: center;
        color: #333333;
        margin-top: 65px;
    }

    .tab {
        margin-top: 42px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        height: 36px;

        &-item {
            font-size: 18px;
            font-family: Source Han Sans CN, Source Han Sans CN-Regular;
            font-weight: 400;
            color: #c5c5c5;
            margin: 0 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }

        .hl_tab {
            color: #2aacf9;
        }

        .line {
            margin-top: 8px;
            width: 38px;
            height: 4px;
            background: #2aacf9;
            border-radius: 2px;
        }
    }

    .content {
        flex: 1;
        width: 100%;
        display: flex;
        justify-content: center;
    }
}
</style>
