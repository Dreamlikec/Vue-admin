<template>
    <div id="main-wrap">
        <div class = "main-content">
            <div class = "content">
                <router-view/>
            </div>
        </div>
        <router-view/>
    </div>
</template>
<script>
export default{

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
    };
    .content{
        width: 100%;
        height: 100%;
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