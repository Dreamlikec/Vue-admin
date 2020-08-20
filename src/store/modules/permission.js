import {getUserRole} from "@/api/login";
import { defaultRouterMap,asnycRouterMap } from "@/router"
import router from "../../router";

function hasPermission(roles, router){
    if(router.meta && router.meta.role) {
        return roles.some(item => router.meta.role.indexOf(item) >= 0)
    }
}

const state = {
    // 整体路由
    allRouters:defaultRouterMap,
    // 新增路由
    addRouters:[]
}
const getters = {

    allRouters:state => state.allRouters,
    addRouters:state => state.addRouters
}
const mutations = {
    SET_ROUTER(state,router){
        state.addRouters = router
        state.allRouters = defaultRouterMap.concat(router)
    }
}
const actions = {
    /**
     * 获取用户角色
     * @param {*} param0 
     * @param {*} requestData 
     */
    getRoles({commit},requestData){
        return new Promise((resolve,reject)=>{
            getUserRole().then(response=>{
                let role = response.data.data
                // commit("SET_ROLES",role)
                resolve(role)
            })
        })
    },
    /**
     * 创建动态路由
     */
    createRouter({commit},requestData){
        return new Promise((resolve,reject)=>{
            let role = requestData
            
            // 超管的状态
            let addRouters = []
            if(role.includes('admin')){
                addRouters = asnycRouterMap
            }else{
                // 如果是普通管理员的话就要取匹配
                addRouters = asnycRouterMap.filter(item =>{
                    // es6 数组匹配的方法 includes
                    // if(role.includes(item.meta.system)){
                    //     return item;}
                    if(hasPermission(role,item)){
                        if(item.children && item.children.length > 0) {
                            item.children = item.children.filter(child => {
                                if(hasPermission(role, child)){
                                    return child;
                                }
                            })
                            return item;
                        }
                        return item
                    }
                    // if(hasPremission(role,item)){
                    //     return item
                    // }
                })
            }

            // 更新路由
            commit('SET_ROUTER',addRouters)
            resolve()
        })
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}