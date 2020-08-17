import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import Login from "../views/Login/index.vue";
// 引入布局组件
import Layout from "../views/Layout/index.vue";

Vue.use(VueRouter);
Vue.use(Layout);
const routes = [
  {
    path: "/",
    redirect: "Login",
    hidden: true,
    meta: {
      name: "主页",
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta: {
      name: "登陆",
    },
    component: Login
  },
  {
    path: "/console",
    name: "Console",
    redirect: "index",
    meta: {
      name: '控制台',
      icon: "console"
    },
    component: Layout,
    children: [{
      path: "/index",
      name: "index",
      meta: {
        name: "首页",
      },
      component: () => import("../views/Console/index.vue"),
    }
    ]
  },
  {
    path:"/Loads",
    name:"Loads",
    meta:{
      name:"负荷估算",
      icon:"loads"
    },
    component:Layout,
    children:[{
      path:"/buildingInfo",
      name:"buildingInfo",
      meta:{
        name:"建筑信息",
        keepAlive:true
      },
      component:()=> import("../views/Loads/index.vue")
    },{
      path:"/calresult",
      name:"calresult",
      meta:{
        name:"计算结果"
      },
      component:()=> import("../views/Loads/CalResult.vue")
    }]
  },
  {
    path: "/info",
    name: "Info",
    meta: {
      name: '信息管理',
      icon: "info"
    },
    component: Layout,
    children: [{
      path: "/infoindex",
      name: "infoindex",
      meta: {
        name: "信息列表",
      },
      component: () => import("../views/Info/index.vue"),
    },{
      path: "/infoCategory",
      name: "infoCategory",
      meta: {
        name: "信息分类",
      },
      component: () => import("../views/Info/category.vue"),
    },{
      path: "/infoDetailed",
      name: "infoDetailed",
      hidden:true,
      meta: {
        name: "信息详情",
      },
      component: () => import("../views/Info/detailed.vue"),
    },
    ]
  },
  {
    path: "/user",
    name: "User",

    meta: {
      name: '用户管理',
      icon: "user"
    },
    component: Layout,
    children: [{
      path: "/userIndex",
      name: "UserIndex",
      meta: {
        name: "用户列表"
      },
      component: () => import("../views/User/index.vue"),
    }
    ]
  },
];

const router = new VueRouter({
  routes,
  Layout
});

export default router;
