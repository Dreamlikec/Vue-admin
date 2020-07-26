import { Login } from "@/api/login";
import { setToken,removeToken,removeUserName,setUserName,getUserName } from "@/utils/app";

const state = {
    isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
    // isCollapse: JSON.parse(Cookie.get("isCollapse")) || false,
    to_ken:'',
    username:getUserName() || "",
}
const getters = {
    // 类似于computed
    isCollapse: state => state.isCollapse,
    // count:state => state.count +10
    username:state => state.username
}
const mutations = {
    SET_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse;
        // html5 本地存储
        sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse))
        // Cookie存储
        // Cookie.set("isCollapse",JSON.stringify(state.isCollapse))
    },
    SET_TOKEN(state,value){
        state.to_ken = value;
    },
    SET_USERNAME(state,value){
        state.username = value
    },


}
const actions = {
    login(content, repuestData) {
        return new Promise((resolve, reject) => {
            Login(repuestData).then((response) => {
                console.log(content);
                let data = response.data.data;
                // token username 需要存储到state中
                content.commit('SET_TOKEN',data.token);
                content.commit('SET_USERNAME',data.username);
                // 也需要存储到cookie中
                setToken(data.token)
                setUserName(data.username)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    exit(content){
        return new Promise((resolve,reject)=>{
            removeToken();
            removeUserName();
            content.commit('SET_TOKEN','');
            content.commit('SET_USERNAME','');
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