import { reactive } from "@vue/composition-api"
import { Message } from "element-ui";

// 对各个参数进行验证
export function validateParamsfun(){
    const ParamsData = reactive({
        coldRegion:["北京","青岛","徐州","临沂"],
        shwcRegion:["南京","武汉","长沙","上海"],
        shwwRegion:["深圳"],
        buildtypeMatch:{
            "办公建筑":"Office",
            "住宅建筑":"Resident",
            "商业建筑":"Shopping"
        },
        coldRegionResidentData:{
            AC:{
                min:0.1,
                max:0.5
            },
            uw:{
                min:0.4,
                max:0.6
            },
            uf:{
                min:1,
                max:3
            },
            shgc:{
                min:0.4,
                max:0.6
            },
            glz_n:{
                min:0.2,
                max:0.3
            },
            glz_ew:{
                min:0.2,
                max:0.35
            },
            glz_s:{
                min:0.2,
                max:0.5
            },
            sum_point:{
                min:25,
                max:27
            },
            win_point:{
                min:18,
                max:22
            }
        },
        shwcRegionResidentData:{
            AC:{
                min:0.1,
                max:1
            },
            uw:{
                min:0.6,
                max:1,
            },
            uf:{
                min:1,
                max:3
            },
            shgc:{
                min:0.4,
                max:0.6
            },
            glz_n:{
                min:0.2,
                max:0.4
            },
            glz_ew:{
                min:0.2,
                max:0.35
            },
            glz_s:{
                min:0.2,
                max:0.45
            },
            sum_point:{
                min:25,
                max:27
            },
            win_point:{
                min:18,
                max:22
            }
        },
        shwwRegionResidentData:{
            AC:{
                min:0.1,
                max:1
            },
            uw:{
                min:1,
                max:2
            },
            uf:{
                min:1,
                max:3
            },
            shgc:{
                min:0.4,
                max:0.6
            },
            glz_n:{
                min:0.2,
                max:0.4
            },
            glz_ew:{
                min:0.2,
                max:0.3
            },
            glz_s:{
                min:0.2,
                max:0.4
            },
            sum_point:{
                min:25,
                max:27
            },
            win_point:{
                min:18,
                max:22
            }
        },
        coldRegionOfficeData:{
            height:{min:3.2,max:4.5},
            glzRatio:{min:0.4,max:0.6},
            uw:{min:0.4,max:0.6},
            uf:{min:1.0,max:3.0},
            air:{min:20,max:30},
            shgc:{min:0.4,max:0.6},
            light:{min:8,max:12},
            equip:{min:10,max:15},
            sum_point:{min:25,max:27},
            win_point:{min:18,max:22}
        },
        shwcRegionOfficeData:{
            height:{min:3.2,max:4.5},
            glzRatio:{min:0.4,max:0.6},
            uw:{min:0.4,max:0.6},
            uf:{min:1.0,max:3.0},
            air:{min:20,max:30},
            shgc:{min:0.4,max:0.6},
            light:{min:8,max:12},
            equip:{min:10,max:15},
            sum_point:{min:25,max:27},
            win_point:{min:18,max:22}
        },

        htRange:{
            "北京":["2019-11-15","2020-3-15"],
            "青岛":["2019-11-15","2020-4-5"],
            "临沂":["2019-11-5","2020-3-31"],
            "徐州":["2019-11-15","2020-3-15"],
            "武汉":["2019-11-15","2020-3-15"],
            "长沙":["2019-11-15","2020-3-15"],
            "南京":["2019-11-15","2020-3-15"],
            "上海":["2019-11-15","2020-2-15"],
            "深圳":["2019-11-15","2020-2-15"]
        },
        clRange:{
            "北京":["2019-6-15","2020-9-15"],
            "青岛":["2019-6-15","2020-9-15"],
            "临沂":["2019-6-15","2020-9-15"],
            "徐州":["2019-6-15","2020-9-15"],
            "武汉":["2019-6-15","2020-9-15"],
            "长沙":["2019-6-15","2020-9-15"],
            "南京":["2019-6-15","2020-9-15"],
            "上海":["2019-6-15","2020-9-30"],
            "深圳":["2019-6-15","2020-9-30"]
        },
        RecomParams:{
            "青岛":{"住宅建筑":{area:"",glz_n:"0.3",glz_ew:"0.2",glz_s:"0.4",AC:"0.1",uw:"0.5",uf:"1.2",shgc:"0.6",sum_point:"25",win_point:"18"}},
            "临沂":{"住宅建筑":{area:"",glz_n:"0.3",glz_ew:"0.2",glz_s:"0.4",AC:"0.5",uw:"0.5",uf:"1.2",shgc:"0.6",sum_point:"25",win_point:"18"}},
            // "临沂":{"住宅建筑":{area:"",glz_n:"0.3",glz_ew:"0.2",glz_s:"0.4",AC:"0.1",uw:"0.5",uf:"1.2",shgc:"0.6",sum_point:"25",win_point:"18"}},
            "北京":{"住宅建筑":{area:"",glz_n:"0.3",glz_ew:"0.35",glz_s:"0.5",AC:"0.1",uw:"0.5",uf:"1.6",shgc:"0.6",sum_point:"25",win_point:"18"}},
            "徐州":{"住宅建筑":{area:"",glz_n:"0.3",glz_ew:"0.2",glz_s:"0.4",AC:"0.1",uw:"0.5",uf:"1.2",shgc:"0.6",sum_point:"25",win_point:"18"}},
            "南京":{"住宅建筑":{area:"",glz_n:"0.3",glz_ew:"0.2",glz_s:"0.4",AC:"0.5",uw:"0.5",uf:"1.2",shgc:"0.6",sum_point:"25",win_point:"18"}},
            "武汉":{"住宅建筑":{area:"",glz_n:"0.3",glz_ew:"0.2",glz_s:"0.45",AC:"0.6",uw:"1",uf:"1.5",shgc:"0.6",sum_point:"25",win_point:"18"}},
            "长沙":{"住宅建筑":{area:"",glz_n:"0.4",glz_ew:"0.2",glz_s:"0.45",AC:"0.5",uw:"1",uf:"2.5",shgc:"0.6",sum_point:"25",win_point:"18"}},
        }
        
    });
    const bindRegion = (city) =>{
        let region =""
        ParamsData.coldRegion.forEach(item=>{
            if(item===city){
                region = "coldRegion"
            }
        })
        ParamsData.shwcRegion.forEach(item=>{
            if(item===city){
                region = "shwcRegion"
            }
        })
        return region
    };
    const validateParam = (region,buildtype,key,value)=>{
        var message = ""
        buildtype = ParamsData["buildtypeMatch"][buildtype]
        if(key === "area" && value<0 && value){
            message = "请输入大于0的数" 
        }
        else{
            var regionData = `${region}${buildtype}Data`
            console.log(regionData) 
            let regionOptions = ParamsData[regionData]
            for (let param in regionOptions){
                if(param === key){
                    let minVal = regionOptions[param].min
                    let maxVal = regionOptions[param].max
                    if(!(value<= maxVal && value>=minVal)){
                        message = `请输入${minVal}-${maxVal}之间的值`
                    }
                }
            }
        }
        return message
    };
    const validateSubmit = (data) =>{
        if(!data.city){
            Message.error("请选择城市")
            return false
        }
        if(!data.htdateRange){
            Message.error("请输入供暖日期")
            return false
        }
        if(!data.cldateRange){
            Message.error("请输入制冷日期")
            return false
        }
        let buildsInfo = data.editableTabs
        for(let buildindex in buildsInfo){
            let buildname = buildsInfo[buildindex].title
            if(buildsInfo[buildindex].buildtype === ""){
                Message.error(`${buildname}的建筑类型不能为空`)
                return false
            }
            let buildParams = buildsInfo[buildindex].params
            let buildWarning = buildsInfo[buildindex].warning
            for(let param in buildParams){
                let paramValue = buildParams[param]
                let paramWarning = buildWarning[param]
                let paramlabel = buildsInfo[buildindex].label[param].replace(/[^\u4e00-\u9fa5]/gi, "")
                if(paramValue === ""){   
                    Message.error(`${buildname}的${paramlabel}不能为空`)
                    return false 
                }
                if(paramWarning!=""){
                    Message.error(`请检查${buildname}的${paramlabel}`)
                    return false
                }
            }

        }
        return true
    };
    const autoSethtRangefun = (city)=>{
        let htRange = ParamsData.htRange
        for(let item in htRange){
            if(item === city){
                return htRange[item]
            }
        }
    };
    const autoSetclRangefun = (city) =>{
        let clRange = ParamsData.clRange
        for(let item in clRange){
            if(item === city){
                return clRange[item]
            }
        }
    };
    const autoSetRecomParamsfun = (city,buildtype) =>{
        var recomlist = new Object()
        var RecomParams = ParamsData.RecomParams
        Object.keys(RecomParams).forEach(item=>{
            if(item === city){
                Object.keys(RecomParams[item]).forEach(subitem=>{
                    if(subitem === buildtype){
                        recomlist = RecomParams[item][subitem]
                        
                    }
                })
            }
        })
        return JSON.stringify(recomlist)
    }
    return{
        ParamsData,
        bindRegion,
        validateParam,
        validateSubmit,
        autoSethtRangefun,
        autoSetclRangefun,
        autoSetRecomParamsfun
    }
}
