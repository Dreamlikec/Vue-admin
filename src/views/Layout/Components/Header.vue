<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMenuState">
      <svg-icon iconClass="menu" class="menu" />
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <img src="../../../assets/images/face.jpg" alt />
        {{ username }}
      </div>

      <div class="header-icon pull-left" @click = 'exit'>
        <svg-icon iconClass="exit" class="exit" />
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from '@vue/composition-api';
export default {
  name: "layoutHeader",
  setup(propsm, context) {
    const navMenuState = () => {
      context.root.$store.commit("app/SET_COLLAPSE");
      // context.root.$store.dispatch("setMenuStatus", { name: "aaa" });
    };
    const username = computed(()=>context.root.$store.state.app.username)
    const exit = () =>{
      context.root.$store.dispatch('app/exit').then(()=>{
        context.root.$router.push({
          name:'Login'
        })
      })
    }
    return {
      navMenuState,
      username,
      exit
    };
  }
};
</script>

<style lang='scss' scoped>
@import "../../../styles/config.scss";
#header-wrap {
  background-color: #344a5f;
  position: fixed;
  left: $navMenu;
  right: 0;
  height: $layoutHeader;
  z-index: 999;
  line-height: 70px;
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0s);
}
.open {
  #header-wrap {
    left: $navMenu;
  }
}
.close {
  #header-wrap {
    left: $navMenuMin;
  }
}
.header-icon {
  padding: 0 30px;
  svg {
    margin-bottom: -7.5px;
    font-size: 20px;
    cursor: pointer;
    fill: currentColor;
    color: #fff;
  }
}
.user-info {
  height: 100%;
  border-right: 1px solid $mainColor;
  padding: 0 32px;
  color: #fff;
  + .header-icon {
    padding: 0 25px;
  }
  img {
    display: inline-block;
    margin-bottom: -12px;
    margin-right: 15px;
    border-radius: 50px;
  }
}
</style>