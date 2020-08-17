<template>
  <el-dialog
    title="新增"
    :visible.sync="data.dialog_Info_flag"
    @close="close"
    :modal-append-to-body="false"
    @opened="openDialog"
    width="580px"
  >
    <el-form :model="data.form" ref="addInfoForm">
      <el-form-item label="用户名：" :label-width="data.formLabelWidth" prop="username">
        <el-input placeholder="请输入邮箱" v-model="data.form.username"></el-input>
      </el-form-item>

      <el-form-item label="姓名：" :label-width="data.formLabelWidth" prop="truename">
        <el-input placeholder="请输入姓名" v-model="data.form.truename"></el-input>
      </el-form-item>

      <el-form-item label="密码：" :label-width="data.formLabelWidth" prop="password">
        <el-input type="password" placeholder="请输入6~20数字+字母" v-model="data.form.password"></el-input>
      </el-form-item>

      <el-form-item label="手机号：" :label-width="data.formLabelWidth" prop="phone">
        <el-input placeholder="请输入手机号" v-model.number="data.form.phone"></el-input>
      </el-form-item>

      <el-form-item label="地区：" :label-width="data.formLabelWidth" prop="region">
        <!-- <CityPicker :cityPickerData.sync="data.cityPickerData" :cityPickerLevel="['province','city','area']"/> -->
        <CityPicker :cityPickerData.sync="data.cityPickerData" />
      </el-form-item>

      <el-form-item label="是否启用：" :label-width="data.formLabelWidth" prop="status">
        <el-radio v-model="data.form.status" label="1">禁用</el-radio>
        <el-radio v-model="data.form.status" label="2">启用</el-radio>
      </el-form-item>

      <el-form-item label="角色：" :label-width="data.formLabelWidth" prop="role">
        <el-checkbox-group v-model="data.form.role">
          <el-checkbox v-for="item in data.roleItem" :key="item.role" :label="item.role">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="data.submitLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>

import sha1 from "js-sha1";
import { AddInfo, Getlist } from "@/api/news";
import { reactive, ref, watchEffect, onBeforeMount } from "@vue/composition-api";
import CityPicker from "@c/CityPicker";
import {GetRole,UserAdd} from "@/api/users";
export default {
  name: "DialogAdd",
  components: { CityPicker },
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit, root, refs }) {
    const data = reactive({

      // 角色
      roleCode:["A"],
      // 角色选择
      roleItem:[],
      dialog_Info_flag: false,
      // 城市数据
      cityPickerData: {},
      formLabelWidth: "90px",
      submitLoading:false,
      form: {
        username:"",
        truename:"",
        password:"",
        phone:"",
        region:"",
        status:"1",
        role:[]
      }
    });

    // 请求角色
    const getRole =()=>{
      GetRole().then(response=>{
        data.roleItem = response.data.data
    
      })
    }

    // watch 监听
    watchEffect(() => {
      data.dialog_Info_flag = props.flag;
    });

    const close = () => {
      data.dialog_Info_flag = false;
      resetForm();
      emit("update:flag", false);
    };

    const openDialog = () => {
      data.categoryOptions = props.category;
      getRole()
    };
    const resetForm = () => {
      data.cityPickerData = {}
      refs.addInfoForm.resetFields();
    };

    const submit = () => {
      if(!data.form.username){
        root.$message({
          message:"用户名不能为空!",
          type:"error"
        })
        return false
      }
      if(!data.form.password){
        root.$message({
          message:"密码不能为空!",
          type:"error"
        })
        return false
      }
      if(data.form.role.length ===0){
        root.$message({
          message:"请选择角色类型!",
          type:"error"
        })
        return false
      }
      // 
      let requestData = Object.assign({},data.form);
      requestData.role = requestData.role.join(); //数组转成字符串，默认是以逗号隔开的
      requestData.region = JSON.stringify(data.cityPickerData)
      requestData.password = sha1(requestData.password)
      UserAdd(requestData).then(response=>{
        let data = response.data.data
        console.log(data)
        root.$message({
          message:data.message,
          type:"success"
        })
        resetForm()
      })
    };
    
    return {
      // reactive
      data,
      // methods
      close,
      openDialog,
      submit,
      getRole
    };
  }
};
</script>
<style lang="" scoped>
</style>