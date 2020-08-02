<template>
  <el-dialog
    title="新增"
    :visible.sync="dialog_Info_flag"
    @close="close"
    :modal-append-to-body="false"
    @opened ="openDialog"
  >
    <el-form :model="form" ref = "addInfoForm">
      <el-form-item label="类别：" :label-width="formLabelWidth" prop="category">
        <el-select v-model="form.category" placeholder="请选择活动区域">
          <el-option v-for="item in categoryOptions.item" :key="item.id" :label="item.category_name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标题：" :label-width="formLabelWidth"  prop="title">
        <el-input v-model="form.title" autocomplete="off" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="概况：" :label-width="formLabelWidth" prop="content">
        <el-input type="textarea" v-model="form.content" autocomplete="off" placeholder="请输入内容" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="submitLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { AddInfo,Getlist } from "@/api/news";
import { reactive, ref, watch, watchEffect } from "@vue/composition-api";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category:{
      type:Array,
      default:()=>[]
    }
  },
  setup(props, { emit,root,refs }) {
    
    const dialog_Info_flag = ref(false);
    const formLabelWidth = ref("70px");
    const form = reactive({
      category : "",
      title : "",
      content : ""
    });
    const categoryOptions = reactive({
      item:[]
    })
    const submitLoading = ref(false);
    // watch 监听
    watchEffect(() => {
      dialog_Info_flag.value = props.flag;
    });

    const close = () => {
      dialog_Info_flag.value = false;
      resetForm()
      emit("update:flag", false);
      
      // this.$emit("close",false)
      // 回调时需要逻辑处理的时候，就不能用修饰器，反之，可以用修饰器
    };

    // watch(()=> form.category,(value)=>{
    //   console.log(value)
    // })

    const openDialog =()=>{
      categoryOptions.item = props.category
    }
    const resetForm = () =>{
      refs.addInfoForm.resetFields()
    }

    const submit =()=>{
      let requestData = {
        // category: form.category,
        // title: form.title,
        // content: form.content,
        categoryId:form.category,
        title: form.title,
        imgUrl: "http://********",
        createDate: new Date(),
        content: form.content
      }
      if (!form.category){
        root.$message({
          message:"分类不能为空",
          type:'error'
        })
        return false
      }
      submitLoading.value = true
      AddInfo(requestData).then(response=>{
        let data = response.data
        root.$message({
          message:data.message,
          type:'success'
        })
        submitLoading.value = false
        // 重置表单
        resetForm()
        // root.$ref['addInfoForm'].resetFields()
        close()
        emit("getList")
      }).catch(error=>{
        // submitLoading.value = true
      })
    }


    return {
      //  ref
      dialog_Info_flag,
      formLabelWidth,
      submitLoading,
      // reactive
      form,categoryOptions,
      // methods
      close,openDialog,submit
    };
  }

  //   watch: {
  //     flag: {
  //       handler(newValue, oldValue) {
  //         this.dialog_Info_flag = newValue;
  //       }
  //     }
  //   }
};
</script>
<style lang="" scoped>
</style>