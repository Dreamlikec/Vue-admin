import router from "./index";
import { getToken,removeToken,removeUserName } from "@/utils/app";
import store from "../store/index";
// 声明一个白名单,indexof 方法判断数组中是否存在某个对象
const whiteRouter = ['/login'] 

router.beforeEach((to, from, next) => {
    // getToken 判断token是否存在
    if (getToken()) {
        // 路由动态田间，分配菜单，每个角色分配不同的菜单
        // console.log('存在');
        if (to.path == '/login') {
            removeToken();
            removeUserName();
            store.commit("app/SET_TOKEN",'');
            store.commit("app/SET_USERNAME",'');
            next();
        } else {
            // 获取用户角色
            // 动态分配路由权限
            /**
             * 1、什么时候处理动态路由 在进入控制台之前
             * 2、以什么样的条件处理 根据用户觉得
             */
            if(store.getters["app/roles"].length === 0){
                store.dispatch('permission/getRoles').then(response=>{
                    let role = response.role
                    // let button = response.button
                    let btnPerm = response.btnPerm
                    store.commit('app/SET_ROLES',role)
                    store.commit('app/SET_BUTTON',btnPerm)
                    store.dispatch('permission/createRouter',role).then(response=>{
                        let addRouters = store.getters["permission/addRouters"]
                        let allRouters = store.getters["permission/allRouters"]
                        // 路由更新
                        router.options.routes = allRouters
                        // 动态添加路由的方法
                        router.addRoutes(addRouters)
                        // ....es6扩展运算符，防止内容发生变化
                        // replace:true 不被历史记录
                        next({...to,replace:true})
                    })
                    
                })
            }else{
                next();
            }
            
            
        }

    } else {
        if (whiteRouter.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
        }
    }
    // console.log(to)
    // console.log(from)
    // console.log(next)
    // next()
    // token 令牌验证用户登陆
})