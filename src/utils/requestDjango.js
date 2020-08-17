import axios from 'axios'
import { outputDir } from '../../vue.config';
import { Message} from 'element-ui';
import {getToken,getUserName} from "@/utils/app";

const CALURL = process.env.NODE_ENV === 'production'? '/':'/Django';
const service = axios.create({
    baseURL:CALURL,
    timeout:200000,
});

// 添加请求拦截器
// 请求接口之前，做一些数据拦截（请求拦截器）
// service.interceptors.request.use(function (config) {
//     // 在发送请求之前做些什么
//     // Tokey userId sui 后台需要前端这边传送相关参数（在请求头添加参数）
//     config.headers['Tokey'] = getToken()
//     config.headers['UserName'] = getUserName()
//     return config;
//   }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   });

// 添加响应拦截器
// 请求接口之后，当数据返回时进行拦截（响应拦截器）
// service.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   let data = response.data
//   if(data.resCode !== 0){
//     Message.error(data.message);
//     return Promise.reject(data);
//   }else{
//     return response;
//     return Promise.resolve
//   }   
//   },function (error) {
//     // 对响应错误做点什么
//     return Promise.reject(error);
//   });



export default service;
/**
 * 使用export default时，但不能同时存在多个default
 * 文件 import 不需要花括号，
 */