<template>
    <div id="main-wrap">
        <div class = "main-content">
            <div class = "content" v-if="ifshowfunction()">
                        <router-view/>
                </keep-alive> 
            </div>
            <div v-else>
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import { watch,ref } from '@vue/composition-api'
export default{
    setup(props,{root}){
        const showParentdiv = ref(true)
        const ifshowfunction = () =>{
            let currentRoute = root.$route.name
            if(currentRoute === "buildingInfo"){
               return false
            }
            if(currentRoute === "calresult"){
                return false
            }
            return true
        }
        // watch(()=>(root.$route),(val)=>{
        //     let currentRoute = root.$route.name
        //     if(currentRoute === "buildingInfo"){
        //         showParentdiv.value = false
        //     }
        // })
        return{
            showParentdiv,
            ifshowfunction
        }
    }
}
</script>
<style lang='scss' scoped>
@import "../../../styles/config.scss";
#main-wrap{
    height:100vh;
    // position: fixed;
    // left:$navMenu + 30px;
    // top:$layoutHeader + 20px;
    // bottom: 0;
    // right:0;
    box-sizing: border-box;
    box-shadow: 6px 6px 6px 6px rgba(0,0,0,.08);
    border-radius: 12px 0 0 0;
    // z-index: 999;
    // background-color: #fff;
};
.main-content{
    width: 100%;
    height: 100%;
    padding-top: $layoutHeader + 20px;
    padding-left: $navMenu + 30px;
    padding-right:30px;
    box-sizing: border-box;
    @include webkit(transition, all .3s ease 0s);
    @include webkit(box-sizing,border-box);
    overflow:auto
};
.content{
    width: 100%;
    height: 100vh;
    padding:30px;
    @include webkit(box-sizing,border-box);
    background-color:#fff;
}
.open{
.main-content { padding-left: $navMenu + 30px; }
}
.close{
.main-content {padding-left: $navMenuMin + 30px;}
}
</style>