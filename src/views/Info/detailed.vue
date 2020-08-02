<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="信息分类：">
      <el-select v-model="form.categoryId">
        <el-option
          v-for="item in data.category"
          :data = "data.uploadKey"
          :key="item.id"
          :value="item.id"
          :label="item.category_name"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="新闻标题：">
      <el-input v-model="form.title"></el-input>
    </el-form-item>

    <el-form-item label="缩略图：">
     <UploadImg :imgUrl.sync ="form.imgUrl" :config="uploadImgConfig"/>
    </el-form-item>

    <el-form-item label="发布日期：">
      <el-date-picker v-model="form.createDate" type="date" placeholder="选择日期" disabled></el-date-picker>
    </el-form-item>

    <el-form-item label="详细内容：">
      <quillEditor v-model="form.content" ref="myQuilEditor" :options="data.editorOption" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit" :loading="submitLoading">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {reactive,ref,isRef,toRefs,onMounted,watch} from "@vue/composition-api";

import { timestampToTime } from "@/utils/common";
import { common,QiniuToken } from "@/api/common";
import { AddInfo, Getlist, EditInfo } from "@/api/news";
// 组件
import UploadImg from "@c/Uploading";

import { quillEditor } from "vue-quill-editor"; // 调用富文本编辑器
import "quill/dist/quill.snow.css"; // 富文本编辑器外部引用样式  三种样式三选一引入即可
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";

export default {
  name: "infoDetailed",

  components: { quillEditor,UploadImg },
  setup(props, { root }) {
    // 图片上传配置
    const uploadImgConfig = reactive({
      action: "http://up-z2.qiniup.com",
      accesskey: "Avh-EZZAa4TxqPQZsEW42fXBUbTMFi-RKSZTRKJj",
      secretkey: "l9AXtnhCVkZexXNRcmHXzmecXiCUiLynwGboMeUw",
      buckety: "webjshtml"
    })
    const imageUrl = ref('');
    const { getInfoCategory, categoryItem } = common();
    const submitLoading = ref(false);
    const data = reactive({
      id: root.$route.params.id || root.$store.getters["infoDetailed/infoId"],
      category: [],
      editorOption: {}
    });
    const form = reactive({
      categoryId: "",
      title: "",
      createDate: "",
      content: "",
      imgUrl:"",
      uploadKey:{
          token:"",
          key:""
      }
    });
    // let id = root.$route.query.id
    // let title = root.$route.query.title
    // let id =
    //   root.$route.params.id || root.$store.getters["infoDetailed/infoId"];
    // let title =
    //   root.$route.params.title || root.$store.getters["infoDetailed/infoTitle"];
    // console.log(id)
    // console.log(title)
    // console.log("id:" + id);
    // console.log("title:" + title);

    // 获取当前ID的信息
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: props.id
      };
      Getlist(requestData).then(response => {
        let responseData = response.data.data.data[0];
        form.categoryId = responseData.categoryId;
        form.title = responseData.title;
        form.content = responseData.content;
        form.createDate = timestampToTime(responseData.createDate);
        form.imgUrl = responseData.imgUrl;

      });
    };
    // 保修（修改数据时，必须注意一定要带一个id
    const submit = () => {
      let requestData = {
        id: data.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imgUrl: form.imgUrl
      };
      submitLoading.value = true;
      EditInfo(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          submitLoading.value = false;
        })
        .catch(error => {
          // submitLoading.value = true
        });
    };



    // 获取七牛云token
    const getQiniuToken = () =>{
        let requestData = {
            accesskey:"",
            secretkey:"",
            buckety:""
        };
        QiniuToken(requestData).then(response =>{
            data.uploadKey.token = response.data.token
        })
    }
    onMounted(() => {
      // 获取分类
      root.$store.dispatch("common/getCategory").then(response => {
        data.category = response;
      });
      data.category = categoryItem;
      getInfo();
    });

    return {
      uploadImgConfig,
      imageUrl,
      submitLoading,
      data,
      form,
      submit,
    };
  }
};
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>