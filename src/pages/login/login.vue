<template>
  <div class="login-wrap" :style="{height:initLoginBoxHeight}">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="ft26">登录</span>
      </div>
      <el-form status-icon :model="form" :rules="rules" ref="form">
        <el-form-item prop="tel">
          <el-input prefix-icon="font-icon-username" v-model="form.tel" placeholder="账号"
                    auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="font-icon-password" type="password" v-model="form.password"
                    placeholder="密码" auto-complete="on" @keyup.native.enter="submit('form')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('form')" style="width: 100%;">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {apiLogin} from '@/api/login'
  import {mapMutations} from 'vuex'
  import Cookies from 'js-cookie'
  import qs from 'qs'

  const TEL = process.env.NODE_ENV === 'production' ? '' : '13521140383'
  const PWD = process.env.NODE_ENV === 'production' ? '' : '123456'

  export default {
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'))
        } else {
          callback();
        }
      }
      const validatePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      return {
        form: {
          tel: TEL,
          password: PWD
        },
        rules: {
          tel: [{validator: validateUsername, trigger: 'blur'}],
          password: [{validator: validatePwd, trigger: 'blur'}]
        }
      }
    },
    computed: {
      initLoginBoxHeight() {
        const Win_H = window.innerHeight
        // header高60 el-main的padding为20
        const loginBox_H = `${Win_H - 60 - 20 - 20}px`
        return loginBox_H
      }
    },
    methods: {
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            apiLogin({
              data: qs.stringify(this.form)
            }).then(res => {
              if (res.resultCode === '0') {
                this.updateUserInfo({
                  uid: res.result.uid,
                  username: res.result.username
                })
                this.$message.success('登录成功')
                this.$router.push('/')
              } else {
                this.$message.error(res.errorMsg)
              }
            })
          } else {
            return false;
          }
        });
      },
      ...mapMutations({
        updateUserInfo: 'updateUserInfo'
      })
    }
  }
</script>

<style lang="less" scoped>
  .login-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    .box-card {
      width: 400px;
      margin-top: -60px;
    }
  }
</style>
