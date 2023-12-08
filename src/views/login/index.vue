<template>
  <div class="login">
    <div class="box" v-if="loginType === 'center'">
      <div class="box-left"></div>
      <mainLogin class="box-right" />
    </div>
    <div class="box-center" v-else>
      <mainLogin class="box-center-main" />
    </div>
  </div>
</template>

<script>
import mainLogin from './mainLogin'
export default {
  name: 'Login',
  data() {
    return {
    }
  },
  computed: {
    loginType() {
      return this.$store.state.settings.loginType
    }
  },
  components: {
    mainLogin
  }
}
</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: #f5f7fa;

  .box {
    width: 1400px;
    height: 719px;
    background: #ffffff;
    border-radius: 40px;
    box-shadow: 0px 0px 27px 0px rgba(162, 162, 162, 0.15);
    display: flex;

    &-left {
      width: 55%;
      height: 100%;
      background: url("~@/assets/img/loginBg.png") no-repeat;
    }

    &-right {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }

  .box-center {
    width: 100%;
    height: 100%;
    background: url("~@/assets/img/loginBg2.png") no-repeat;
    background-size: cover;

    &-main {
      position: absolute;
      right: 230px;
      top: 50%;
      transform: translateY(-50%);
      width: 591px;
      height: 713px;
      background: #ffffff;
      border: 4px solid #ffffff;
      border-radius: 10px;
      box-shadow: 4.07px 25.68px 65.96px 0.78px rgba(18, 44, 120, 0.15);
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
