<template>
  <el-dialog
    title="新增"
    :visible.sync="data.dialog_Info_flag"
    @close="close"
    :modal-append-to-body="false"
    @opened="openDialog"
    width="580px"
  >
    <el-form :model="data.form" :rules="data.rules" ref="addInfoForm">
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

      <el-form-item label="系统：" :label-width="data.formLabelWidth" prop="role">
        <el-checkbox-group v-model="data.form.role">
          <el-checkbox
            v-for="item in data.roleItem"
            :key="item.role"
            :label="item.role"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit('addInfoForm')" :loading="data.submitLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import sha1 from "js-sha1";
import { AddInfo, Getlist } from "@/api/news";
import {
  reactive,
  ref,
  watchEffect,
  onBeforeMount
} from "@vue/composition-api";
import CityPicker from "@c/CityPicker";
import { GetSystem, UserAdd, UserEdit, GetPermButton } from "@/api/users";
import {
  stripscript,
  validateEmail,
  validatePsswd,
  validateCd
} from "@/utils/validate";
// 中央事件
import Bus from "@/utils/bus";
export default {
  name: "DialogAdd",
  components: { CityPicker },
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit, root, refs }) {
    // 验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    // 验证密码
    let validatePassword = (rule, value, callback) => {
      /**
       * 业务逻辑 1.编辑状态：
       *              需要校验，data.form.id存在并且密码不为空时
       *              不需要校验，data.form.id存在并且密码为空时
       *         2.添加状态:
       *              需要校验，data.form.id不存在
       */
      if (data.form.id && !value) {
        callback();
      }
      if ((data.form.id && value) || !data.form.id) {
        if (value) {
          data.form.password = stripscript(value);
          value = data.form.password;
        }
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (validatePsswd(value)) {
          callback(new Error("密码为6至20位的字母+数字"));
        } else {
          callback();
        }
      }
    };

    // 事件总成注册了一个方法
    // Bus.$on('showFun',(data)=>{
    //   console.log(data)
    // })
    const data = reactive({
      // 角色
      roleCode: ["A"],
      // 角色选择
      roleItem: [],
      // 是否启用
      roleSatus: "1",
      // 弹窗标记
      dialog_Info_flag: false,
      // 城市数据
      cityPickerData: {},
      formLabelWidth: "90px",
      submitLoading: false,
      form: {
        username: "",
        truename: "",
        password: "",
        phone: "",
        region: "",
        status: "1",
        role: []
      },
      // 按钮权限
      btnPerm:[],
      // 验证规则
      rules: reactive({
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        role: [{ required: true, message: "请选择角色", trigger: "change" }]
      })
    });

    // 请求角色
    const getSystem = () => {
      GetSystem().then(response => {
        data.roleItem = response.data.data;
      });
    };

    // watch 监听
    watchEffect(() => {
      data.dialog_Info_flag = props.flag;
    });

    const close = () => {
      data.dialog_Info_flag = false;
      resetForm();
      emit("update:flag", false);
    };

    // 窗口打开时调用接口
    const openDialog = () => {
      // 角色请求
      getSystem();
      // 初始值处理
      let editData = props.editData;
      if (editData.id) {
        // 编辑
        editData.role = editData.role.split(",");
        for (let key in editData) {
          data.form[key] = editData[key];
        }
      } else {
        // 添加
        data.form.id && delete data.form.id;
      }
      for (let key in editData) {
        data.form[key] = data.form.id ? editData[key] : "";
      }
    };
    const resetForm = () => {
      data.cityPickerData = {};
      refs.addInfoForm.resetFields();
    };

    const submit = formName => {
      refs[formName].validate(valid => {
        // 表单验证通过
        if (valid) {
          // 深拷贝 JSON,parse(JSON.stringfy(data.form))
          // 浅拷贝 Object.assign({},data.form)
          let requestData = Object.assign({}, data.form);
          requestData.role = requestData.role.join(); //数组转成字符串，默认是以逗号隔开的
          requestData.region = JSON.stringify(data.cityPickerData);
          
          // 添加状态，需要密码需要加密
          // 编辑状态，有值存在，需要密码并加密，否则删除

          if (requestData.id) {
            if(requestData.password){
              requestData.password = sha1(requestData.password)
            }else{
              delete requestData.password
            }
            userEdit(requestData);
          } else {
            requestData.password = sha1(requestData.password);
            userAdd(requestData);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    const userAdd = requestData => {
      UserAdd(requestData).then(response => {
        let resData = response.data;
        root.$message({
          message: resData.message,
          type: "success"
        });
        close();
        emit("refreshTableData");
      });
    };
    const userEdit = requestData => {
        UserEdit(requestData).then(response => {
        let resData = response.data;
        root.$message({
          message: resData.message,
          type: "success"
        });
        close();
        emit("refreshTableData");
      });
    };

    return {
      // reactive
      data,
      validateUsername,
      validatePassword,
      // methods
      close,
      openDialog,
      submit,
      getSystem
    };
  }
};
</script>
<style lang="" scoped>
</style>