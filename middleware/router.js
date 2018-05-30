import axios from 'axios'

export default function ({ store, route, redirect }) {
    axios.post('/api/seo').then( (response) => {
        let _icon = { icon: response.data.result.icon }
        let _h1 = { h1: response.data.result.h1 }
        let _seo = {
            title: response.data.result.SEO.title,
            keywords: response.data.result.SEO.keywords,
            description: response.data.result.SEO.description
        }
        // vuex -> SEO
        store.commit('iconFn', _icon);
        store.commit('h1Fn', _h1);
        store.commit('seoFn', _seo);
    }).catch( (error) => {
        console.log(error);
    });
    if (route.path == '/') {
        return redirect('/lease');
    }
}