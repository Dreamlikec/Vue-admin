<template>
    <div>
        <el-tabs :tab-position="data.tabPosition" class="tabheight" type="">
            <el-tab-pane label="方案一：" style = "background-color: white;">用户管理</el-tab-pane>
            <el-tab-pane label="方案二：" style = "background-color: white;">配置管理</el-tab-pane>
            <el-tab-pane label="方案三：" style = "background-color: white;">角色管理</el-tab-pane>
            <el-tab-pane label="方案四：" style = "background-color: white;">
            定时任务补偿</el-tab-pane>   
        </el-tabs>
        <el-button @click="data.drawer = true" type="primary" style="margin-left: 16px;">点我打开</el-button>
        <el-drawer
            title="我是标题"
            :visible.sync="data.drawer"
            :direction="data.direction"
            :before-close="handleClose"
            :modal-append-to-body="false">
            <span>我来啦!</span>
        </el-drawer>
    </div>
</template>
<script>
import { reactive } from '@vue/composition-api'
export default {
    name:"sizing",
    setup(props,{root}){
        const data = reactive({
            tabPosition : "left",
            drawer: false,
            direction: 'rtl',

        })
        const handleClose = done =>{
            
        }
        return{
            data
        }
    }
}
</script>
<style lang="scss" scoped>
.el-tabs__item.is-active {
  color: $viceColor !important;
  background-color: $mainColor !important;
}
.tabheight{
    box-sizing: border-box;
    
}
</style>