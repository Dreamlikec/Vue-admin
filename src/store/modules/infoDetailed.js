const state = {
    // 已经存储了值，不刷新页面的时候，值一直存在vueX，如果刷新页面，就会取session的值，赋值给变量
    id:""||sessionStorage.getItem('infoId'),
    title:""||sessionStorage.getItem('infoTitle'),
}
const getters = {
    infoId: state => state.id,
    infoTitle: state => state.title
}
const mutations = {
    // SET_ID(state,value){
        
    //     state.id = value
    //     // html 本地存储
    //     sessionStorage.setItem("infoId",value)
    // },
    // SET_TITLE(state,value){
    //     state.title = value
    //     // html 本地存储
    //     sessionStorage.setItem("inTitle",value)
    // },
    UPDATE_STATE_VALUE(state,params){
        for(let key in params){
            state[key] = params[key].UPDATE_STATE_VALUE
            if(params[key].session){
                sessionStorage.setItem(params[key].sessionKey,params[key].value)
            }
        }
    }
}
const actions = {
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}