/*
* 配置路由及左侧菜单信息
* path: 路由path
* name: 路由名称
* hidden: 不显示在菜单栏
* icon: 菜单图标
* title: 菜单名称+页面title
* components: 页面组件
*/

const draw = {
  path: '/draw',
  name: 'draw',
  icon: 'font-icon-draw',
  meta: {
    title: '公共抽奖管理'
  },
  component: () => import('@/pages/index/index.vue'),
  children: [
    {
      path: '/draw/add',
      name: 'draw_add',
      meta: {
        title: '新建抽奖'
      },
      component: () => import('@/pages/draw/add.vue')
    },
    {
      path: '/draw/edit/:id',
      name: 'draw_edit',
      hidden: true,
      meta: {
        title: '编辑抽奖'
      },
      component: () => import('@/pages/draw/edit.vue')
    },
    {
      path: '/draw/checklist',
      name: 'draw_checklist',
      meta: {
        title: '待审核列表'
      },
      component: () => import('@/pages/draw/check-list.vue')
    },
    {
      path: '/draw/timinglist',
      name: 'draw_timinglist',
      meta: {
        title: '定时上线列表'
      },
      component: () => import('@/pages/draw/timing-list.vue')
    },
    {
      path: '/draw/onlinelist',
      name: 'draw_onlinelist',
      meta: {
        title: '上线列表'
      },
      component: () => import('@/pages/draw/online-list.vue')
    },
    {
      path: '/draw/downlist',
      name: 'draw_downlist',
      meta: {
        title: '下线列表'
      },
      component: () => import('@/pages/draw/down-list.vue')
    },
    {
      path: '/draw/statistics/:id',
      name: 'draw_statistics',
      hidden: true,
      meta: {
        title: '数据统计'
      },
      component: () => import('@/pages/draw/draw-statistics.vue')
    },
    {
      path: '/draw/winnerlist/:id',
      name: 'draw_winnerlist',
      hidden: true,
      meta: {
        title: '中奖名单'
      },
      component: () => import('@/pages/draw/winner-list.vue')
    }
  ]
}
const user = {

  path: '/user',
  name: 'user',
  icon: 'font-icon-user-manage',
  meta: {
    title: '用户管理'
  },
  component: () => import('@/pages/index/index.vue'),
  children: [
    {
      path: '/user/manage',
      name: 'user_manage',
      meta: {
        title: '用户管理'
      },
      component: () => import('@/pages/user/manage.vue')
    }
  ]
}

//个人抽奖情况
const personal = {
  path: '/personal',
  name: 'personal',
  icon: 'font-icon-user-manage',
  meta: {
    title: '个人抽奖管理'
  },
  component: () => import('@/pages/index/index.vue'),
  children: [
    {
      path: '/personal/data-detail',
      name: 'data_detail',
      meta: {
        title: '数据概况'
      },
      component: () => import('@/pages/personal/data-detail.vue')
    },
    {
      path: '/personal/individual-draw',
      name: 'individual_draw',
      meta: {
        title: '个人抽奖列表'
      },
      component: () => import('@/pages/personal/individual-draw.vue')
    },
    {
      path: '/personal/data-statistics/:id',
      name: 'data_statistics',
      hidden: true,
      meta: {
        title: '数据统计'
      },
      component: () => import('@/pages/personal/data-statistics.vue')
    },
    {
      path: '/personal/data-winner-list/:id',
      name: 'data_winnerlist',
      hidden: true,
      meta: {
        title: '中奖名单'
      },
      component: () => import('@/pages/personal/data-winner-list.vue')
    },
    {
      path: '/personal/item-detail/:id',
      name: 'item_detail',
      hidden: true,
      meta: {
        title: '奖品详情'
      },
      component: () => import('@/pages/personal/item-detail.vue')
    },
  ]
}

const routes = [
  {
    path: '/',
    hidden: true,
    redirect: '/draw/onlinelist'
  },
  {
    path: '/login',
    name: 'login',
    hidden: true,
    meta: {
      title: '登录'
    },
    component: () => import('@/pages/login/login.vue')
  },
  {
    path: '/error403',
    name: 'error-403',
    hidden: true,
    meta: {
      title: '权限不足'
    },
    component: () => import('@/pages/error/error-403.vue')
  },
  draw,
  user,
  personal,
  {
    path: '*',
    name: 'error-404',
    hidden: true,
    meta: {
      title: '找不到该页面'
    },
    component: () => import('@/pages/error/error-404.vue')
  }
]

export default routes
