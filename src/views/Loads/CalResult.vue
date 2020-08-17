<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12" >
                <div>
                   <LoadsBar :config.sync="data.config"  class="cardChart"/>        
                </div>
            </el-col>
            <el-col :span="12" >
                <div>
                    <LoadsPie class="cardChart"/>
                </div>
            </el-col>        
        </el-row>
        <el-row>
            <el-col>
                <div class="cardTable">
                    <el-divider>
                        <span class="TableTitle">区域负荷及耗热量统计表</span>
                    </el-divider>
                    <div class="blanck-space-50"></div>
                    <LoadsTable :config.sync="data.config"/>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import LoadsBar from "./EchartsComponents/Bar";
import LoadsPie from "./EchartsComponents/Pie";
import LoadsTable from "./EchartsComponents/Table";

import { reactive,onMounted,updated, watch } from '@vue/composition-api';
export default {
    name:"calResult",
    components:{ LoadsBar,LoadsPie,LoadsTable },
    setup(props,{root}){
        const data = reactive({
            config:root.$route.query.data,
            reqInfo:{}
        })
        return{
            data
        }
    }
}
</script>
<style lang="scss" scoped>
.cardChart{
    background-color: #fff;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    border-radius: 5px;
    padding: 20px;
    width: 100%;
    height: 500px;
}
.cardTable{
    background-color: #fff;
    margin-top: 20px;
    padding: 50px;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    border-radius: 5px;
    bottom: 0px;

    // position: absolute;
}
.TableTitle{
    display: table;
    text-align: center;
    vertical-align: middle;
    margin: 0 auto;
    font-size: 18px;
    font-weight: 600;
}
</style>