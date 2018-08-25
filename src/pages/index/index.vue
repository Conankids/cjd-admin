<template>
  <el-container>
    <el-aside width="256px">
      <el-menu :default-active="defaultActive"
               :default-openeds="defaultOpeneds"
               background-color="transparent"
               :router="true">
        <el-submenu v-for="(subItem,key1) in menuList" :key="key1"
                    v-if="!subItem.hidden && getMenuList(subItem.children).length>1" :index="subItem.path">
          <template slot="title">
            <i :class="subItem.icon"></i>
            <span slot="title">{{subItem.meta.title}}</span>
          </template>
          <el-menu-item
              v-for="(menuItme,key2) in subItem.children"
              :key="key2"
              v-if="!menuItme.hidden"
              :index="menuItme.path"
              @click="changeActiveDate">{{menuItme.meta.title}}
            <sup v-if="checkNum[menuItme.meta.checkNum]"
                 class="my-badge">{{checkNum[menuItme.meta.checkNum]}}</sup>
          </el-menu-item>
        </el-submenu>
        <el-menu-item
            v-else-if="!subItem.hidden"
            v-for="(menuItme,key2) in getMenuList(subItem.children)"
            :key="key2"
            :index="menuItme.path"
            @click="changeActiveDate">
          <i :class="subItem.icon"></i>
          <span slot="title">{{menuItme.meta.title}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="main-wrap">
      <div class="main-content">
        <transition name="move" mode="out-in">
          <router-view :key="activeDate"/>
        </transition>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        activeDate: ''
      }
    },
    computed: {
      checkNum() {
        return 1
      },
      menuList() {
        return this.$router.options.routes
      },
      defaultActive() {
        return this.$route.path
      },
      defaultOpeneds() {
        let arr = []
        this.menuList.forEach((item) => {
          if (!item.hidden && this.getMenuList(item.children).length > 1) {
            arr.push(item.path)
          }
        })
        return arr
      }
    },
    methods: {
      //获取可显示路由列表
      getMenuList(list) {
        return list.filter(item => !item.hidden)
      },
      changeActiveDate() {
        this.activeDate = new Date().getTime()
      }
    }
  }
</script>

<style lang="less" scoped>
  .main-wrap {
    padding: 0 40px;
  }

  .main-content {
    padding: 40px;
    background-color: #fff;
    max-width: 1220px;
    margin: 0 auto;
    min-width: 860px;
  }

  .my-badge {
    background-color: #f56c6c;
    border-radius: 10px;
    color: #fff !important;
    display: inline-block;
    font-size: 12px;
    height: 14px;
    line-height: 14px;
    padding: 0 5px;
    text-align: center;
    white-space: nowrap;
    position: relative;
    bottom: 1px;
  }

  .el-submenu [class^=font-icon-] {
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
  }
</style>