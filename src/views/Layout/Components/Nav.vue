<template>
  <div id="nav-wrap">
    <h1 class="logo">
      <img src="../../../assets/logo.png" alt />
      <span>Nice Energy</span>
    </h1>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#6c757d"
      active-text-color="#344a5f"
      router
    >
      <template v-for="(item, index) in routers">
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index+''">
          <!-- 一级菜单 -->
          <template slot="title">
            <!-- <i :class="item.meta.icon"></i> -->
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
            <span slot="title">{{ item.meta.name }}</span>
          </template>
          <!-- 子菜单 -->
          <el-menu-item
            v-for="subitem in item.children"
            :key="subitem.id"
            :index="subitem.path"
          >{{subitem.meta.name}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
import {
  reactive,
  ref,
  isRef,
  toRefs,
  onMounted,
  computed
} from "@vue/composition-api";
export default {
  name: "navMenu",
  setup(props, context) {
    // data 数据
    const routers = reactive(context.root.$router.options.routes);
    // computed 监听isCollapse的状态
    const isCollapse = computed(() => context.root.$store.state.app.isCollapse);
    // context.root.$store.commit('SET_COUNT',100)
    return {
      isCollapse,
      routers
    };
  }
};
</script>
<style lang='scss' scoped>
@import "../../../styles/config.scss";
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #fff;
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0s);
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
}
.open {
  #nav-wrap {
    width: $navMenu;
  }
}
.close {
  #nav-wrap {
    width: $navMenuMin;
  }
  .logo img {
    margin: auto;
    width: 70%;
    @include webkit(transition,all .3s ease 0s)
  }
  .logo span{
    font-size:14px;
    @include webkit(transition, all 0.3s ease 0s);
    
  }

}

.logo {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
  img {
    width: 70px;
    margin-bottom: 5px;
  }
  span {
    display: block;
    font-family: "Bauhaus 93";
    font-size: 20px;
    color: $viceColor;
  }
}
</style>