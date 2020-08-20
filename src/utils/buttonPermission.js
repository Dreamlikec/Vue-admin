import store from "../store/index"
export function buttonPermission(permission){
    const roles = store.getters['app/roles']
    // 如果是超级管理员就执行下面一段代码  
    if(roles.includes('admin')){ return true}
    const button = store.getters['app/buttonPermission']
    return button.indexOf(permission) != -1
}