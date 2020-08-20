export function timestampToTime(timestamp) {
    var time = new Date(timestamp * 1000);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    // return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
}

// 将el-table中的内容下载下来
import FileSaver from "file-saver";
import XLSX from "xlsx";
import echarts from 'echarts';

export function exportExcel(id) {
    let et = XLSX.utils.table_to_book(document.querySelector(`#${id}`)); //此处传入table的DOM节点
    let etout = XLSX.write(et, { 
      bookType: 'xlsx', 
      bookSST: true, 
      type: 'array' 
    });
    try {
        FileSaver.saveAs(new Blob([etout], { 
            type: 'application/octet-stream' 
        }), 'loads.xlsx');   //trade-publish.xlsx 为导出的文件名
    } catch (e) {
        console.log(e, etout) ;
    }
    return etout;
}
// 监听echarts的尺寸变化适应父元素
import elementResize from 'element-resize-detector'
export function echartsResizefun(echartinstance){
    var eleResize = elementResize({
        strategy:"scroll",
        callOnAdd:true
    })
    eleResize.listenTo(echartinstance,function(element){
        echarts.init(echartinstance).resize()    
    })
}