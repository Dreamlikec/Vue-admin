import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

/**
 * 1、系统分配
 * 2、角色分配
 * 3、按钮级别分配
 *
 * 工作：路由是前台配，还是后台配的问题？
 * 
 * 个人建议，前端配置，这样才能达到前后端分离的工作；
 * 
 * 1、后台配置路由，前端人不在的情况；没办法页面跳转；
 * 2、新的需求，前端把路由配好了，后台的人不在，没办法找到路由；
 * 
 */

/**
 * 
 * 1、默认路由
 * 2、动态路由
 */


// 引入布局组件
import Layout from '@/views/Layout'
/**
 * 默认路由
 */
export const defaultRouterMap = [
  {
    path: "/",
    redirect: "login",
    name:"index",
    meta: {
      name: "主页",
      hidden: true,
    }
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      name: "登录",
      hidden: true,
    },
    component: () => import("../views/Login/index.vue")
  },
  {
    path: "/console",
    name: "Console",
    redirect: "index",
    meta: {
      keepAlive: true,
      name: "控制台",
      icon: 'console'
    },
    component: Layout,
    children: [
      {
        path: "/index",
        name: "Index",
        meta: {
          keepAlive: true,
          name: "首页"
        },
        component: resolve => (require(["@/views/Console/index.vue"], resolve))
      }
    ]
  }, 
  {
    path: "/Loads",
    name: "Loads",
    meta: {
      keepAlive: true,
      name: "负荷估算",
      icon: "loads",
    },
    component: Layout,
    children: [{
      path: "/buildingInfo",
      name: "buildingInfo",
      meta: {
        role: ['manager'],
        name: "建筑信息",
        keepAlive: true
      },
      component: () => import("../views/Loads/index.vue")
    }, {
      path: "/calresult",
      name: "calresult",
      hidden: true,
      meta: {
        role: ['manager'],
        name: "计算结果",
        keepAlive: true,
        hidden:true
      },
      component: () => import("../views/Loads/CalResult.vue")
    }]
  },
  {
    path: "/configuration",
    name: "configuration",
    meta: {
      keepAlive: true,
      name: "系统配置",
      icon: "configuration",
    },
    component: Layout,
    children: [{
      path: "/sizing",
      name: "sizing",
      meta: {
        role: ['manager'],
        name: "设备选型",
        keepAlive: true
      },
      component: () => import("../views/configuration/index.vue")
    }]
  }
]

export default new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: defaultRouterMap
});

/**
 * 动态路由
 * 角色：sale, technician, manager
 */
export const asnycRouterMap = [
  {
    path: "/info",
    name: "Info",
    meta: {
      role: ['sale'],
      system: 'infoSystem',
      name: "信息管理",
      icon: 'info',
      keepAlive: true
    },
    component: Layout,
    children: [
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta: {
          keepAlive: true,
          role: ['sale'],
          name: "信息列表"
        },
        component: () => import("../views/Info/index.vue")
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta: {
          keepAlive: true,
          role: ['sale'],
          name: "信息分类"
        },
        component: () => import("../views/Info/category.vue")
      },
      {
        path: "/infoDetailed",
        name: "infoDetailed",
        
        meta: {
          name: "信息详情",
          role: ['sale'],
          keepAlive: true,
          hidden: true,
        },
        component: () => import("../views/Info/detailed.vue"),
      },
    ]
  },
  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "User",
    meta: {
      role: ['sale'],
      system: 'userSystem', // 自定义key
      name: "用户管理",
      icon: 'user',
      keepAlive:true
    },
    component: Layout,
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        meta: {
          keepAlive: true,
          role: ['sale'],
          name: "用户列表"
        },
        component: () => import("../views/User/index.vue")
      }
    ]
  },
]