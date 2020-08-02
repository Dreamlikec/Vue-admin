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
            next();
        }

    } else {
        console.log('不存在')
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