<template>
    <div>
        <el-row >
            <el-col :span="20">
                <div class="label-wrap">
                    <label>关键字：</label>
                    <div class="wrap=content">
                        <el-row :gutter="16">
                            <el-col :span="3">
                                <SelectVue :config="data.configOption" :selectData.sync="data.selectData"/>
                            </el-col>
                            <el-col :span="4">
                                <el-input v-model="data.keyword" placeholder="请输入关键字"></el-input>
                            </el-col>
                            <el-col :span="5">
                                <el-button @click="search">搜索</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-col>
        
            <el-col :span="4">
                <el-button type="primary" class="pull-right" @click="handlerAdd()">增加用户</el-button>
            </el-col>
        </el-row>
        <div class="blanck-space-30"></div>
        
        <TableVue ref="userTable" :config="data.configTable" :tableRow.sync="data.tableRow">
        <!-- 插槽 -->
            <template v-slot:status="slotData">
                <el-switch @change="handlerSwitch(slotData.data)" v-model="slotData.data.status" active-value="2" inactive-value="1" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </template>
            <template v-slot:operation="slotData">
                <el-button size="small" @click="handlerEdit(slotData.data)">编辑</el-button>
                <el-button size="small" type="danger"  @click="handlerDel(slotData.data)">删除</el-button>
            </template>
            <template v-slot:tableFooterLeft>
                <el-button size="small" type="danger" @click="handlerBatchDel()">批量删除</el-button>
            </template>
        </TableVue>
        <DialogAdd :flag.sync="data.dialog_add" :editData="data.editData" @refreshTableData="refreshData"/>
    </div>
</template>
<script>
import { reactive, ref, isRef, toRefs, onMounted, onUnmounted, watch} from "@vue/composition-api";
import { global } from "@/utils/global3.0";
import { UserDel,UserActives} from '@/api/users';
import SelectVue from "@c/Select";
import TableVue from "@c/Table";
import DialogAdd from "./dialog/add";
// 中央事件
import Bus from '@/utils/bus';
export default {
    name:"userIndex",
    components:{SelectVue,TableVue,DialogAdd},
    setup(props,{root,refs}){
        const userTable = ref(null)
        // 事件总成的方法组件通讯
        // const busEvent = () =>{
        //     Bus.$emit('showFun',{aaa:"222"})
        // }
        // const busEvent = () =>{
        //     Bus.$emit('showFun',{aaa:"222"})
        // }
        const { confirm } = global();
        const data = reactive({
            // table选择的数据
            tableRow:{},
            dialog_add:false,
            configOption:{
                init:["truename", "phone"],
            },
            // 搜索关键字
            keyword:"",
            configTable:{
                // 下拉菜单接收的数据
                selectData:{},
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
                editData:{},
                // 阻止状态
                updataUserStatusFlag:false,
                paginationLayout:"total,sizes,prev,pager,next,jumper",
                paginationShow:true
                }
            }
           
        )
        const search = () =>{
            let requestData = {
                [data.selectData.value] : data.keyword
            }
            refs.userTable.paramsLoadData(requestData)
        }

        const handlerBatchDel = () => {
            let userId = data.tableRow.idItem
            if(!userId || userId.length === 0) {
                root.$message({
                    message: "请勾选需要删除的用户！！",
                    type: "error"
                })
                return false;
            }
            confirm({
                content: "确认删除当前信息，确认后将无法恢复！！",
                tip: "警告",
                fn: userDelete
            })
            
        }
        const refreshData = () => {
            userTable.value.refreshData()
        }

        // 删除用户
        const userDelete = () => {
            UserDel({ id: data.tableRow.idItem }).then(response => {
                // 其中一种写法
                refs.userTable.refreshData()
                // 第二种写法
                // refreshData()
            })
        }

        const handlerDel = (params) => {
            data.tableRow.idItem = [params.id]
            confirm({
                content: "确认删除当前信息，确认后将无法恢复！！",
                tip: "警告",
                fn: userDelete
            })
        }

        /**
         * 添加用户
         */
        const handlerAdd = () => {
            data.dialog_add = true;
            // 子组件赋值
            data.editData = Object.assign({});
        }

        const handlerEdit = (params) =>{
            // 打开子组件对话框窗口
            data.dialog_add = true
            // 给子组件赋值
            data.editData = Object.assign({},params)
        }

        const handlerSwitch =(params)=>{
            if(data.updataUserStatusFlag) {return false}
            data.updataUserStatusFlag = true
            let requestData ={
                id:params.id,
                status:params.status
            }
            UserActives(requestData).then(response=>{
                root.$message({
                    message:response.data.message,
                    type:"success"
                })
                data.updataUserStatusFlag = false
            }).catch(error=>{
                data.updataUserStatusFlag = false
            })
        }
        return{
            data,
            handlerDel,
            handlerBatchDel,
            userDelete,
            userTable,
            refreshData,
            handlerSwitch,
            handlerAdd,
            handlerEdit,
            search
            // busEvent
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