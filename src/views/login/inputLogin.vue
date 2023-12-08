<template>
  <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
    <div class="subtitle">请输入用户名</div>
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" type="text" auto-complete="new-password" placeholder="账号" @blur="blurFun">
      </el-input>
    </el-form-item>
    <div class="subtitle">请输入密码</div>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" :type="passwordType" auto-complete="new-password" placeholder="密码" class="area"
                @keyup.enter.native="handleLogin">
      </el-input>
      <span class="seepassword">
        <img :src="imgurl" alt @click="clickImg" />
      </span>
    </el-form-item>
    <template v-if="showCapt">
      <div class="subtitle">验证码</div>
      <el-form-item prop="captcha" v-if="captchaOnOff">
        <el-input v-model="loginForm.captcha" auto-complete="off" placeholder="验证码" style="width: 63%"
                  @keyup.enter.native="handleLogin">
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
    </template>
    <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
    <el-form-item style="width: 100%">
      <el-button :loading="loading" type="primary" style="width: 100%" @click.native.prevent="handleLogin">
        <span v-if="!loading">登 录</span>
        <span v-else>登 录 中...</span>
      </el-button>
      <div style="float: right" v-if="register">
        <router-link class="link-type" :to="'/register'">立即注册</router-link>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapMutations } from 'vuex'
import { checkcaptcha } from '@/api/login'
import Cookies from 'js-cookie'
import { decrypt } from '@/utils/jsencrypt'
import eyeNopng from '@/assets/img/eye-no.png'
import eyepng from '@/assets/img/eye.png'
import { setToken } from '@/utils/auth'
export default {
  name: 'Login',
  data() {
    return {
      imgurl: eyeNopng,
      passwordType: 'password',
      codeUrl: process.env.VUE_APP_BASE_API + '/guest/captcha',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        captcha: '',
        uuid: '',
        captchaId: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入您的账号' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入您的密码' }
        ],
        captcha: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: false,
      redirect: undefined,
      showCapt: false
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
  created() {
    this.getCode()
    this.getCookie()
  },
  methods: {
    ...mapMutations(['SET_NAME']),
    clickImg() {
      if (this.passwordType === 'password') {
        this.passwordType = 'input'
        this.imgurl = eyepng
      } else {
        this.passwordType = 'password'
        this.imgurl = eyeNopng
      }
    },
    // 获取验证码
    getCode() {
      this.loginForm.captchaId = Math.random()
      this.codeUrl =
        process.env.VUE_APP_BASE_API + '/sys/bms/captcha?captchaId=' + this.loginForm.captchaId
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      if (this.loginForm.username) {
        this.blurFun()
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          console.log(this.loginForm)
          this.$store
            .dispatch('Login', this.loginForm)
            .then((res) => {
              this.SET_NAME(res.data.username)
              setToken(res.data.accessToken)
              this.$router.push({ path: this.redirect || '/warehouse/goodsin' }).catch(() => { })
            })
            .catch(() => {
              this.showCapt = true
              this.loading = false
              if (this.captchaOnOff) {
                this.getCode()
              }
            })
        }
      })
    },
    blurFun() {
      checkcaptcha(this.loginForm.username).then((res) => {
        console.log(res)
        if (res.data) {
          this.showCapt = true
        } else {
          this.showCapt = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 85%;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  /deep/.el-input--medium .el-input__inner {
    width: 100%;
    height: 66px !important;
    line-height: 66px !important;
    color: #333;
    font-size: 18px;
    border-radius: 10px;
  }

  /deep/ .el-input {
    height: 66px !important;
  }

  /deep/.el-form-item__content {
    height: 66px !important;
    line-height: 66px  !important;
    width: 100%;
  }

  /deep/.el-input__prefix {
    top: 50%;
    margin-top: -20px;
  }

  /deep/.el-button--medium {
    height: 66px  !important;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
  }

  .title {
    // margin: 65px auto 42px auto;
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    color: #333333;
  }

  .subtitle {
    font-size: 14px;
    color: #c5c5c5;
    margin-bottom: 10px;
  }

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }

  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .login-code {
    width: 33%;
    height: 38px;
    float: right;

    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }

  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .login-code-img {
    height: 38px;
  }

  .seepassword {
    position: absolute;
    right: 10px;
    z-index: 20;
    top: 50%;
    transform: translateY(-40%);

    img {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }

  /deep/.el-button {
    border-radius: 10px;
  }
}
</style>
