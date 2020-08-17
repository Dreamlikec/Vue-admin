<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="12">
        <h3 class="titleSign">基本信息</h3>
        <div class="baseinfo">
          <el-form>
            <el-form-item>
              <div>
                <span :class="[data.city?'selectedtype':'']">城市位置:</span>
              </div>
              <el-select placeholder="请选择城市" size="small" v-model="data.city">
                <el-option value="北京"></el-option>
                <el-option value="上海" disabled></el-option>
                <el-option value="深圳" disabled></el-option>
                <el-option value="青岛"></el-option>
                <el-option value="徐州"></el-option>
                <el-option value="临沂"></el-option>
                <el-option value="南京"></el-option>
                <el-option value="长沙"></el-option>
                <el-option value="武汉"></el-option>
              </el-select>
              

              <span class="signSpan">{{regionTransform(data.region)}}</span>
            </el-form-item>
            <el-form-item>
              <div>
                <span :class="[data.htdateRange?'selectedtype':'']">供暖日期：</span>
              </div>
              <el-date-picker
                v-model="data.htdateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy年MM月dd日"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
              <a href="javascript:;" @click="autoSethtRange(data.city)" v-if="data.city" class="autoSetSign">自动设置</a>
            </el-form-item>
            <el-form-item>
              <div>
                <span :class="[data.cldateRange?'selectedtype':'']">制冷日期：</span>
              </div>
              <el-date-picker
                v-model="data.cldateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy年MM月dd日"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
              <a href="javascript:;" @click="autoSetclRange(data.city)" v-if="data.city" class="autoSetSign">自动设置</a>
            </el-form-item>
            <el-form-item>
              <label for="">备注信息:</label>
              <el-input width="90px"
                  type="textarea"
                  :autosize="{ minRows: 10, maxRows: 20}"
                  placeholder="请输入内容"
                  v-model="data.content"
                  maxlength="30"
                >
              </el-input>

            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
        <h3 class="titleSign">参数信息</h3>
        <div class="baseinfo">
          <el-tabs v-model="data.editableTabsValue" type="card" closable @tab-remove="removeTab" >
            <el-tab-pane v-for="item in data.editableTabs" :key="item.name" :label="item.title" :name="item.name">
              <el-form :model="item.params">
                <el-form-item style="position:relative;padding-bottom:30px">          
                  <span :class="[item.buildtype?'selectedtype':'']"> 建筑类型:</span>
                  <el-select placeholder="请选择建筑类型" size="small" v-model="item.buildtype" style="position:absolute;margin-top:30px;left:0px;" :disabled="data.input_disabled">
                    <el-option value="住宅建筑"></el-option>
                    <el-option value="办公建筑" disabled></el-option>
                    <el-option value="商业建筑" disabled></el-option>
                  </el-select>
                  <a style="display:inline;position:absolute;left:200px;top:30px" href="javascript:;" @click="autoSetRecomParams(data['city'],item)" v-if="item.buildtype!=''" class="autoSetSign">推荐配置</a>
                </el-form-item>
                
                <div class="input-field-wrap" style="margin-top:10px"> 
                  <el-form-item class="input-field" v-for="(subitem,subindex) in item.label" :key="subitem">
                      <el-input type="text" required :width="data.formLabelWidth" v-model="item.params[subindex]" @blur="validate(item,subindex,item.params[subindex])" onkeyup="value=value.replace(/[^\d^\.]/g,'')" :disabled="data.input_disabled"></el-input>
                      <label :class="[item.params[subindex]?'inputvalid_label':'']">{{subitem}}</label>
                      <span :class="[item.params[subindex]?'inputvalid_span':'']"></span>
                      <p class="bg-danger">{{item.warning[subindex]}}</p>
                  </el-form-item>
                  <div class="pull-right" style="padding:30px 0">
                    
                    <el-button size="small" @click="addTab" :disabled="data.input_disabled">添加建筑</el-button>
                    <el-button size="small" type="danger" @click="submit" :disabled="data.input_disabled" :loading="loadingData">负荷计算</el-button>
                    <el-button size="small" type="primary" @click="resetform(item)" :disabled="data.input_disabled">重置列表</el-button>
                  </div>
                </div>
              </el-form>
            </el-tab-pane>

          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// JQuery 实现span颜色变化
import {CalLoads} from "@/api/calLoads";
import $ from "jquery";
import {validateParamsfun} from "@/utils/validatebuildparams";
import { reactive, watch, watchEffect,ref} from "@vue/composition-api";
import { quillEditor } from "vue-quill-editor"; // 调用富文本编辑器
// import "quill/dist/quill.snow.css"; // 富文本编辑器外部引用样式  三种样式三选一引入即可
// import "quill/dist/quill.core.css";
// import "quill/dist/quill.bubble.css";


export default {
  name: "buildingInfo",
  setup(props, {root}) {
    const loadingData = ref(false)
    const data = reactive({
      formLabelWidth: "200px",
      editableTabsValue: '1',
      input_disabled:"",
      city:"",
      region:"",
      content:"",
      htdateRange:"",
      cldateRange:"",
      editableTabs: [{
          title: '建筑 1',
          buildtype:"",
          name: '1',
          label: {area:"建筑面积(㎡):",glz_n:"窗墙比 (北):",glz_ew:"窗墙比 (东西):",glz_s:"窗墙比 (南):",AC:"换气次数 (AC):",uw:"墙的传热系数 (W/(㎡·℃)):",uf:"窗的传热系数 (W/(㎡·℃)):",shgc:"SHGC:",sum_point:"夏季设定温度 (℃):",win_point:"冬季季设定温度 (℃):"},
          params: {
            area:"",glz_n:"",glz_ew:"",glz_s:"",AC:"",uw:"",uf:"",shgc:"",sum_point:"",win_point:"",

          },
          warning:{
            area:"",glz_n:"",glz_ew:"",glz_s:"",AC:"",uw:"",uf:"",shgc:"",sum_point:"",win_point:""
          } 
      }],
      tabIndex: 1
    })

    const addTab = (targetName)=> {
        let newTabName = ++data.tabIndex + '';
        data.editableTabs.push({
          title: '建筑 ' + newTabName,
          buildtype:"",
          name: newTabName,
          label: {area:"建筑面积(㎡):",glz_n:"窗墙比 (北):",glz_ew:"窗墙比 (东西):",glz_s:"窗墙比 (南):",AC:"换气次数 (AC):",uw:"墙的传热系数 (W/(㎡·℃)):",uf:"窗的传热系数 (W/(㎡·℃)):",shgc:"SHGC:",sum_point:"夏季设定温度 (℃):",win_point:"冬季季设定温度 (℃):"},
          params: {
            area:"",glz_n:"",glz_ew:"",glz_s:"",AC:"",uw:"",uf:"",shgc:"",sum_point:"",win_point:"",
  
          },
          warning:{
            area:"",glz_n:"",glz_ew:"",glz_s:"",AC:"",uw:"",uf:"",shgc:"",sum_point:"",win_point:""
          } 
        });
        data.editableTabsValue = newTabName;
    }
    const removeTab =(targetName)=> {
        let tabs = data.editableTabs;
        let activeName = data.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        data.editableTabsValue = activeName;
        data.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }    
    
    const {ParamsData,validateParam,bindRegion,validateSubmit,autoSethtRangefun,autoSetclRangefun,autoSetRecomParamsfun} = validateParamsfun()

    const regionTransform = (val)=>{
      if(val === "coldRegion") return "寒冷地区"
      if(val === "shwcRegion") return "夏热冬冷地区"
    }
    const autoSethtRange = (city)=>{
      data.htdateRange = autoSethtRangefun(city)
    }
    const autoSetclRange = (city) =>{
      data.cldateRange = autoSetclRangefun(city)
    }

    const validate = (builitem,key,value) =>{
      let message = validateParam(data.region,key,value)
      builitem.warning[key] = message
    }
    const resetform = (buildinstance) =>{
      var curParams = buildinstance["params"]
      Object.keys(buildinstance["params"]).forEach(key=>{
        buildinstance['params'][key] = ""
      })
    }
    const autoSetRecomParams = (city,buildinstance)=>{
        let buildtype = buildinstance['buildtype']
        var paramslist = autoSetRecomParamsfun(city,buildtype)
        if(paramslist){
          buildinstance["params"] = JSON.parse(paramslist)
        }     
    }

    watch(()=>data.city,(val)=>{
      // 绑定参数的遍历范围
      data.region = bindRegion(val)


      // 如果选择城市，右边才可以输入
      if(val){
        data.input_disabled = false
      }
    })
    const submit = ()=>{
      var requestData = {}
      if(validateSubmit(data)){
        loadingData.value = true
        let requestData = {
          city:data.city,
          htdateRange:data.htdateRange,
          cldateRange:data.cldateRange,
          region:data.region,
          paramsDict:data.editableTabs.map(item=>({
            title:item.title,
            buildtype:item.buildtype,
            params:item.params
          }))
        }
        let loadsHeaders = data.editableTabs.map(item=>({
          title:item.title,
          buildtype:item.buildtype,
          area:item.params.area
        }))
        root.$store.commit("loads/SET_LOADSHEADER", loadsHeaders);
        root.$store.commit("loads/SET_PARAMSDATA",data)
        console.log(root.$store.state.loads.paramsData)
        CalLoads(requestData).then(response=>{
          root.$router.push({
              name: "calresult",
              query:{
                data:JSON.parse(response.data)
              }
            });
          loadingData.value = false
          root.$store.commit("loads/SET_RESULTDATA",response)
          console.log(root.$store.state.loads.resultData)
        }).catch((err)=>{})
      }
    }


    return {
      data,
      loadingData,
      // paramsrules,
      addTab,
      removeTab,
      submit,
      validate,
      regionTransform,
      resetform,
      // import validate
      ParamsData,
      validateParam,
      bindRegion,
      autoSethtRange,
      autoSetclRange,
      autoSetRecomParams
    };
  }
};
</script>
<style lang="scss">
@import "../../styles/config.scss";
.titleSign{
  margin-bottom: 16px;
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
}

.signSpan{
  margin-left: 20px;
  font-size: 11px;
  color:#DCDFE6
}
.autoSetSign{
  margin-left: 20px;
  font-size: 11px;
}

.baseinfo{
    background:#fff;
    border: 1px solid #DCDFE6;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    padding: 15px;
    align-content: space-around;
    @include webkit(box-sizing,border-box);
    border-radius: 5px;
    height: 650px;

}

.input-field-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-around;
}

.input-field {
  margin-left: 0px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 40px;;
}

.input-field .el-input__inner {
  /* position: absolute; */
  background: transparent;
  border: none !important;
  box-shadow: none;
  font-size: 16px;
  color: #333;
  width: 100%;
  outline: none;
  padding: 2px 0;
}

.input-field label {
  position: absolute;
  top: 0;
  left: 0;
  color: #555;
  pointer-events: none;
  display: block;
  transition: 0.5s;
}

.selectedtype{
  font-size: 12px !important;
  line-height: 18px;
  color: #fff !important;
  background-color: #ff006a;
  padding: 1px 2px;
}

.input-field .el-input:hover + label,
.input-field .el-input:valid + label,
.inputvalid_label{
  transform: translateY(-25px) !important;
  font-size: 12px !important;
  color: #fff !important;
  background-color: #ff006a !important;
  padding: 1px 2px !important;
  margin: 0 !important;
  line-height: 18px;
}

.input-field span {
  position: absolute;
  // bottom: 0;
  // right: 0;
  display: block;
  background-color: #555;
  width: 100%;
  height: 2px;
  z-index: 999;
}

.input-field span::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #00b0ff;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s ease-in-out;
}


.input-field .el-input:hover ~ span::before,
.input-field .el-input:valid ~ span::before,
.inputvalid_span::before{
  transform: scaleX(1) !important;
  transform-origin: left !important;
  transition: transform 0.5s ease-in-out !important;
}


.input-field p:empty {
  font-size: 12px;
  line-height: 30px;
  /* top: -30px; */
  margin-top: 10px;
  padding: 5px;
  display: block;
  height: 30px;
}


.input-field p:not(:empty) {
  font-size: 12px;
  line-height: 30px;
  /* top: -30px; */
  margin-top: 10px;
  padding: 5px;
  // width: 100%;
  background-color: #f2dede !important;
}

// .bg-danger {

  
// }
</style>