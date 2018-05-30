import Vue from 'vue'

// 全局组件 (v -> 全局)
    import vHeader from '~/components/header'
    import vFooter from '~/components/footer'
    import vPagination from '@/components/pagination'
    Vue.component('v-header', vHeader)
    Vue.component('v-footer', vFooter)
    Vue.component('v-pagination', vPagination)

// -- 格林威治时间转换  
    Date.prototype.format = function(format){
        let o = {
            "M+" : this.getMonth()+1,                   //month
            "d+" : this.getDate(),                      //day
            "h+" : this.getHours(),                     //hour
            "m+" : this.getMinutes(),                   //minute
            "s+" : this.getSeconds(),                   //second
            "q+" : Math.floor((this.getMonth()+3)/3),   //quarter
            "S" : this.getMilliseconds()                //millisecond
        }
        if (/(y+)/.test(format))
            format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    }
    Vue.prototype.$chGMT = function(gmtDate) {
        let mydate = new Date(gmtDate);
        mydate.setHours(mydate.getHours());
        return mydate.format("yyyy-MM-dd hh:mm:ss");
    }