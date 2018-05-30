<template>
    <div class="newsDetailVue">
        <div class="banner">
            <img class="img-responsive" :src="'/static/banner/' + banner.img.name" :alt="banner.img.alt"/>
        </div>
        <div class="layout">
            <div class="clearfix newsDetailBox">
                <div class="left contentPack">
                    <h2 class="title" :title="news.title" v-text="news.title"></h2>
                    <div class="clearfix message">
                        <address v-text="news.author"></address>
                        <time v-text="$chGMT(news.updateTime)"></time>
                    </div>
                    <!-- 内容 -->
                    <div class="ql-editor contentInfo" v-html="news.content"></div>
                    <ul class="articleBox">
                        <li v-if="newsLeft.id != -1">
                            <span>上一篇:</span>
                            <a class="text-element" :href="'/news/shenzhen/'+newsLeft.id">{{ newsLeft.title }}</a>
                        </li>
                        <li v-if="newsRight.id != -1">
                            <span>下一篇:</span>
                            <a class="text-element" :href="'/news/shenzhen/'+newsRight.id">{{ newsRight.title }}</a>
                        </li>
                        <li class="share">
                            分享到：
                            <a title="分享到新浪微博" @click="share('weibo')">
                                <img src="@/assets/Weibo.png" alt="分享到新浪微博"/>
                            </a>
                            <a title="分享到QQ空间" @click="share('qzone')">
                                <img src="@/assets/qzone.png" alt="分享到QQ空间"/>
                            </a>
                            <a title="分享到百度贴吧" @click="share('PostBar')">
                                <img src="@/assets/PostBar.png" alt="分享到百度贴吧"/>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="right recomPack">
                    <dl>
                        <dt><strong>推荐阅读</strong></dt>
                        <dd v-for="(recom, index) in recoms" :key="index">
                            <h3>
                                <a 
                                    class="text-elements" 
                                    :href="'/news/shenzhen/'+recom.id" 
                                    :title="recom.title" 
                                    v-text="recom.title">
                                </a>
                            </h3>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        validate ({ params }) {
            return /^\d+$/.test(params.id);
        },
        asyncData ({ store, params, redirect, error }) {
            let id = params.id;
            let type = store.state.news.newsType;
            function banner() {
                return axios.post('/api/banner', {
                        bannerType: 'news'
                    });
            }
            function newsDetail() {
                return axios.post('/api/newsDetail', {
                        params: { type, id }
                    });
            }
            return axios.all([banner(), newsDetail()])
                .then(axios.spread( function(banner, newsDetail) {
                    // Both requests are now complete
                    if (newsDetail.data.status == null) {
                        return redirect('/404');
                    }
                    let _seo = {
                        title: newsDetail.data.result.doc.SEO.title,
                        keywords: newsDetail.data.result.doc.SEO.keywords,
                        description: newsDetail.data.result.doc.SEO.description
                    }
                    // vuex -> news
                    store.commit('seoFn', _seo);
                    return { 
                        banner: banner.data.result,
                        newsLength: newsDetail.data.result.count,
                        newsLeft: newsDetail.data.result.left,
                        newsRight: newsDetail.data.result.right,
                        recoms: newsDetail.data.result.recomArr,
                        news: newsDetail.data.result.doc
                    }
                }));
        },
        data() {
            return {
                banner: {
                    img: {}
                },
                newsLength: 1,          // 数据长度
                newsLeft: {             // 上一篇
                    id: -1,
                    title: ''
                },
                newsRight: {             // 下一篇
                    id: -1,
                    title: ''
                },
                news: [{
                    SEO: {}
                }],
                recoms: [{ id: '', title: '' }]
            }
        },
        methods: {
            share(target) {
                switch(target) {
					case 'weibo':
                        let weibo = {
                            url: 'http://zllease.com' + this.$route.path,
                            title: this.news.title + '。  ' + this.news.summary,
                            pic: 'http://zllease.com'+'/static/news/'+ this.news.thumbnail
                        }
                        window.open('http://service.weibo.com/share/share.php?url='+weibo.url+'&appkey=&title='+weibo.title+'&pic='+weibo.pic+'&ralateUid=&language=zh_cn');
						break;
					case 'qzone':
                        let qzone = {
                            url: 'http://zllease.com' + this.$route.path,
                            title: this.news.title,
                            summary: this.news.summary,
                            pic: 'http://zllease.com'+'/static/news/'+ this.news.thumbnail
                        }
                        window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+qzone.url+'&summary='+qzone.summary+'&title='+qzone.title+'&pics'+qzone.pic);
						break;
                    case 'PostBar':
                        let PostBar = {
                            url: 'http://zllease.com' + this.$route.path,
                            title: this.news.title,
                            pic: 'http://zllease.com'+'/static/news/'+ this.news.thumbnail
                        }
                        window.open('http://tieba.baidu.com/f/commit/share/openShareApi?url='+PostBar.url+'&title='+PostBar.title+'&pic='+PostBar.pic);
						break;
				}
            }
        }
    }
</script>

<style>
    .newsDetailVue {
        background: #F2F2F2;
    }
    .newsDetailBox {
        padding-top: 45px;
        padding-bottom: 75px;
    }
    /* contentPack */
    .contentPack {
        width: 770px;
        padding: 40px;
        background: #fff;
        border: 1px solid #eee;
        box-sizing: border-box;
    }
    .contentPack .title {
        font-size: 24px;
        line-height: 1.5em;
        color: #333;
    }
    .contentPack .message {
        padding: 15px 0;
        margin-bottom: 10px;
    }
    .contentPack .message address,
    .contentPack .message time {
        float: left;
        margin-right: 15px;
        font-size: 12px;
        color: #999;
    }
    .contentPack .contentInfo {
        text-indent: 2em;   /* 缩进2个字符 */
        color: #666;
    }
    .contentPack .contentInfo img {
        max-width: 100%;
    }
    .contentPack .contentInfo strong {
        font-weight: bold;
        font-variant: normal;
    }
    .contentPack p.ql-align-center {
        text-indent: 0;
    }
    .articleBox {
        margin-top: 30px;
    }
    .articleBox li {
        margin-top: 10px;
    }
    .articleBox span,
    .articleBox a {
        display: inline-block;
        font-size: 14px;
    }
    .articleBox span {
        float: left;
        margin-right: 10px;
        color: #999;
    }
    .articleBox a {
        max-width: 400px;
        color: #666;
        cursor: pointer;
    }
    .articleBox a:focus,
	.articleBox a:hover {
		color: #ff0000;
	}
    .articleBox .share {
        padding-top: 15px;
        font-size: 15px;
        color: #666;
    }
    .articleBox .share a {
        margin-right: 5px;
        cursor: pointer;
    }
    /* recomPack */
    .recomPack {
        width: 240px;
        padding: 0 20px 30px;
        background: #fff;
        border: 1px solid #eee;
        box-sizing: border-box;
    }
    .recomPack dt {
        height: 45px;
        border-bottom: 1px solid #eee;
    }
    .recomPack dt strong {
        font-size: 18px;
        line-height: 45px;
        color: #333;
    }
    .recomPack dd {
        padding-top: 10px;
    }
    .recomPack dd a {
        display: block;
        height: 3em;
        font-size: 13px;
        line-height: 1.5em;
        color: #666;
        cursor: pointer;
        text-indent: 2em;   /* 缩进2个字符 */
        -webkit-line-clamp: 2;
    }
    .recomPack dd a:focus,
	.recomPack dd a:hover {
		color: #ff0000;
	}

/* media */
    @media (max-width: 767px) {
        .newsDetailBox {
            padding-top: 30px;
            padding-bottom: 30px;
        }
        .contentPack {
            width: 100%;
            padding: 30px;
        }
        .recomPack {
            width: 100%;
            margin-top: 15px;
            padding: 0 30px 30px;
        }
        .recomPack dd a {
            height: 1.5em;
            font-size: 14px;
            line-height: 1.5em;
            text-indent: 0em;
            -webkit-line-clamp: 1;  /* 显示的行数 */
        }
    }
</style>