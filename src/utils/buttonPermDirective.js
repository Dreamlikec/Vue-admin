import Vue from 'vue';
import store from '../store/index.js';
// 自定义指令
Vue.directive("btnPerm",{
    bind:function(el,bingind,vnode){
      // 操作DOM元素
      if(bingind.def.hasBtnPerm(bingind.value)){
        // el.style.display ="none"
        el.className = el.className + " show-button"
      }
    },
    inserted:function(){},
    updated:function() {},
    componentUpdated:function(){},
    unbind:function(){},
    hasBtnPerm:function(permission){
      const button = store.getters['app/buttonPermission']
      const roles = store.getters['app/roles']
      // 如果是超级管理员就执行下面一段代码  
      if(roles.includes('admin')){ return true}
      return button.indexOf(permission) != -1
    }
  })