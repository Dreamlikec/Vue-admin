<template>
  <div>
    <el-table :data="data.tableData" border style="width: 100%">
      <!-- 多选框 -->
      <el-table-column v-if="data.tableConfig.selection" type="selection" with="55"></el-table-column>
      <!-- 文本数据渲染 -->
      <template v-for="item in data.tableConfig.tHead">
        <!-- v-slot -->
        <el-table-column
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          v-if="item.columnType ==='slot'"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <!-- 文本数据渲染 -->
        <el-table-column :key="item.field" :prop="item.field" :label="item.label" v-else></el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="data.tableConfig.paginationShow"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageData.currentPage"
      :page-sizes="pageData.pageSizes"
      :page-size="pageData.pageSize"
      :layout="data.tableConfig.paginationLayout"
      :total="pageData.total"
      background
    ></el-pagination>
  </div>
</template>
<script>
import { loadTableData } from "@/api/common";
import { requestUrl } from "@/api/requestUrl";
import {
  reactive,
  onBeforeMount,
  onMounted,
  onUpdated,
  onBeforeUpdate,
  onBeforeDestroyed,
  watch
} from "@vue/composition-api";
import { LoadData } from "./tableLoadData";
// import { recordPage } from "./recordPage";
import { paginationHook } from "./paginationHook";
export default {
  name: "TableVue",
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root }) {
    // 加载数据
    const { tableData, tableLoadData } = LoadData({ root });
    const {
      pageData,
      handleSizeChange,
      handleCurrentChange,
      totalCount
    } = paginationHook();
    const data = reactive({
      tableConfig: {
        selection: true,
        tHead: [],
        recordCheckbox: true,
        requestData: {},
        paginationLayout:"total,sizes,prev,pager,next,jumper",
        paginationShow:false
      },
      tableData: []
    });

    // table数据监听，总数监听
    watch([
        () => tableData.item, 
        () => tableData.total
    ],([tableData,total])=>{
        data.tableData = tableData;
        totalCount(total)
    });
    // 页码监听
    watch([
        ()=> pageData.currentPage,
        ()=> pageData.pageSize,
    ],([currentPage,pageSize])=>{
        let requestData = data.tableConfig.requestData;
        if(requestData.data){
            requestData.data.pageNumber = currentPage;
            requestData.data.pageSize = pageSize;
            tableLoadData(data.tableConfig.requestData)
        }

        
    })

    const initTableConfig = () => {
      let configData = props.config;
      let keys = Object.keys(data.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) data.tableConfig[key] = configData[key];
      }
    };
    onBeforeMount(() => {
      initTableConfig();
      tableLoadData(data.tableConfig.requestData);
    });

    return {
      data,
      pageData,
      handleSizeChange,
      handleCurrentChange,
      totalCount
    };
  }
};
</script>
<style lang="scss" scoped>
</style>