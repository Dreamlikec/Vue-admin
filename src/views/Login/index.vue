<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{'current':item.current}"
          @click="toggleMneu(item)"
          v-for="item in menuTab"
          :key="item.id"
        >{{ item.txt }}</li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="item-form" v-if="model === 'register'">
          <label>重复密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                class="block"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
              >{{ codeButtonStatus.text }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :disabled="loginButtionStauts"
            @click="submitForm('ruleForm')"
            class="login-btn block"
          >{{ model === 'login'?"登陆":"注册" }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login";
import { reactive, ref, isRef, toRefs, onMounted, onUnmounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePsswd,
  validateCd
} from "@/utils/validate";
export default {
  name: "login",
  setup(props, context) {
    // setup(props, {root,refs}) {
    // 这里放置data数据、生命周期、自定义的函数
    const menuTab = reactive([
      { txt: "登陆", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    // 模块值
    const model = ref("login");
    // 登陆按钮禁用状态
    const loginButtionStauts = ref(true);
    // 倒计时
    const timer = ref(null);
    // 验证码按钮状态
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });

    // 生命周期,挂载完成后
    onMounted(() => {});
    // 切换选项卡
    const toggleMneu = data => {
      menuTab.forEach(elem => {
        elem.current = false;
      });
      data.current = true;
      model.value = data.type;
      resetFormData();
      clearCountDown();
    };
    onUnmounted(()=>{
      clearInterval(timer.value)
    })
    // 重置表单
    const resetFormData = () => {
      context.refs.ruleForm.resetFields();
    };
    // 更新按钮状态
    const updateButtionStatus = params => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };
    // 获取验证码
    const getSms = () => {
      // 进行提示
      if (ruleForm.username === "") {
        context.root.$message.error("邮箱不能为空");
        return false;
      }
      if (validateEmail(ruleForm.username)) {
        context.root.$message.error("邮箱格式有误，清重新输入");
        return false;
      }
      let requestData = {
        username: ruleForm.username,
        module: model.value
      };

      // 修改获取验证按钮状态
      updateButtionStatus({
        status: true,
        text: "发送中"
      });

      // 延迟多长时间
      setTimeout(() => {
        GetSms(requestData)
          .then(response => {
            let data = response.data;
            context.root.$message({
              message: data.message,
              type: "success"
            });
            // 启用登陆或注册按钮
            loginButtionStauts.value = false;
            // 调定时器，倒计时60s
            countDown(60);
          })
          .catch(error => {
            console.log(error);
          });
      }, 1000);
    };
    // 提交表单
    const submitForm = formName => {
      context.refs[formName].validate(valid => {
        // 表单验证通过
        if (valid) {
          model.value === "login" ? login() : register();
          return true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    // 登陆接口实现

    const login = () => {
      let repuestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      context.root.$store
        .dispatch("app/login", repuestData)
        .then(response => {
          console.log('登陆成功')
          // 页面跳转
          context.root.$router.push({
            name: "Console"
          });
        })
        .catch(error => {});
    };

    // 注册接口实现
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        module: "register"
      };
      // 实现注册接口
      Register(requestData)
        .then(response => {
          let data = response.data;
          context.root.$message({
            message: data.message,
            type: "success"
          });
          // 注册成功时，切换到登陆页面，并且清除二维码缓存器
          toggleMneu(menuTab[0]);
          clearCountDown();
        })
        .catch(error => {
          // 失败时执行的代码
        });
    };

    // 倒计时
    const countDown = number => {
      // setTimeout 只执行一次
      // setInterval 不断的执行，需要条件才会停止
      // setInterval:clearInterval(变量) 清除定时器
      // 判断定时器是否存在，存在则清除
      if (timer.value) {
        clearInterval(timer.value);
      }
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          updateButtionStatus({
            status: false,
            text: "再次获取"
          });
        } else {
          codeButtonStatus.text = `倒计时${time}秒`;
        }
      }, 1000);
    };
    // 清除倒计时
    const clearCountDown = () => {
      // 还原验证码按钮为默认状态
      updateButtionStatus({
        status: false,
        text: "获取验证码"
      });

      clearInterval(timer.value);
    };

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
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePsswd(value)) {
        callback(new Error("密码为6至20位的字母+数字"));
      } else {
        callback();
      }
    };
    // 验证重复密码
    let validatePasswords = (rule, value, callback) => {
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    // 验证验证码
    let validateCode = (rule, value, callback) => {
      ruleForm.code = stripscript(value);
      value = ruleForm.code;
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (validateCd(value)) {
        callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };
    // 验证项
    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });
    // 验证规则
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });
    return {
      ruleForm,
      rules,
      menuTab,
      loginButtionStauts,
      codeButtonStatus,
      model,
      toggleMneu,
      submitForm,
      getSms
    };
  }
};
</script>
<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: $viceColor;
  position: relative;
}
.login-wrap {
  border: 1px solid #000;
  @include webkit(box-shadow, 0 16px 16px 0 rgba(0, 0, 0, 0.6));
  padding: 30px;
  width: 330px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  border-radius: 20px;
  background-color: $mainColor;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #000;
    border-radius: 5px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #000;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>