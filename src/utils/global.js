import {MessageBox} from 'element-ui';
import { context } from "@vue/composition-api";

export default {
    install(Vue, options) {
        // 注册了一个全局的方法
        Vue.prototype.confirm = (params) => {
            MessageBox.confirm(params.content,params.tips||"提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: params.type||"warning",
                center: true
            }).then(() => {
                params.fn && params.fn()
                // context.root.$message({
                //     type: "success",
                //     message: "删除成功!"
                // });
            }).catch(() => {
                // context.root.$message({
                //     type: "info",
                //     message: "已取消删除"
                // });
            });
        }
    }
}