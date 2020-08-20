<template>
    <div>
    <div class="legend_container">
        <ul>
            <li v-for="item in data.legendData" :key="item">
                <button class="btn-link btn-legend-item" @click="changeLegend(item,$event)"><span class="legend-item-bg" :style="'background-color:'+data.legendColor[item]"></span>{{item}}</button>
            </li>
        </ul>
    </div>
    <div id="loads_bar" class="chart"></div>
    </div>
</template>
<script>

import echarts from 'echarts';
import "../../../../styles/EchartsTheme/roma.js";
import { reactive, onMounted, watch } from "@vue/composition-api";
export default {
  name: "LoadsBar",
  setup(props, { root,emit }) {
    const data = reactive({
      res:props.config,
      xData:[],
      series:[],
      legendData:[],
      legendColor:{},
      storage:{},
      colors:['#E01F54','#001852','#f5e8c8','#b8d2c7','#c6b38e',
        '#a4d8c2','#f3d999','#d3758f','#dcc392','#2e4783',
        '#82b6e9','#ff6347','#a092f1','#0a915d','#eaf889',
        '#6699FF','#ff6666','#3cb371','#d5b158','#38b6b6']
    })
    
    const DrawLine = () => {
      let loadsBarchart = echarts.init(document.getElementById("loads_bar"),"roma");
      let optionData = {
        tooltrip:{
          trigger:"axis"
        
        },
        title: {
            text: '全年建筑负荷柱状图',
            left: 'left'
        },
        toolbox: {
          feature: {
              magicType: {
                  type: ['stack', 'tiled']
              },
              dataView: {},
              saveAsImage: {
                  pixelRatio: 2
              }
          }
        },
        legend:{
          textStyle: { //图例文字的样式
              fontSize: 10
          },
          selectedMode:'single',
            itemWidth: 15,
            itemHeight: 5
        },
        grid:{
          left:"3%",
          right:"7%",
          bottom:"3%",
          containLabel:true
        },
        // dataZoom: [{
        //   type: 'slider',
        //   show: true,
        //   xAxisIndex: [0],
        //   left: '9%',
        //   bottom: -5,
        //   start: 10,
        //   end: 90 //初始化滚动条
        // }],
        dataZoom: [{
            type: 'slider',
            start: 10,
            end: 50,
            bottom: -40,
        }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 1,
                shadowOffsetY: 1
            }
        }],
        xAxis:[{
          type:'category',
          axisTick:{
            alignWithLabel: true
          },
          splitLine:{
            show:false
          },
          textStyle: {
            fontSize : 12  //更改坐标轴文字大小
          },
          data:data.xData,
          name:"时间",
          interval:3600*24*1000,
          axisLabel:{
            formatter:function(value,index){
              var date = new Date(value)
              return (date.getMonth()+1) +'/'+ date.getDate() + "\n" +date.getHours()+":00:00"
            }
          }
        }],
        yAxis:[
          {
            type:'value',
            name:'负荷值(W)'
          }
        ],
        series:data.series
      }
      loadsBarchart.setOption(optionData);
    };
    const mapSeason = (season) =>{
      return season == "summer"? "夏季冷负荷":"冬季热负荷"
    }
    const fetchData = () =>{
      var resData = data.res['resultData']
      let _legendData = []
      let _legendColor = {}
      let _series = []
      Object.keys(resData).forEach((key,index) =>{
        if(!_legendData.includes(key)){
          _legendColor[key] = data.colors[_legendData.length]
          _legendData.push(key)
        }
        let infoDetail = resData[key]
        Object.keys(infoDetail).forEach((subkey,subindex)=>{
          let obj = {
            name:mapSeason(subkey),
            type:'bar',
            smooth:true,
            dbname:key,
            color:_legendColor[key],
            data:infoDetail[subkey]['value_list']
          }
          _series.push(obj)
          data.legendData = _legendData
          data.legendColor = _legendColor
          data.series = _series
        })
      })
      data.xData = data.res['Date']
      DrawLine()
    }
    const changeLegend = ((item,e)=>{
      console.log(data.legendColor)
      let _obj = {}
      let len = data.series.length
      let _data = data.series
      let thisDom = e.currentTarget;
      thisDom.classList.toggle('btn-selected');
      for (let i = 0; i < len; i++) {
          if (item === _data[i].dbname) {
              //如果为空，说明被选，置为存储的数据
              if (_data[i].data.length === 0) {
                  _data[i].data = data.storage[item][_data[i].name]
              } else {
                  //先存数据，再置为空
                  _obj[_data[i].name] = _data[i].data;
                  _data[i].data = []
              }
          }
      }
      //存到storage数据里
      data.storage[item] = _obj;
      DrawLine()
    })
    watch(()=> root.$store.getters["loads/resultData"],()=>{
      emit("ParentshowResult")
      data.res =  root.$store.getters["loads/resultData"]
      fetchData()
    })

    return {
        data,DrawLine,fetchData,changeLegend,mapSeason
    };
  }
};
</script>
<style scoped lang="scss">
.legend_container {
  box-sizing: border-box;
  text-align: center !important; 
  position: relative;
  margin-bottom: 10px;
  & ul{
    display: inline;
    line-height: 12px;
    font-size:12px;
    & li{
        display: inline;
        font-size:12px;
        line-height: 12px;
    }
  }
}

.chart{
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  padding-bottom: 10px;
}

.btn-link,
.btn-link:active,
.btn-link:focus,
.btn-link:hover {
  border-color: transparent;
  background-color: transparent;
  box-shadow: none;
}
.btn-legend-item {
  color: rgb(72, 72, 72);
  padding: 0px;
}
.legend-item-bg {
  display: inline-block;
  width: 20px;
  height: 12px;
  margin-right: 5px;
  border-radius: 2px;
}
.btn-selected {
  opacity: 0.3;
}
</style>