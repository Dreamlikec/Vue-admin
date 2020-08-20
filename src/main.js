import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueCompositionApi from "@vue/composition-api"; 
import "./router/permit";
// 直接定义全局组件
import "./icons/index";
// 自定义全局方法
// import global from "@/utils/global";
import echarts from 'echarts';
// echarts 挂载到vue的圆形上
// import "./styles/EchartsTheme/westeros.project";
// Vue.prototype.$echarts = echarts
// 引入按钮权限,注册一个全局方法
import {buttonPermission} from "./utils/buttonPermission"
Vue.prototype.btnPerm = buttonPermission
// 引入自定义指令
import "./utils/buttonPermDirective"

// Vue.use(global);
Vue.use(VueCompositionApi);
Vue.use(ElementUI);
Vue.config.productionTip = false;
// 路由守卫

// runtime 运行模式
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
