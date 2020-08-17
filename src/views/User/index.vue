<template>
    <div>
        <el-row >
            <el-col :span="20">
                <div class="label-wrap">
                    <label>关键字：</label>
                    <div class="wrap=content">
                        <el-row :gutter="16">
                            <el-col :span="3">
                                <SelectVue :config="data.configOption"/>
                            </el-col>
                            <el-col :span="4">
                                <el-input  placeholder="请输入关键字"></el-input>
                            </el-col>
                            <el-col :span="5">
                                <el-button >搜索</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-col>
        
            <el-col :span="4">
                <el-button type="primary" class="pull-right" @click="data.dialog_add = true">增加用户</el-button>
            </el-col>
        </el-row>
        <div class="blanck-space-30"></div>
        <TableVue :config="data.configTable">
        <!-- 插槽 -->
            <template v-slot:status="slotData">
                <el-switch active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </template>
            <template v-slot:operation="slotData">
                <el-button size="small" @click="operation(slotData.data)">编辑</el-button>
                <el-button size="small" type="danger"  @click="operation(slotData.data)">删除</el-button>
            </template>
        </TableVue>
        <DialogAdd :flag.sync="data.dialog_add" />
    </div>
</template>
<script>
import { reactive, ref, isRef, toRefs, onMounted, onUnmounted, watch} from "@vue/composition-api";
import SelectVue from "@c/Select";
import TableVue from "@c/Table";
import DialogAdd from "./dialog/add";
export default {
    name:"userIndex",
    components:{SelectVue,TableVue,DialogAdd},
    setup(props,context){
        
        const data = reactive({
            dialog_add:false,
            configOption:{
                init:["name","phone","email"],
            },
            configTable:{
                // 多选框
                selection:true,
                // 翻页记录checkbox,
                recordCheckbox:true,
                // 表头
                tHead:[
                    {
                        label:"邮箱/用户名",
                        field:"username"
                    },
                    {
                        label:"真实姓名",
                        field:"truename"
                    },
                    {
                        label:"手机号",
                        field:"phone"
                    },
                    {
                        label:"地区",
                        field:"region"
                    },
                    {
                        label:"角色",
                        field:"role"
                    },
                    {
                        label:"禁启用状态",
                        field:"status",
                        columnType:"slot",
                        slotName:"status"
                    },
                    {
                        label:"操作",
                        columnType:"slot",
                        slotName:"operation"
                    },
                ],
                requestData:{
                    url:"getUserList",
                    method:"post",
                    data:{
                        pageNumber:1,
                        pageSize:10
                    }

                },
                paginationLayout:"total,sizes,prev,pager,next,jumper",
                paginationShow:true
                }
            }
           
           
        )
        let operation = (params)=>{
            
        }
        return{
            data,
            operation
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
    @include labelDom(left, 60, 40);
}
</style>