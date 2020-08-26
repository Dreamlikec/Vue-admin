"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asnycRouterMap = exports["default"] = exports.defaultRouterMap = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Layout = _interopRequireDefault(require("@/views/Layout"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_vue["default"].use(_vueRouter["default"]);
/**
 * 1、系统分配
 * 2、角色分配
 * 3、按钮级别分配
 *
 * 工作：路由是前台配，还是后台配的问题？
 * 
 * 个人建议，前端配置，这样才能达到前后端分离的工作；
 * 
 * 1、后台配置路由，前端人不在的情况；没办法页面跳转；
 * 2、新的需求，前端把路由配好了，后台的人不在，没办法找到路由；
 * 
 */

/**
 * 
 * 1、默认路由
 * 2、动态路由
 */
// 引入布局组件


/**
 * 默认路由
 */
var defaultRouterMap = [{
  path: "/",
  redirect: "login",
  name: "index",
  meta: {
    name: "主页",
    hidden: true
  }
}, {
  path: "/login",
  name: "Login",
  meta: {
    name: "登录",
    hidden: true
  },
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("../views/Login/index.vue"));
    });
  }
}, {
  path: "/console",
  name: "Console",
  redirect: "index",
  meta: {
    keepAlive: true,
    name: "控制台",
    icon: 'console'
  },
  component: _Layout["default"],
  children: [{
    path: "/index",
    name: "Index",
    meta: {
      keepAlive: true,
      name: "首页"
    },
    component: function component(resolve) {
      return require(["@/views/Console/index.vue"], resolve);
    }
  }]
}, {
  path: "/Loads",
  name: "Loads",
  meta: {
    keepAlive: true,
    name: "负荷估算",
    icon: "loads"
  },
  component: _Layout["default"],
  children: [{
    path: "/buildingInfo",
    name: "buildingInfo",
    meta: {
      role: ['manager'],
      name: "建筑信息",
      keepAlive: true
    },
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("../views/Loads/index.vue"));
      });
    }
  }, {
    path: "/calresult",
    name: "calresult",
    hidden: true,
    meta: {
      role: ['manager'],
      name: "计算结果",
      keepAlive: true,
      hidden: true
    },
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("../views/Loads/CalResult.vue"));
      });
    }
  }]
}];
exports.defaultRouterMap = defaultRouterMap;

var _default = new _vueRouter["default"]({
  mode: 'hash',
  scrollBehavior: function scrollBehavior() {
    return {
      y: 0
    };
  },
  routes: defaultRouterMap
});
/**
 * 动态路由
 * 角色：sale, technician, manager
 */


exports["default"] = _default;
var asnycRouterMap = [{
  path: "/info",
  name: "Info",
  meta: {
    role: ['sale'],
    system: 'infoSystem',
    name: "信息管理",
    icon: 'info',
    keepAlive: true
  },
  component: _Layout["default"],
  children: [{
    path: "/infoIndex",
    name: "InfoIndex",
    meta: {
      keepAlive: true,
      role: ['sale'],
      name: "信息列表"
    },
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("../views/Info/index.vue"));
      });
    }
  }, {
    path: "/infoCategory",
    name: "InfoCategory",
    meta: {
      keepAlive: true,
      role: ['sale'],
      name: "信息分类"
    },
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("../views/Info/category.vue"));
      });
    }
  }, {
    path: "/infoDetailed",
    name: "infoDetailed",
    meta: {
      name: "信息详情",
      role: ['sale'],
      keepAlive: true,
      hidden: true
    },
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("../views/Info/detailed.vue"));
      });
    }
  }]
},
/**
 * 用户管理
 */
{
  path: "/user",
  name: "User",
  meta: {
    role: ['sale'],
    system: 'userSystem',
    // 自定义key
    name: "用户管理",
    icon: 'user',
    keepAlive: true
  },
  component: _Layout["default"],
  children: [{
    path: "/userIndex",
    name: "UserIndex",
    meta: {
      keepAlive: true,
      role: ['sale'],
      name: "用户列表"
    },
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("../views/User/index.vue"));
      });
    }
  }]
}];
exports.asnycRouterMap = asnycRouterMap;