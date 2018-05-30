const pkg = require('./package')

module.exports = {
    mode: 'universal',

    /*
    ** Headers of the page
    */
    head: {
        title: 'title',
        meta: [
            { charset: 'utf-8' },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
            { name: 'viewport', content: 'width=640, user-scalable=yes' },
            { hid: 'keywords', name: 'keywords', content: 'keywords' },
            { hid: 'description', name: 'description', content: 'description' }
        ],
        link: [
            { hid: 'icon', rel: 'icon', type: 'image/x-icon', href: '/static/logo/favicon.ico' },
            { rel: 'stylesheet', type: 'text/css', href: '/css/reset.css' },
            { rel: 'stylesheet', type: 'text/css', href: '/css/quill.core.css' },
            { rel: 'stylesheet', type: 'text/css', href: '/css/quill.snow.css' },
            { rel: 'stylesheet', type: 'text/css', href: '/css/quill.bubble.css' }
        ],
        script: [
            { type: 'text/javascript', src: 'http://api.map.baidu.com/api?v=2.0&ak=WlwKMNs9QBvQPVuh4h02u9dvMPHPokwX' }
        ]
    },

    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#3B8070' },

    /*
    ** router
    */
    router: {
        linkActiveClass: 'active',
        middleware: 'router'
    },

    /*
    ** Global CSS
    */
    // css: [
    //     '~/assets/reset.css',
    //     '~/assets/quill.core.css',
    //     '~/assets/quill.snow.css',
    //     '~/assets/quill.bubble.css'
    // ],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '~/plugins/event-bus',
        '~/plugins/vue-plugins'
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://github.com/nuxt-community/axios-module#usage
        '@nuxtjs/axios'
    ],
    /*
    ** Axios module configuration
    */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
    },

    /*
    ** Build configuration
    */
    build: {
        vendor: [
            'axios',
            '~/plugins/event-bus',
            '~/plugins/vue-plugins'
        ],
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {

        }
    }
}
