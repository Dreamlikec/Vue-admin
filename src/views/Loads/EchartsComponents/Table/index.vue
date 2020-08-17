<template>
  <div>
    <el-table :data="data.configTable.tableData" border style="width:100%;font-size:12px" id="out-table">
      <template v-for="item in data.configTable.tHead" >
        <el-table-column :key="item.field" :prop="item.field" :label="item.label"></el-table-column>
      </template>
    </el-table>
    <div class="blanck-space-30 "></div>
    <el-button @click="exportExcel('out-table')" size="small" style="primary" class="pull-right">下载表格</el-button>
  </div>
</template>
<script>

import { exportExcel } from "@/utils/common";
import { reactive, onMounted } from "@vue/composition-api";
export default {
  name: "LoadsTable",
  props:{
    config:{
      type:Object,
      default:()=>{}
    }
  },
  setup(props, { root }) {
    const data = reactive({
      configTable: {
        tHead: [
          {
            label: "建筑名称",
            field: "title"
          },
          {
            label: "建筑类型",
            field: "buildtype"
          },
          {
            label: "建筑面积 (㎡)",
            field: "area"
          },
          {
            label: "冷指标 (W/㎡)",
            field: "clindex"
          },
          {
            label: "热指标 (W/㎡)",
            field: "htindex"
          },
          {
            label: "冷负荷(W)",
            field: "clloads"
          },
          {
            label: "热负荷 (W)",
            field: "htloads"
          },
          {
            label: "单位面积年耗冷量 (kW·h/㎡·a)",
            field: "toclpa"
          },
          {
            label: "单位面积年耗热量(kW·h/㎡·a)",
            field: "tohtpa"
          }
        ],
        loadsHeader :  [],
        res:props.config,
        tableData:[]
      }
    });
    const formatTable = ()=>{
      var resData = data.configTable.res['resultData']
      let _resList = []
      let _tableData =  data.configTable.tableData
      Object.keys(resData).forEach((key,index)=>{
        let _obj = {
          title:key,
          clindex:resData[key]["summer"]["maxindex"],
          htindex:resData[key]["winter"]["maxindex"],
          clloads:resData[key]["summer"]["clloads"],
          htloads:resData[key]["winter"]["htloads"],
          toclpa:resData[key]["summer"]["sum"],
          tohtpa:resData[key]["winter"]["msum"],
          cllst:resData[key]["summer"]["value_list"],
          htlst:resData[key]["winter"]["value_list"],
        }
        _resList.push(_obj)
      })
      let loadsHeader = root.$store.state.loads.loadsHeader
      for(var i =0;i<_resList.length;i++){
        _tableData.push(Object.assign(_resList[i],loadsHeader[i]))
      }
      if(_tableData.length > 1){
        var totalarea = 0 
        var totalclloads = 0
        var totalhtloads = 0
        var totaltoclpa = 0
        var totaltohtpa = 0
        var cllstresult = []
        var htlstresult = []

        for(var i = 0;i<_tableData.length;i++){
          var area = parseFloat(_tableData[i]['area'])
          totalarea = totalarea + area
          totaltoclpa = totaltoclpa + parseFloat(area) * parseFloat(_tableData[i]["toclpa"])
          totaltohtpa = totaltohtpa + parseFloat(area) * parseFloat(_tableData[i]["tohtpa"])
          for(var j = 0;j<_tableData[i]['cllst'].length;j++){
            if(isBlank(cllstresult[j])){
              cllstresult[j] = 0
            }
            cllstresult[j] += parseFloat(_tableData[i]['cllst'][j])
          }
          for(var u = 0;u<_tableData[i]['htlst'].length;u++){
            if(isBlank(htlstresult[u])){
              htlstresult[u] = 0
            }
            htlstresult[u] += parseFloat(_tableData[i]['htlst'][u]) 
          }
        }

        let _totalobj = {
          title:"综合最大值",
          area:totalarea,
          clindex:(Math.max(...cllstresult)/totalarea).toFixed(2),
          htindex:(Math.max(...htlstresult)/totalarea).toFixed(2),
          clloads:(Math.max(...cllstresult)).toFixed(2),
          htloads:(Math.max(...htlstresult)).toFixed(2),
          toclpa:(totaltoclpa/totalarea).toFixed(2),
          tohtpa:(totaltohtpa/totalarea).toFixed(2),
          cllst:cllstresult,
          htlst:htlstresult,
        }
        _tableData.push(_totalobj)
      }
    }
    const loadsDismantling = () =>{
      let _tableData = data.configTable.tableData
      var len = _tableData.length
      if(len>1){  
        for(let i =0;i<len;i++)
          if(_tableData[i]['title'] === '综合最大值'){
            root.$store.commit("loads/SET_HTPERCENT",loadsPercent('热负荷',_tableData[i]["htlst"]))
            root.$store.commit("loads/SET_CLPERCENT", loadsPercent('冷负荷',_tableData[i]["cllst"]))
          }
      }
      else{
          root.$store.commit("loads/SET_HTPERCENT",loadsPercent('热负荷',_tableData[0]["htlst"]))
          root.$store.commit("loads/SET_CLPERCENT", loadsPercent('冷负荷',_tableData[0]["cllst"]))

      }

    }

    const loadsPercent = (status,valuelist) =>{
      var per25 = 0
      var per25to50 = 0
      var per50to75 = 0
      var per75to100 = 0
      var maxval = Math.max(...valuelist)
      for(let i=0;i<valuelist.length;i++){
        if(valuelist[i]<=maxval *0.25){
          per25 += 1
        }
        else if(valuelist[i]>maxval*0.25&&valuelist[i]<=maxval*0.5){
          per25to50 += 1
        }
        else if(valuelist[i]>maxval*0.5&&valuelist[i]<=maxval*0.75){
          per50to75 += 1
        }
        else{
          per75to100 += 1
        }
      }
      var percentlist = [status,per25,per25to50,per50to75,per75to100]
      return percentlist
    }

    const isBlank= (val)=>{
      if(val == null|| val==""){
        return true;
      }
    }

    onMounted(()=>{
      // data.res = props.config
      formatTable()
      loadsDismantling()
    })
    return {
      data,formatTable,isBlank,exportExcel,loadsPercent
    };
  }
};
</script>