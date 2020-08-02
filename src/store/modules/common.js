import { GetCategory } from "@/api/news";
const state = {
    qiniuUrl:""
}
const getters = {
    qiniuUrl:state => state.qiniuUrl
}
const actions = {
    getCategory(content, repuestData) {
        return new Promise((resolve, reject) => {
            GetCategory({}).then((response) => {
                resolve(response.data.data.data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions
}