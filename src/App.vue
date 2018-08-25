<template>
  <div id="app">
    <el-container>
      <el-header height="60px">
        <div class="main">
          <h3>
            <router-link to="/"><img class="logo" src="./assets/logo.jpg">抽奖帝后台管理</router-link>
          </h3>
          <div class="user" v-if="uid">
            <span class="red">你好，{{username}}</span>
            <a href="javascript:;" class="ml20 blue" @click="logout">注销</a>
          </div>
        </div>
      </el-header>
      <el-main style="margin-top: 60px;">
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import {getUserInfo, apiLogout} from '@/api/login'
  import {mapMutations} from 'vuex'
  import Cookies from 'js-cookie'

  export default {
    name: 'App',
    data() {
      return {}
    },
    computed: {
      uid() {
        return this.$store.state.userInfo.uid
      },
      username() {
        return this.$store.state.userInfo.username
      }
    },
    created() {
      this._getUserInfo()
    },
    methods: {
      _getUserInfo() {
        if (!Cookies.get('token')) return
        getUserInfo().then(res => {
          if (res.resultCode === '0') {
            this.updateUserInfo({
              uid: res.result.uid,
              username: res.result.username
            })
          } else {
            Cookies.set('PHPSESSION', '')
            Cookies.set('token', '')
            this.$router.push('/login')
          }
        })
      },
      logout() {
        apiLogout().then(res => {
          if (res.resultCode === '0') {
            this.$message.success('注销成功')
            setTimeout(function () {
              location.reload()
            }, 500)
          } else {
            this.$message.error(res.errorMsg)
          }
        })
      },
      ...mapMutations({
        updateUserInfo: 'updateUserInfo'
      })
    }
  }
</script>

<style lang="less">
  @import "./base/less/reset.less";
  @import "./base/fonts/iconfont.css";

  body {
    min-width: 1350px;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .el-header {
    width: 100%;
    position: fixed;
    z-index: 100;
    background-color: #fff;
    border-bottom: #e6e6e6 solid 1px;
    padding: 0 40px;

    .main {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 26px;
        font-weight: normal;

        .router-link-active {
          display: flex;
          align-items: center;
        }

      }
    }
    .logo {
      width: 40px;
      margin-right: 5px;
      border-radius: 50%;
    }
  }
</style>
