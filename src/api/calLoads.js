import service from "@/utils/requestDjango";

export function CalLoads(data){
    return service.request({
        method: "post",
        url: "/CalLoads/",
        data: data
    })
}