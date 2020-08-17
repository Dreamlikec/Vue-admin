const state = {
    // isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
    // // isCollapse: JSON.parse(Cookie.get("isCollapse")) || false,
    // to_ken:'',
    // username:getUserName() || "",
    loadsHeader:[],
    loadsPercentResult:{
        clper:[],
        htper:[]
    },
    paramsData:JSON.parse(sessionStorage.getItem("paramsData")),
    resultData:JSON.parse(sessionStorage.getItem("resultData"))
}
const getters = {
    loadsHeader: state => state.loadsHeader,
    totalObj:state=> state.loadsPercentResult,
    ParamsData:state => state.ParamsData,
    resultData:state => state.resultData
}
const mutations = {
    SET_LOADSHEADER(state,value) {
        state.loadsHeader = value
        // state.isCollapse = !state.isCollapse;
        // html5 本地存储
        // sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse))
        // Cookie存储
        // Cookie.set("isCollapse",JSON.stringify(state.isCollapse))
    },
    SET_HTPERCENT(state,value){
        state.loadsPercentResult.htper = value
    },
    SET_CLPERCENT(state,value){
        state.loadsPercentResult.clper = value
    },
    SET_PARAMSDATA(state,value){
        state.paramsData = value
        // html5本地存储
        sessionStorage.setItem("paramsData",JSON.stringify(state.paramsData))
    },
    SET_RESULTDATA(state,value){
        state.resultData = value
        sessionStorage.setItem("resultData",JSON.stringify(state.resultData))
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