<template>
    <div id='layout' :class="[menuStatus ? 'close':'open']">
        <layoutHeader/>
        <LayoutMain/>
        <LayoutNav/>
    </div>
</template>
<script>

import { reactive, ref, isRef, toRefs, onMounted,computed } from "@vue/composition-api";
import LayoutHeader from './Components/Header'
import LayoutMain from './Components/Main'
import LayoutNav from './Components/Nav'
export default {
    name:'Layout',
    components:{
        LayoutHeader,LayoutMain,LayoutNav
    },

    setup(props,context){
        const menuStatus = computed(()=> context.root.$store.state.app.isCollapse)
        return{
            menuStatus
        }
    }


}
</script>
<style lang="scss" scoped>
#layout{
   position: fixed;
   background-color: #ebeff2;
   display: block;
   top: 0;
   bottom: 0;
   right: 0;
   left: 0;
   z-index: 0;
}

</style>