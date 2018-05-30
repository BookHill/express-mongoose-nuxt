import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
    state: {
        icon: '/static/logo/favicon.ico',
        h1: '深圳写字楼租赁,深圳办公室租赁,深圳租赁信息网',
        SEO: {
            title: '写字楼、办公室租赁',
            keywords: '写字楼、办公室租赁',
            description: '写字楼、办公室租赁'
        },
        lease: {
            positionType: 'allType',    // 区域类型
            areaType: 'allType',        // 面积类型
            rentalType: 'allType'       // 租金类型
        },
        news: {
            newsType: 'allType'         // 新闻类型
        }
    },
    mutations: {
        iconFn (state, obj) {
            state.icon = obj.icon;
        },
        h1Fn (state, obj) {
            state.h1 = obj.h1;
        },
        seoFn (state, obj) {
            state.SEO.title = obj.title;
            state.SEO.keywords = obj.keywords;
            state.SEO.description = obj.description;
        },
        leaseFn (state, objType) {
            switch (objType.type) {
                case 'position':
                    state.lease.positionType = objType.value;
                    break;
                case 'area':
                    state.lease.areaType = objType.value;
                    break;
                case 'rental':
                    state.lease.rentalType = objType.value;
                    break;
            }
        },
        newsFn (state, type) {
            state.news.newsType = type;
        }
    }
})

export default store