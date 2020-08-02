<template>
  <el-dialog
    title="修改"
    :visible.sync="dialog_Info_flag"
    @close="close"
    :modal-append-to-body="false"
    @opened="openDialog"
  >
    <el-form :model="form" ref="editInfoForm">
      <el-form-item label="类别：" :label-width="formLabelWidth">
        <el-select v-model="form.category" placeholder="请选择活动区域">
          <el-option
            v-for="item in categoryOptions.item"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标题：" :label-width="formLabelWidth">
        <el-input v-model="form.title" autocomplete="off" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="概况：" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="form.content" autocomplete="off" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="submitLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { AddInfo,Getlist,EditInfo } from "@/api/news";
import { reactive, ref, watch, watchEffect, useCSSModule } from "@vue/composition-api";
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
    },
    id:{
      type:String,
      default:()=>[]
    },

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
      console.log(props.id)
      getInfo()
      categoryOptions.item = props.category
    }

    const getInfo = () =>{
        let requestData = {
            pageNumber:1,
            pageSize:1,
            id:props.id
        }
        Getlist(requestData).then(response=>{
            let responseData = response.data.data.data[0];
            form.category = responseData.categoryId;
            form.title = responseData.title;
            form.content = responseData.content
        })
    }
    const resetForm = () =>{
    //   form.category = "",
    //   form.title ="",
    //   form.content = ""
      refs.editInfoForm.resetFields()
    }

    const submit =()=>{
      let requestData = {
        id: props.id,
        categoryId: form.category,
        title: form.title,
        content: form.content,
        imgUrl: '',
      }
      if (!form.category){
        root.$message({
          message:"分类不能为空",
          type:'error'
        })
        return false
      }
      submitLoading.value = true
      EditInfo(requestData).then(response=>{
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
        /**
         * 两种刷新数据的方式
         * 1.直接刷新接口
         * 2.返回列表,手动修改指定的数据
         * **这里采用emit调用父组件的一个方法
         */
        emit("getList","");
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