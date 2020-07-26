import cookie from "cookie_js";
const admintoken = 'admin_toKen';
const usernameKey = "username";

export function getToken(){
    return cookie.get(admintoken);
}

export function setToken(toKen){
    return cookie.set(admintoken,toKen)
}

export function removeToken(toKen){
    return cookie.remove(admintoken)
}

export function setUserName(value){
    return cookie.set(usernameKey,value)
}

export function getUserName(){
    return cookie.get(usernameKey)
}

export function removeUserName(){
    return cookie.remove(usernameKey)
}
