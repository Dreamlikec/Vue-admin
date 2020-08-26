<template>
    <div id="loads_pie"></div>
</template>
<script>

import { echartsResizefun } from "@/utils/common";
import echarts from 'echarts';
import "../../../../styles/EchartsTheme/roma.js";
import { reactive, onMounted, watch } from '@vue/composition-api'
export default {
    name:"LoadsPie",
    setup(props,{root,emit}){
        const data = reactive({
            dataset:{
                source:[['status'],['0~25%'],['25%~50%'],['50%~75%'],['75%~100%']]
            }
        })
    
        const DrawPie = () =>{
            let loadsPiechart = echarts.init(document.getElementById("loads_pie"),"roma");
            let option = {
                title: [{
                    text: '部分负荷占比饼图',
                    left: 'center'
                },{
                    subtext:"冷负荷占比情况",
                    left: '30%',
                    top:"22%",
                    textAlign: 'center'
                }, {
                    subtext: "热负荷占比情况",
                    left: '75%',
                    top:'22%',
                    textAlign: 'center'
                }],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['0~25%', '25%~50%', '50%~75%', '75%~100%']
                },
                dataset:data.dataset,
                // dataset: {
                //     source: [
                //         ['status', "冷负荷", '热负荷'],
                //         ['0~25%', 41.1, 30.4],
                //         ['25%~50%', 86.5, 92.1],
                //         ['50%~75%', 24.1, 67.2],
                //         ['75%~100%', 55.2, 67.1]
                //     ]
                // },
                series: [{
                    name:'冷负荷',
                    type: 'pie',
                    radius: 100,
                    center: ['30%', '60%'],
                    encode:{
                        itemName:'status',
                        value:'冷负荷'
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                            }
                        }
                    }, {
                    name:'热负荷',
                    type: 'pie',
                    radius: 100,
                    center: ['75%', '60%'],
                    encode: {
                        itemName: 'status',
                        value: '热负荷'
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    }
                }]
                

            };
            loadsPiechart.setOption(option);
            // echartsResizefun(loadsPiechart)

        }
        watch([
            () => root.$store.state.loads.loadsPercentResult.clper,
            () => root.$store.state.loads.loadsPercentResult.htper],([clper,htper])=>{
                if(clper==[]||htper==[]) return false
                let source = data.dataset.source
                for(let i = 0;i<source.length;i++){
                    source[i].push(clper[i])
                    source[i].push(htper[i])
                }
                DrawPie()
            })
        return{
            DrawPie,data,echartsResizefun
        }
    }
}
</script>
