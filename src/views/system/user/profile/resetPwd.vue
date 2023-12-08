<template>
  <div class="resetpwd">
    <span class="closeBtn" @click="close">X</span>
    <el-form ref="form" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword" v-if="!notOld">
        <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password/>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" maxlength="18" show-password/>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" maxlength="18" show-password/>
      </el-form-item>
      <el-form-item style="text-align:right">
        <el-button type="primary"    @click="submit">保存</el-button>
        <el-button type=""    @click="close">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateUserPwd, resetUserPwd } from '@/api/system/user'
import md5 from 'js-md5'

export default {
  props: ['notOld', 'usernameget'],
  data() {
    const newPasswordReg = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=~`_-])(?!.*\s).{8,}$/
        if (!reg.test(value)) {
          callback(new Error('密码八位以上，大小写+特殊字符+数字'))
        } else {
          callback()
        }
      }
    }
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: newPasswordReg, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    username: {
      get() {
        return this.$store.state.user.userInfo.user.username
      }
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.notOld) {
            const params = {
              username: this.usernameget,
              newPassword: md5(this.user.newPassword)
            }
            this.editPwd(params)
          } else {
            const params = {
              username: this.username,
              oldPassword: md5(this.user.oldPassword),
              newPassword: md5(this.user.newPassword)
            }
            updateUserPwd(params).then(() => {
              this.$modal.msgSuccess('修改成功')
              this.close()
            })
          }
        }
      })
    },
    async editPwd(params) {
      const { status, msgs } = await resetUserPwd(params)
      if (status === 200) {
        this.$modal.msgSuccess('修改成功')
        this.$refs.form.clearValidate()
        this.user = this.$options.data().user
        this.$emit('closeDialog')
      } else {
        this.$message.error(msgs[Object.keys(msgs)[0]])
      }
    },
    close() {
      if (!this.notOld) {
        // this.$tab.closePage();
      }
      this.$refs.form.clearValidate()
      this.user = this.$options.data().user
      this.$emit('closeDialog')
    }
  }
}
</script>
<style lang="less">
.resetpwd{
  position: relative;
}
.closeBtn{
  position: absolute;
  top: -64px;
  right: 0px;
  background: #fff;
  width: 14px;
  height: 14px;
  display: block;
  text-align: center;
  cursor: pointer;
}
</style>
