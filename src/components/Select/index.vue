<template>
  <el-select v-model="data.selectValue" placeholder="请选择" @change="select">
    <el-option
      v-for="item in data.initOption"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    ></el-option>
  </el-select>
</template>
<script>
import {
  reactive,
  ref,
  isRef,
  toRefs,
  onMounted,
  onUnmounted,
  watch
} from "@vue/composition-api";

export default {
    name:"SelectVue",
    props:{
        config:{
            type:Object,
            default:()=>{}
        },
        selectData:{
            type:Object,
            default:()=>{}
        }
    },
    setup(props,{root,emit}){   
        const data = reactive({
            selectValue:"",
            initOption:[],
            options:[
                {value:"truename",label:"姓名"},
                {value:"phone",label:"手机号"},
                {value:"email",label:"邮箱"},
                {value:"id",label:"ID"},
                {value:"title",label:"标题"},
            ]
        })
        // 选择触发
        const select = (val)=>{
            let filterdata = data.options.filter(item => item.value === val)[0]
            console.log(filterdata)
            emit("update:selectData",filterdata)
        }
        // 初始化下拉选项
        let initOption =()=>{
            let initData = props.config.init;
            let optionArr = [];
            if(initData.length === 0){
                return false
            }
            initData.forEach(item=>{
                let arr = data.options.filter(elem => elem.value === item)
                if(arr.length > 0){
                    optionArr.push(arr[0])
                }
            })
            if(optionArr.length ===0){
                return false
            }
            // 初始化赋值
            data.initOption = optionArr
            //  初始化搜索类型
            data.selectValue = optionArr[0].value
        }
        onMounted(()=>{
            initOption()
        })
        return{
            data,select
        }
    }
};
</script>
<style lang="" scoped>
</style>