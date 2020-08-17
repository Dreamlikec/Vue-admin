import {loadTableData} from "@/api/common";
import {requestUrl} from "@/api/requestUrl";
import { reactive, onBeforeMount, onMounted, onUpdated, onBeforeUpdate, onBeforeDestroyed } from "@vue/composition-api";
export function LoadData() {
    const tableData = reactive({
        item: [],
        total:0
    })

    const tableLoadData = (params) => {
        let requestJson = params;
        let requestData = {
            url: requestUrl[requestJson.url],
            method: requestJson.method,
            data: requestJson.data
        }

        loadTableData(requestData).then(response => {
            let responseData = response.data.data.data
            if (responseData && responseData.length > 0) {
                tableData.item = responseData
                tableData.total = responseData.length
                console.log(responseData)
            }
        }).catch(error => {

        })
    }
    return {
        tableData, tableLoadData
    }
}