<template>
  <div>
    <!-- 按钮 -->
    <el-row :gutter="14">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for>分类：</label>
          <div class="wrap-content">
            <el-select v-model="category_Value" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="label-wrap date">
          <label for>日期：&nbsp;&nbsp;</label>
          <div class="wrap-content">
            <el-date-picker
              style="width:100%"
              v-model="date_Value"
              format="yyyy年MM月dd日 HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
            ></el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="label-wrap key-word">
          <label for>关键字：</label>
          <div class="wrap-content">
            <SelectVue :config="data.configOption"/>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <el-input v-model="search_keyWork" placeholder="请输入内容" style="width:100%">></el-input>
      </el-col>
      <el-col :span="2">
        <el-button style="width:100%" @click="search">搜索</el-button>

      </el-col>
      <el-col :span="3">
        <div>&nbsp;</div>
      </el-col>
      <el-col :span="2" class="pull-right">
        <el-button style="width:100%" @click="dialog_Info = true">新增</el-button>

      </el-col>
    </el-row>

    <div class="blanck-space-30"></div>
    <!-- 表格数据 -->
    <el-table
      :data="table_Data.item"
      border
      v-loading="loadingData"
      @selection-change="handleSelectionChange"
      style="width: 100%; "
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column prop="title" label="标题" width="500"></el-table-column>
      <el-table-column prop="categoryId" label="类型" width="130" :formatter="toCategory"></el-table-column>

      <el-table-column prop="createDate" label="日期" width="237" :formatter="toDate"></el-table-column>

      <el-table-column prop="user" label="管理员" width="115"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editInfo(scope.row.id)" :id="infoId" v-if="btnPerm('info:edit')">编辑</el-button>
          <!-- <router-link :to="{name: 'infoDetailed',query:{id:scope.row.id,title:scope.row.title}}" class="margin-left-right-10"> -->
          <el-button size="mini" type="primary" @click="detailed(scope.row)" v-if="btnPerm('info:detailed')">编辑详情</el-button>
          <!-- </router-link> -->
          <el-button size="mini" type="danger" @click="deleteItem(scope.row.id)" v-if="btnPerm('info:del')">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <div class="blanck-space-30"></div>

    <!-- 底部分页 -->
    <el-row>
      <el-col :span="12">
        <el-button size="medium" @click="deleteAll" type="danger">批量删除</el-button>

      </el-col>
      <el-col :span="12">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10,20,50,100]"
          layout="total, sizes, prev, pager, next,jumper"

          :total="total"


          class="pull-right"
          :current-page="1"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 新增弹窗 -->
    <DialogInfo :flag.sync="dialog_Info" :category="options.category" @getList="getList" />
    <!-- 修改弹窗 -->
    <DialogEditInfo
      :flag.sync="dialog_Info_edit"
      :id="infoId"
      :category="options.category"
      @getList="getList"
    />
  </div>
</template>
<script>
import { common } from "@/api/common";
import { GetCategory, Getlist, DeleteInfo } from "@/api/news";
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit";
// import {confirm} from "@/utils/validate";
import { AddFirstCategory } from "@/api/news";
import { global } from "@/utils/global3.0";
import {
  reactive,
  ref,
  isRef,
  toRefs,

  onMounted,
  onUnmounted,
  watch
} from "@vue/composition-api";
import { timestampToTime } from "@/utils/common";
import SelectVue from "@c/Select";

export default {
  name: "infoIndex",
  components: { DialogInfo, DialogEditInfo,SelectVue },
  setup(props, context) {
    const data = reactive({
      configOption:{
        init:["id","title"]
      }
    })
    const { getInfoCategory, categoryItem } = common();
    const { confirm } = global();
    const dialog_Info = ref(false);
    const dialog_Info_edit = ref(false);
    const deleteInfoId = ref("");

    const options = reactive({
      category: []
    });
    // 搜索关键字
    const search_Options = reactive([
      { value: "id", label: "ID" },
      { value: "title", label: "标题" }
    ]);
    const search_key = ref("id");
    const category_Value = ref("");
    const date_Value = ref("");
    const search_keyWork = ref("");
    const total = ref(0);
    
    const infoId = ref("");
    // loading
    const loadingData = ref(false);
    // 页码
    const page = reactive({
      pageNumber: 1,
      pageSize: 10
    });
    // 表格数据
    const table_Data = reactive({
      item: []
    });
    const handleSizeChange = val => {
      page.pageSize = val;
    };
    const handleCurrentChange = val => {
      page.pageNumber = val;
      getList();
    };
    const search = () => {
      getList();
    };
    const formatData = () => {
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      if (category_Value.value) {
        requestData.categoryId = category_Value.value;
      }
      if (date_Value.value != null && date_Value.value.length > 0) {
        requestData.startTiem = date_Value.value[0];
        requestData.endTime = date_Value.value[1];
      }
      if (search_keyWork.value) {
        requestData[search_key.value] = search_keyWork.value;
      }
      return requestData;
    };
    const editInfo = id => {
      infoId.value = id;
      dialog_Info_edit.value = true;
    };

    const detailed = data => {
      // context.root.$store.commit("infoDetailed/SET_ID", data.id);
      // context.root.$store.commit("infoDetailed/SET_TITLE", data.title);
      context.root.$store.commit("infoDetailed/UPDATE_STATE_VALUE", {
        id:{
          value:data.id,
          sessionKey:"infoId",
          session:true
        },
        title:{
          value:data.title,
          sessionKey:"infoId",
          session:true
        },
      });

      context.root.$router.push({
        name: "infoDetailed",
        params: {
          id: data.id,
          title: data.title
        }
      });
    };

    const getList = () => {
      let requestData = formatData();
      // let resquestDate = {
      //   categoryId:'',
      //   startTiem: '',
      //   endTime: '',
      //   title: '',
      //   id: '',
      //   pageNumber: page.pageNumber,
      //   pageSize: page.pageSize
      // }
      // 设置一个加载状态
      loadingData.value = true;
      Getlist(requestData)
        .then(response => {
          let data = response.data.data;
          table_Data.item = data.data;
          // 页面统计数据
          total.value = data.total;


          loadingData.value = false;
        })
        .catch(error => {
          loadingData.value = false;
        });
    };
    // 删除数据
    const deleteItem = id => {
      deleteInfoId.value = [id];
      confirm({
        content: "确认删除当前信息？确认后将无法恢复！",
        tips: "警告",
        fn: confirmDelete
      });
    };
    const deleteAll = () => {
      if (!deleteInfoId.value || deleteInfoId.value.length === 0) {
        context.root.$message({
          message: "请选择要删除的数据",
          type: "error"
        });
        return false;
      }
      confirm({
        content: "确认删除选择的数据？确认后将无法恢复！",
        type: "success",
        fn: confirmDelete
      });
    };

    const confirmDelete = value => {
      DeleteInfo({ id: deleteInfoId.value }).then(response => {
        deleteInfoId.value = "";
        getList();
      });
    };

    const closeDialog = () => {
      dialog_Info.value = false;
    };
    // const getCategory = () => {
    //   GetCategory({})
    //     .then(response => {
    //       let data = response.data.data.data;
    //       options.category = data
    //     }
    //     .catch(error => {});
    // };

    // 将表格内的时间戳转换为时间格式
    const toDate = (row, column, celValue, index) => {

      return timestampToTime(row.createDate);

    };
    const toCategory = row => {

      // 调用一个函数,返回一个新值
      let categoryId = row.categoryId;
      let categoryData = options.category.filter(
        item => item.id == categoryId
      )[0];
      if (!categoryData) {
        return false;
      }
      return categoryData.category_name;
    };
    // 表格多选
    const handleSelectionChange = val => {
      let id = val.map(item => item.id);
      deleteInfoId.value = id;
    };

    // 声明周期
    onMounted(() => {
      // 获取分类
      getList();
      // vue 3.0 获取分类
      getInfoCategory();
      // vueX
      // context.root.$store.dispatch('common/getCategory').then(response=>{

      //   options.category = response
      // })
    });
    // 监听
    watch(
      () => categoryItem.item,
      value => {
        options.category = value;
      }
    );

    return {
      // ref
      date_Value,
      search_key,
      search_keyWork,
      dialog_Info,
      dialog_Info_edit,
      total,

      loadingData,
      infoId,
      // reactive
      data,
      options,
      search_Options,
      category_Value,
      table_Data,
      page,
      // methods
      handleSizeChange,
      handleCurrentChange,
      deleteItem,
      deleteAll,
      getList,
      toDate,

      toCategory,

      handleSelectionChange,
      search,
      formatData,
      editInfo,
      detailed
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 93, 40);
  }
  &.key-word {
    @include labelDom(right, 80, 40);
  }
}
</style>