<template>
    <div class="newsVue">
        <div class="banner">
            <img class="img-responsive" :src="'/static/banner/' + banner.img.name" :alt="banner.img.alt"/>
        </div>
        <div class="layout">
            <news-nav></news-nav>
            <ul class="navContent">
                <li class="NoData" v-show="news.length==0">
                    <img src="@/assets/NoData.png" alt="暂无数据"/>
                </li>
                <li class="clearfix" v-for="(_news, index) in news" :key="index">
                    <div class="_left">
                        <figure>
                            <router-link :to="{ path: `/news/shenzhen/${_news.id}` }">
                                <img class="img-responsive" :src="'/static/news/' + _news.thumbnail" :alt="_news.title"/>
                            </router-link>
                        </figure>
                    </div>
                    <div class="_right">
                        <router-link :to="{ path: `/news/shenzhen/${_news.id}` }">
                            <h2 class="text-element" :title="_news.title" v-text="_news.title"></h2>
                        </router-link>
                        <p class="text-elements" v-text="_news.summary"></p>
                        <router-link class="hidden-xs linkbtn" :to="{ path: `/news/shenzhen/${_news.id}` }">查看详情</router-link>
                    </div>
                </li>
            </ul>
            <!-- 分页 -->
            <div class="pageBox">
                <v-pagination 
                    :all="page.all" 
                    :current="page.current" 
                    :left="pageLeft" 
                    :right="pageRight"
                    :turn="pageTurn">
                </v-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import newsNav from '~/components/views/newsNav'
    import axios from 'axios'
    export default {
        validate ({ params }) {
            if (params.id == undefined) {
                params.id = 1;
            }
            return /^\+?[1-9][0-9]*$/.test(params.id);
        },
        asyncData ({ store, params, error }) {
            let id = params.id;
            let type = store.state.news.newsType;
            function banner() {
                return axios.post('/api/banner', {
                        bannerType: 'news'
                    });
            }
            function newsPage() {
                return axios.post('/api/news', {
                        params: { type, page: id }
                    });
            }
            return axios.all([banner(), newsPage()])
                .then(axios.spread( function(banner, newsPage) {
                    // Both requests are now complete
                    if (newsPage.data.status == null) {
                        return redirect('/404');
                    }
                    return { 
                        banner: banner.data.result,
                        news: newsPage.data.result.doc,
                        page: {
                            all: newsPage.data.result.count,
                            current: newsPage.data.result.current
                        }
                    }
                }));
        },
        data() {
            return {
                banner: {
                    img: {}
                },
                news: [{
                    SEO: {}
                }],
                page: {
                    all: 1,             // 记录总页数
                    current: 1          // 当前的页数
                }
            }
        },
        components: {
            newsNav
        },
        computed: {
            _newsType() {
                return this.$store.state.news.newsType;
            }
        },
        watch: {
            _newsType() {
                this.newsPagePost(1);
            }
        },
        methods: {
            newsPagePost(page) {
                // type(vuex) -> 分类; page -> 当前页
                let type = this.$store.state.news.newsType;
                axios.post('/api/news', {
                    params: { type, page }
                }).then( (response) => {
                    let res = response.data;
                    if ( res.status == 1 ) {
                        this.page.all = res.result.count;
                        this.page.current = res.result.current;
                        this.news = res.result.doc;
                    }
                }).catch( (error) => {
                    console.log(error);
                });
            },
            pageLeft(left) {
                this.page.current = --left;
                this.$router.push({path: '/news/'+left});
            },
            pageRight(right) {
                this.page.current = ++right;
                this.$router.push({path: '/news/'+right});
            },
            pageTurn(turn) {
                this.page.current = turn;
                this.$router.push({path: '/news/'+turn});
            }
        }
    }
</script>

<style>
    .newsVue {
        background: #F2F2F2;
    }
    .navContent li {
        height: 180px;
        margin-bottom: 30px;
        padding: 15px;
        background: #fff;
        border: 1px solid #eee;
    }
    .navContent ._left {
        float: left;
        height: 180px;
        width: 360px;
        overflow: hidden;
    }
    .navContent ._right {
        float: right;
        height: 180px;
        width: 580px;
    }
    .navContent ._right h2 {
        width: 480px;
        font-size: 18px;
        line-height: 45px;
        color: #333;
    }
    .navContent ._right p {
        height: 4.5em;          /* 3倍行高 */
        font-size: 14px;
        line-height: 1.5em;
        color: #666;
        letter-spacing: 2px;    /* 子间距 */
        -webkit-line-clamp: 3;  /* 显示的行数 */
    }
    .navContent ._right .linkbtn {
        float: right;
        display: inline-block;
        height: 36px;
        width: 110px;
        margin-top: 30px;
        font-size: 14px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        background: #7bcfee;
        border-radius: 4px;
        cursor: pointer;
    }
    /* 分页 */
    .pageBox {
        padding: 30px 0;
    }

/* media */
    @media (max-width: 767px) {
        .navContent li {
            height: auto;
            margin-bottom: 10px;
            padding: 10px;
        }
        .navContent ._left {
            height: 105px;
            width: 210px;
        }
        .navContent ._right {
            height: 105px;
            width: 375px;
        }
        .navContent ._right h2 {
            width: 100%;
            line-height: 2em;
        }
    }
</style>