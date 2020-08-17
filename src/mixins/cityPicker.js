import { GetCityPicker } from "@/api/common";
import { reactive, toRefs } from "@vue/composition-api";
export function cityPicker() {
    const data = reactive({
        provinceValue: "",
        cityValue: "",
        areaValue: "",
        streetValue: "",
        provinceData: [],
        cityData: [],
        areaData: [],
        streetData: []

    })

    const resultData = reactive({
        provinceValue: "",
        cityValue: "",
        areaValue: "",
        streetValue: "",
    })
    // 获取城市
    const getProvince = (val) => {
        getData({type: "province"})
    }

    // 选择省份后，获取城市
    const handlerProvince = (val) => {
        resetValue({ type: "city" })
        getData({ type: "city", province_code: val })
    }
    // 选择城市后，获取区县
    const handlerCity = (val) => {
        resetValue({ type: "area" })
        getData({ type: "area", city_code: val })
    }

    // 选择区县后，获取街道
    const handlerArea = (val) => {
        resetValue({ type: "street" })
        getData({ type: "street", area_code: val })
    }
    // 选择街道
    const handlerStreet = (val) =>{
        resetValue({ type: "" })

    }
    // 获取数据
    const getData = (requestData)=>{
        GetCityPicker(requestData).then(response => {
            data[`${requestData.type}Data`] = response.data.data.data
        })
    }
    // 重置选项
    const resetValue = (params) => {
        const valueJson = {
            city: ["cityValue", "areaValue", "streetValue"],
            area: ["areaValue", "streetValue"],
            street: ["streetValue"]
        }
        const arrObj = valueJson[params.type]
        if(arrObj){
            arrObj.forEach(item => {
                data[item] = ""
            });
        }
        // 数据集合处理
        result()
    }
    // 返回数据集合
    const result = () =>{
        for(let key in resultData){
            resultData[key] = data[key]
        }
    }


    return {
        // ...toRefs(data), 可以解构
        data,
        // ...toRefs(resultData),
        resultData,
        getProvince,
        handlerProvince,
        handlerCity,
        handlerArea,
        handlerStreet,
        resetValue,
        
    }
}