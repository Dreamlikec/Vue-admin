<template>
  <div id="category">
    <el-button @click="addFirst({type:'category_first_add'})">添加一级分类</el-button>
    <hr class="hr-e9e9e9" />
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-wrap">
            <div class="category" v-for="item in category.item" :key="item.id" ref="categoryForm">
              <h4>
                <svg-icon icon-class="plus"></svg-icon>
                {{item.category_name}}
                <div class="button-group">
                  <el-button
                    size="mini"
                    round
                    @click="editCategory({ data: item,type:'category_first_edit' })"
                  >编辑</el-button>
                  <el-button size="mini" round @click="handlerAddChildren({ data: item,type:'category_children_add' })">添加子集</el-button>
                  <el-button
                    size="mini"
                    round
                    type="danger"
                    @click="deleteCategoryConfirm(item.id)"
                  >删除</el-button>
                </div>
              </h4>
              <ul v-if="item.children">
                <li v-for="children in item.children" :key="children.id">
                  {{children.category_name}}
                  <div class="button-group">
                    <el-button size="mini" round>编辑</el-button>
                    <el-button size="mini" round type="danger" @click="deleteCategory(item.id)">删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form label-width="142px" class="form-wrap">
            <el-form-item label="一级菜单名称" v-if="category_first_input">
              <el-input v-model="form.categoryName" :disabled="category_first_disabled"></el-input>
            </el-form-item>
            <el-form-item label="二级菜单名称" v-if="category_children_input">
              <el-input v-model="form.secCategoryName" :disabled="category_children_disabled"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submit"
                :loading="submit_button_loading"
                :disabled="submit_button_disabled"
              >确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { common } from "@/api/common";
import { global } from "@/utils/global3.0";
import { AddFirstCategory, GetCategory, DeleteCategory, EditCategory,AddChildCategory } from "@/api/news";
import { reactive, ref, isRef, toRefs, onMounted, watch } from "@vue/composition-api";
export default {
  name: "category",
  setup(props, context) {
    const {getInfoCategory,categoryItem,getInfoCategoryAll} = common();
    const { confirm } = global();
    const form = reactive({
      categoryName: "",
      secCateagoryName: ""
    });
    const category = reactive({
      item: [],
      current:[],

    });
    // ref
    const sumbit_button_type = ref("");
    const submit_button_loading = ref(false);
    const category_first_input = ref(true);
    const category_children_input = ref(true);

    const category_first_disabled = ref(true);
    const category_children_disabled = ref(true);
    const submit_button_disabled = ref(true);
    const deleteId = ref("");
    /**
     *
     */
    const submit = () => {
      if (sumbit_button_type.value === "category_first_add") {
        addFirstCategory();
      }
      if (sumbit_button_type.value === "category_first_edit"){
          editFirstCategory()
      }
      if (sumbit_button_type.value === "category_children_add"){
          addChildrenCategory()
      }
      
    };
    // 添加一级分类
    const addFirstCategory = () => {
      if (!form.categoryName) {
        context.root.$message({
          message: "分类名称不能为空",
          type: "error"
        });
        return false;
      }
      submit_button_loading.value = true;
      AddFirstCategory({ categoryName: form.categoryName })
        .then(response => {
          let data = response.data;
          if (data.resCode === 0) {
            context.root.$message({
              message: data.message,
              type: "success"
            });
            // 数组的方法
            category.item.push(response.data.data);
            submit_button_loading.value = false;
            // context.root.refs['categoryForm'].resetFields()
            form.categoryName = "";
            form.secCateagoryName = "";
            // getCategory()
          }
        })
        .catch(error => {
          submit_button_loading.value = false;
          // context.root.refs['categoryForm'].resetFields()
          form.categoryName = "";
          form.secCateagoryName = "";
        });
    };

    const addFirst = (params) => {
      
      sumbit_button_type.value = params.type;
      // 显示一级，关闭二级
      category_first_input.value = true;
      category_children_input.value = false;
      // 关闭禁用
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      console.log(sumbit_button_type.value);
    };
    // const getCategory = () => {
    //   GetCategory({})
    //     .then(response => {
    //       let data = response.data.data.data;
    //       category.item = data;
    //     })
    //     .catch(error => {});
    // };
    const deleteCategoryConfirm = categoryId => {
      deleteId.value = categoryId;
      confirm({
        content: "确认删除选择的数据？确认后将无法恢复！",
        type: "warning",
        fn: deleteCategory,
        catchfn: () => {
          deleteId.value = "";
        }
      });
    };
    const handlerAddChildren = (params) =>{
      // 更新确定按钮类型
      sumbit_button_type.value = params.type
      // 存储当前数据
      category.current = params.data
      category_first_disabled.value = true
      category_children_disabled.value = false;
      submit_button_disabled.value = false
      category_children_input.value = true
      // 显示一级分类文本
      form.categoryName = params.data.category_name
    }
    const deleteCategory = () => {
      DeleteCategory({ categoryId: deleteId.value })
        .then(response => {
          // 两个参数是删除，三个参数是替换\插入
          // 操作数组 splice("指定起始位置","删除的数量")
          // es6  findIndex
          let index = category.item.findIndex(
            item => item.id == deleteId.value
          );
          // 删除数组指定元素
          category.item.splice(index, 1);
        //   let newData = category.item.filter(item => item.id != deleteId.value);
        //   category.item = newData;
        })
        .catch(error => {});
    };
    const addChildrenCategory = () =>{
      if(!form.secCategoryName){
        context.root.$message({
          message:"子集分类名称不能为空！",
          type:"error"
        })
        return false
      }
      let requestData = {
        categoryName: form.secCategoryName,
        parentId: category.current.id
      }
      AddChildCategory(requestData).then(response =>{
        let responseData = response.data
        context.root.$message({
          message:responseData.message,
          type:"success"
        })
        // 调用分类
        getInfoCategoryAll()
        // 清空子集内容
        form.secCateagoryName =""
      })
    }
    const editCategory = params => {
      sumbit_button_type.value = params.type;
      category_first_input.value = true;
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      form.categoryName = params.data.category_name;
      // 储存当前的对象
      category.current = params.data  
    };
    const editFirstCategory = () =>{
        if(category.current.length == 0){
            context.root.$message({
                message:'未选择分类',
                type:"error"
            })
            return false
        }
        let requestData = {
            id: category.current.id,
            categoryName:form.categoryName
        }
        EditCategory(requestData).then(response =>{
            let responseData = response.data
            context.root.$message({
                message:response.data.message,
                type:"successs"
            })
            // let data = category.item.filter(item => item.id == category.current.id);
            // data[0].category_name = responseData.data.data.categoryName;
            category.current.category_name =  responseData.data.data.categoryName;
            // 清空输入框
            form.categoryName = ''
            category.current = []
        })
    }

    /**
     * 生命周期,挂载完成时执行，（页面DOM元素完成时，实例完成）
     */

    onMounted(() => {
      // getInfoCategory();
      getInfoCategoryAll();
    });

    watch(()=> categoryItem.item,(value)=>{
      
      category.item = value;
      
    })

    return {
      // ref
      category_first_input,
      category_children_input,
      submit_button_loading,
      category_first_disabled,
      category_children_disabled,
      submit_button_disabled,
      deleteId,
      // reactive
      form,
      category,
      // methods
      submit,
      addFirst,
      deleteCategoryConfirm,
      deleteCategory,
      editCategory,
      handlerAddChildren,
      addChildrenCategory
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.category-wrap {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 20px;
    }
  }
}
.menu-title {
  line-height: 44px;
  background-color: #f3f3f3;
  padding-left: 22px;
}
.category {
  position: relative;
  line-height: 44px;
  cursor: pointer;
  &:before {
    content: "";
    position: absolute;
    width: 32px;
    top: 0px;
    border-left: 1px dotted #000;
    left: 22px;
    bottom: 0;
  }
  h4 {
    padding-left: 40px;
    position: relative;
  }
  svg {
    position: absolute;
    left: 14px;
    top: 15px;
    font-size: 17px;
    background-color: #fff;
  }
  li {
    position: relative;
    padding-left: 36px;
    margin-left: 24px;
    &:before {
      content: "";
      position: absolute;
      width: 32px;
      top: 22px;
      border-bottom: 1px dotted #000;
      left: 0;
    }
  }
  li,
  h4 {
    &:hover {
      @include webkit(transition, all 0.5s ease 0s);
      background-color: #f3f3f3;
      .button-group {
        display: inline;
      }
    }
  }
}
.button-group {
  display: none;
  position: absolute;
  z-index: 2;
  right: 11px;
  top: -1px;
  button {
    font-size: 12px;
  }
}
.form-wrap {
  width: 410px;
  padding-top: 26px;
}
.hr-e9e9e9 {
  width: calc(100% +60px);
  margin-left: -30px;
  border: none;
  margin-top: 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e9e9e9;
}
</style>