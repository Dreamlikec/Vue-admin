"use strict";

var _index = _interopRequireDefault(require("./index"));

var _app = require("@/utils/app");

var _index2 = _interopRequireDefault(require("../store/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 声明一个白名单,indexof 方法判断数组中是否存在某个对象
var whiteRouter = ['/login'];

_index["default"].beforeEach(function (to, from, next) {
  // getToken 判断token是否存在
  if ((0, _app.getToken)()) {
    // 路由动态田间，分配菜单，每个角色分配不同的菜单
    // console.log('存在');
    if (to.path == '/login') {
      (0, _app.removeToken)();
      (0, _app.removeUserName)();

      _index2["default"].commit("app/SET_TOKEN", '');

      _index2["default"].commit("app/SET_USERNAME", '');

      next();
    } else {
      // 获取用户角色
      // 动态分配路由权限

      /**
       * 1、什么时候处理动态路由 在进入控制台之前
       * 2、以什么样的条件处理 根据用户觉得
       */
      if (_index2["default"].getters["app/roles"].length === 0) {
        _index2["default"].dispatch('permission/getRoles').then(function (response) {
          var role = response.role; // let button = response.button

          var btnPerm = response.btnPerm;

          _index2["default"].commit('app/SET_ROLES', role);

          _index2["default"].commit('app/SET_BUTTON', btnPerm);

          _index2["default"].dispatch('permission/createRouter', role).then(function (response) {
            var addRouters = _index2["default"].getters["permission/addRouters"];
            var allRouters = _index2["default"].getters["permission/allRouters"]; // 路由更新

            _index["default"].options.routes = allRouters; // 动态添加路由的方法

            _index["default"].addRoutes(addRouters); // ....es6扩展运算符，防止内容发生变化
            // replace:true 不被历史记录


            next(_objectSpread({}, to, {
              replace: true
            }));
          });
        });
      } else {
        next();
      }
    }
  } else {
    if (whiteRouter.indexOf(to.path) !== -1) {
      next();
    } else {
      next('/login');
    }
  } // console.log(to)
  // console.log(from)
  // console.log(next)
  // next()
  // token 令牌验证用户登陆

});