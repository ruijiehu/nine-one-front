<template>
  <div class="zzdLogin">
    <div class="code">
      <iframe class="login-2code-img" :src="zzdIframeUrl" frameborder="0"></iframe>
    </div>
    <div class="tip">
      <div class="icon"><img src="@/assets/img/saoma.png" /></div>
      <div class="txt">
        <div>打开<span>浙政钉APP</span></div>
        <div>扫一扫登录</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { getUserInfo } from '@/api/system/user'
import { setToken } from '@/utils/auth'
export default {
  name: 'Login',
  data() {
    return {
      activeTab: 1,
      zzdIframeUrl: '',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    const that = this
    this.getDingUrlApi()
    /* 监听扫码事件 */
    window.addEventListener('message', function(event) {
      if (event.data && event.data.code) {
        console.log(event)
        that.getUserData(event.data.code)
      }
    })
  },
  methods: {
    ...mapMutations(['SET_NAME']),
    // 获取钉钉二维码
    async getDingUrlApi() {
      // const { result: { scanUrl, clientId, redirectUrl } } = await getDingScanConfig()
      // this.zzdIframeUrl = `${scanUrl}/oauth2/auth.htm?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&authType=QRCODE&embedMode=true`
      this.zzdIframeUrl = `https://login.dg-work.cn/oauth2/auth.htm?response_type/=code&client_id=jczzdn_dingoa_dingoa&redirect_uri=http%3A%2F%2F192.168.3.134%3A84%2Fuser%2Flogin&authType=QRCODE&embedMode=true`
    },
    async getUserData(code) {
      const { success, data } = await getUserInfo({
        code: code
      })
      if (success && data) {
        this.SET_NAME(data.username)
        setToken(data.accessToken)
        this.$router.push({ path: this.redirect || '/tool/index' }).catch(() => { })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.zzdLogin {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  .title {
    font-size: 20px;
    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
    font-weight: 400;
    color: #333333;
  }

  .code {
    width: 280px;
    height: 336px;
    background: #ffffff;
    // border: 1px solid #eeeeee;

    iframe {
      width: 100%;
      height: 100%;
    }
  }

  .tip {
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      width: 56px;
      height: 36px;
      padding: 0 10px;
      box-sizing: border-box;
      border-right: 2px solid #ccc;

      img {
        width: 100%;
      }
    }

    .txt {
      font-size: 18px;
      color: #333333;
      line-height: 23px;
      margin-left: 10px;

      span {
        color: #2AACF9;
      }
    }
  }
}
</style>
