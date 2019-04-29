import Vue from 'vue'
import Router from 'vue-router'
import routes from './router'
import store from '../store'
import Cookies from 'js-cookie'
import Util from '@/base/js/util'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

export const router = new Router({
  // mode: 'history',
  routes: routes
})

console.log(Cookies());
router.beforeEach((to, from, next) => {
  NProgress.start()
  Util.title(to.meta.title)
  if (!Cookies.get('token') && to.name !== 'login') {//如果当前未登录且不是去登录页
    next({
      name: 'login'
    })
  } else if (Cookies.get('token') && to.name === 'login') {//如果当前登录且去的是登录页
    next({
      name: 'draw_onlinelist'
    })
  } else {
    const curRouterObj = Util.getRouterObjByName(routes, to.name)
    if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
      Cookies.get('access') && ( access = JSON.parse(Cookies.get('access')))
      if (access.includes(curRouterObj.access)) {
        Util.toDefaultPage(routes, to.name, router, next) // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
      } else {
        next({
          name: 'error-403'
        })
      }
    } else { // 没有配置权限的路由, 直接通过
      Util.toDefaultPage(routes, to.name, router, next)
    }
  }
  //获取待审核列表数量
  // store.dispatch('getUpdateCheckNum')
})
router.afterEach((to) => {
  NProgress.done()
  window.scrollTo(0, 0);
});