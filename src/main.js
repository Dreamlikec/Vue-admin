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
