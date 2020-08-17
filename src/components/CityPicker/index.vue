<template>
  <div class="over-flow-h">
    <el-row :gutter="10">
      <el-col :span="6" v-if="init.province">
        <el-select v-model="data.provinceValue" @change="handlerProvince">
          <el-option
            v-for="item in data.provinceData" :key="item.PROVINCE_CODE" :value="item.PROVINCE_CODE" :label="item.PROVINCE_NAME"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.city">
        <el-select v-model="data.cityValue" @change="handlerCity">
          <el-option v-for="item in data.cityData" :key="item.CITY_CODE" :value="item.CITY_CODE" :label="item.CITY_NAME"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.area">
        <el-select v-model="data.areaValue" @change="handlerArea">
          <el-option v-for="item in data.areaData" :key="item.AREA_CODE" :value="item.AREA_CODE" :label="item.AREA_NAME"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.street">
        <el-select v-model="data.streetValue" @change="handlerStreet">
          <el-option v-for="item in data.streetData" :key="item.STREET_CODE" :value="item.STREET_CODE" :label="item.STREET_NAME"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { cityPicker } from "@/mixins/cityPicker";
import { watch, reactive, onBeforeMount } from "@vue/composition-api";

export default {
  name: "CityPicker",
  props: {
    cityPickerData: {
      type: Object,
      default: () => {}
    },
    cityPickerLevel:{
      type:Array,
      default:()=>[]
    }
  },
  setup(props,{emit}) {
    // 初始化省市区联动
    const init = reactive({
        province:false,
        city:false,
        area:false,
        street:false,
    })

    const {
      data,
      getProvince,
      handlerProvince,
      handlerCity,
      handlerArea,
      handlerStreet,
      resetValue,
      resultData
    } = cityPicker();
    // 初始化
    const initCityPicker = () =>{
        let initData = props.cityPickerLevel
        if(initData.length === 0 ){
            for(let key in init){
                init[key] = true
            }
        }else{
            initData.forEach(item=>{
                init[item] = true
            })
        }
        
    }

    watch([
        ()=>resultData.provinceValue,
        ()=>resultData.cityValue,
        ()=>resultData.areaValue,
        ()=>resultData.streetValue,
    ],([province,city,area,street])=>{
        emit("update:cityPickerData",resultData)

    })
    
    onBeforeMount(()=>{
        // 获取省份
        getProvince();
        initCityPicker();
    })
    
    return {
      data,
      init,
      getProvince,
      handlerProvince,
      handlerCity,
      handlerArea,
      handlerStreet,
      resetValue,
      resultData
    };
  }
};
</script>
<style lang="scss" scoped>
</style>