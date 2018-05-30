<template>
    <div class="leaseDetail">
        <div class="banner">
            <img class="img-responsive" :src="'/static/banner/' + banner.img.name" :alt="banner.img.alt"/>
        </div>
        <div class="layout">
            <ul class="clearfix leaseNews">
                <li class="left">
                    <h2 v-text="lease.placeType +'--'+ lease.title"></h2>
                    <p class="spec">
                        <span v-for="(tagType, index) in lease.tagType" :key="index">{{ tagType }}</span>
                    </p>
                    <time>更新时间：{{ $chGMT(lease.updateTime) }}</time>
                </li>
                <li class="right">
                    <p class="money"><span>{{ lease.moneyType }}</span>元/月</p>
                    <div class="shareBox">
                        <address v-for="(value, key) in lease.linkman" :key="key">
                            {{ key }}：<i>{{ value }}</i>
                        </address>
                        <p class="share">
                            <a title="分享到新浪微博" @click="share('weibo')">
                                <img src="@/assets/Weibo.png" alt="分享到新浪微博"/>
                            </a>
                            <a title="分享到QQ空间" @click="share('qzone')">
                                <img src="@/assets/qzone.png" alt="分享到QQ空间"/>
                            </a>
                            <a title="分享到百度贴吧" @click="share('PostBar')">
                                <img src="@/assets/PostBar.png" alt="分享到百度贴吧"/>
                            </a>
                        </p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="contentBox">
            <ul class="layout">
                <li class="left">
                    <strong class="title">资料</strong>
                    <div class="ql-editor datum" v-html="lease.detail"></div>
                </li>
                <li class="right">
                    <strong class="title">详情</strong>
                    <div class="ql-editor content" v-html="lease.content"></div>
                </li>
            </ul>
        </div>
        <div class="layout">
            <div class="clearfix accordionBox">
                <div class="_title">
                    <span>图片</span>
                </div>
                <ul class="accordion accordion-1">
                    <li v-for="(image, index) in lease.images" :key="index">
                        <img :src="'/static/lease/' + image" height="400" width="640" alt="image"/>
                    </li>
                </ul>
            </div>
        </div>
        <div>
            <div class="_title">
                <span>地图</span>
            </div>
            <!-- 百度地图 -->
            <div id="baiduMap" class="baiduMap"></div>
        </div>
        <div class="recomBox">
            <div class="layout">
                <div class="_title">
                    <span>猜你喜欢</span>
                </div>
                <div class="box-prob">
                    <ul class="prob-con">
                        <li v-for="(_recom, index) in recom" :key="index">
                            <dl class="con-pack">
                                <dd>
                                    <a class="img" :href="'/lease/shenzhen/' + _recom.id">
                                        <img :src="'/static/lease/' + _recom.thumbnail" :alt="_recom.title"/>
                                    </a>
                                </dd>
                                <dd>
                                    <a :href="'/lease/shenzhen/' + _recom.id">
                                        <h3 class="text-element" v-text="_recom.title" :title="_recom.title"></h3>
                                    </a>
                                </dd>
                                <dd class="clearfix">
                                    <span class="left span1" v-text="_recom.placeType"></span>
                                    <span class="span2">
                                        <i>{{ _recom.moneyType }}</i>元/月
                                    </span>
                                </dd>
                            </dl>
                        </li>
                    </ul>
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
            function banner() {
                return axios.post('/api/banner', {
                        bannerType: 'lease'
                    });
            }
            function leaseDetail() {
                return axios.post('/api/leaseDetail', {id});
            }
            return axios.all([banner(), leaseDetail()])
                .then(axios.spread( function(banner, leaseDetail) {
                    // Both requests are now complete
                    if (leaseDetail.data.status == null) {
                        return redirect('/404');
                    }
                    let _seo = {
                        title: leaseDetail.data.result.doc.SEO.title,
                        keywords: leaseDetail.data.result.doc.SEO.keywords,
                        description: leaseDetail.data.result.doc.SEO.description
                    }
                    // vuex -> news
                    store.commit('seoFn', _seo);
                    return { 
                        banner: banner.data.result,
                        lease: leaseDetail.data.result.doc,
                        recom: leaseDetail.data.result.recom
                    }
                }));
        },
        data() {
            return {
                banner: {
                    img: {}
                },
                lease: {
                    map: {
                        lng: '',
                        lat: '',
                        zoom: ''
                    },
                    SEO: {
                        title: '',
                        keywords: '',
                        description: ''
                    }
                },
                recom: []
            }
        },
        mounted() {
            this.baiduMap();     // 百度地图
        },
        methods: {
            share(target) {
                switch(target) {
					case 'weibo':
                        let weibo = {
                            url: 'http://zllease.com' + this.$route.path,
                            title: this.lease.title+'。  '+this.lease.summary,
                            pic: 'http://zllease.com'+'/static/lease/'+ this.lease.thumbnail
                        }
                        window.open('http://service.weibo.com/share/share.php?url='+weibo.url+'&appkey=&title='+weibo.title+'&pic='+weibo.pic+'&ralateUid=&language=zh_cn');
						break;
					case 'qzone':
                        let qzone = {
                            url: 'http://zllease.com' + this.$route.path,
                            title: this.lease.title,
                            summary: this.lease.summary,
                            pic: 'http://zllease.com'+'/static/lease/'+ this.lease.thumbnail
                        }
                        window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+qzone.url+'&summary='+qzone.summary+'&title='+qzone.title+'&pics'+qzone.pic);
						break;
                    case 'PostBar':
                        let PostBar = {
                            url: 'http://zllease.com' + this.$route.path,
                            title: this.lease.title,
                            pic: 'http://zllease.com'+'/static/lease/'+ this.lease.thumbnail
                        }
                        window.open('http://tieba.baidu.com/f/commit/share/openShareApi?url='+PostBar.url+'&title='+PostBar.title+'&pic='+PostBar.pic);
						break;
				}
            },
            baiduMap() {
                // 百度地图API功能
                var lng = this.lease.map.lng;       // 经线
                var lat = this.lease.map.lat;       // 纬线
                var zoom = this.lease.map.zoom;     // 级别
                var map = new BMap.Map("baiduMap");
                    map.centerAndZoom(new BMap.Point(lng, lat), zoom);
                    // 创建标注、将标注添加到地图中
                var point = new BMap.Point(lng, lat);
                    map.addOverlay(new BMap.Marker(point));
                    // 平移缩放控件
                    map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT}));
                    // 地图类型
                    map.addControl(new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_RIGHT}));
                    // 比例尺
                    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));
            }
        }
    }
</script>

<style>
    /* leaseNews */
    .leaseNews {
        position: relative;
        padding-bottom: 45px;
    }
    .leaseNews .left {
        width: 660px;
    }
    .leaseNews .left h2 {
		margin: 30px 0 15px;
		font-size: 20px;
		line-height: 30px;
		color: #4A4A4A;
	}
	.leaseNews .left p.spec span {
		display: inline-block;
		margin: 0 10px 10px 0; 
		padding: 0 10px;
		font-size: 12px;
		line-height: 28px;
		color: #757575;
		border: 1px solid #90d4c2;
	}
    .leaseNews .left time {
        font-size: 14px;
        color: #b4b4b4;
    }
    .leaseNews .right {
        position: absolute;
        top: -90px;
        right: 15px;
        width: 300px;
    }
    .leaseNews .right p.money {
        padding: 0 25px;
		height: 90px;
        font-size: 16px;
		color: #e0dfdf;
        line-height: 90px;
        background: rgba(0, 0, 0, 0.8);
	}
	.leaseNews .right p.money span {
        font-size: 42px;
		color: #fff;
	}
    .leaseNews .right .shareBox {
        padding: 15px 25px;
        border: 1px solid #d8d7d3;
    }
    .leaseNews .right .shareBox address {
        font-size: 16px;
        color: #333;
        line-height: 1.2em;
    }
    .leaseNews .right .shareBox address i {
        font-size: 20px;
        color: #cdaa3a;
    }
    .leaseNews .right .shareBox .share {
        padding-top: 10px;
    }
    .leaseNews .right .shareBox .share a {
        margin-right: 5px;
        cursor: pointer;
    }
    /* contentBox */
    .contentBox {
        padding: 45px 0;
        background: #f9f9f9;
    }
    .contentBox .left,
    .contentBox .right {
        width: 500px;
    }
    .contentBox .title {
        display: block;
        margin-bottom: 15px;
        font-size: 22px;
        color: #4A4A4A;
    }
    .contentBox .datum,
    .contentBox .content {
        text-indent: 2em;   /* 缩进2个字符 */
        color: #757575;
    }
    .contentBox .datum img,
    .contentBox .content img {
        max-width: 100%;
    }
    .contentPack .contentInfo strong {
        font-weight: bold;
        font-variant: normal;
    }
    .contentBox .datum p.ql-align-center,
    .contentBox .content p.ql-align-center {
        text-indent: 0;
    }
    .contentBox .datum p.ql-align-center,
    .contentBox .content p.ql-align-center {
        text-indent: 0;
    }
    .accordionBox {
        padding: 45px 0;
    }
    /* recomBox */
    .recomBox {
        padding: 45px 0;
        background: #f9f9f9;
    }
    .recomBox .box-prob {
        overflow: hidden;
    }
    .recomBox .box-prob .prob-con {
        margin-right: -30px;
    }
    .recomBox .box-prob ul li {
        float: left;
        width: 33.33%;
        padding-right: 30px;
        -webkit-box-sizing: border-box;
           -moz-box-sizing: border-box;
            -ms-box-sizing: border-box;
             -o-box-sizing: border-box;
                box-sizing: border-box;
    }
    .recomBox .con-pack .img {
        display: block;
        height: 220px;
        overflow: hidden;
    }
    .recomBox .con-pack .img img {
        display: block;
        height: auto;
        width: 100%;
        max-width: 100%;
    }
    .recomBox .con-pack h3 {
        font-size: 16px;
        line-height: 1.5em;
        padding: 10px 0;
        color: #4A4A4A;
        overflow: hidden;
    }
    .recomBox .con-pack .span1 {
        margin-right: 15px;
        font-size: 16px;
        line-height: 20px;
        color: #90D4C2;
    }
    .recomBox .con-pack .span2 {
        font-size: 14px;
        color: #757575;
    }
    .recomBox .con-pack .span2 i {
        margin-right: 5px;
        font-size: 24px;
        color: #CDAA3A;
    }
    ._title {
        margin-bottom: 30px;
        font-size: 30px;
        color: #4A4A4A;
        text-align: center;
    }
    ._title span {
        display: inline-block;
        line-height: 50px;
    }
    ._title span::before {
        position: absolute;
        left: 50%;
        margin-left: -220px;
        border-bottom: 1px solid #d5d5d5;
        height: 25px;
        width: 150px;
        content: "";
    }
    ._title span::after {
        position: absolute;
        right: 50%;
        margin-right: -220px;
        border-bottom: 1px solid #d5d5d5;
        height: 25px;
        width: 150px;
        content: "";
    }
    /* 纯CSS3幻灯手风琴效果hover切换 */
    .accordion {
        height: 400px;
        overflow: hidden;
    }
    .accordion li {
        float: left;
        width: 50px;
        height: 100%;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        -webkit-transition: width 0.5s ease-out;
           -moz-transition: width 0.5s ease-out;
            -ms-transition: width 0.5s ease-out;
                transition: width 0.5s ease-out;
    }
    .accordion:hover li:not(:hover) {
        width: 50px;
    }
    .accordion li:hover {
        width: 640px;
    }
    /* 百度地图 */
    .baiduMap {
        height: 400px;
        width: 100%; 
        margin: 0; 
        overflow: hidden;
    }
    /* 去掉地图左下角的百度LOGO */
    .baiduMap .anchorBL { display: none; }

/* media */
    @media (max-width: 767px) {
        /* leaseNews */
        .leaseNews {
            padding-bottom: 30px;
        }
        .leaseNews .left {
            width: 400px;
        }
        .leaseNews .left h2 {
            margin: 20px 0 10px;
            font-size: 16px;
            line-height: 1.5em;
        }
        .leaseNews .left p.spec span {
            padding: 0 5px;
            line-height: 24px;
        }
        .leaseNews .left time {
            font-size: 13px;
        }
        .leaseNews .right {
            top: -45px;
            right: 0;
            width: 200px;
        }
        .leaseNews .right p.money {
            padding: 0 10px;
            height: 45px;
            font-size: 12px;
            line-height: 45px;
        }
        .leaseNews .right p.money span {
            font-size: 24px;
        }
        .leaseNews .right .shareBox {
            padding: 10px;
        }
        .leaseNews .right .shareBox address {
            font-size: 14px;
        }
        .leaseNews .right .shareBox address i {
            font-size: 18px;
        }
        /* contentBox */
        .contentBox {
            padding: 30px 0;
        }
        .contentBox .left {
            margin-bottom: 15px;
        }
        .contentBox .left,
        .contentBox .right {
            width: 100%;
        }
        /*  &&  */
        ._title {
            margin-bottom: 20px;
            font-size: 24px;
        }
        .recomBox .box-prob ul li {
            padding-right: 15px;
        }
        .recomBox .con-pack .img {
            height: 130px;
        }
        .recomBox .con-pack h3 {
            padding: 0;
            margin: 10px 0;
            height: 3em;                /* 2倍行高 */
            width: 13em;
            font-size: 15px;
            line-height: 1.5em;
            white-space: pre-wrap;      /* 换行 */
            -webkit-line-clamp: 2;      /* 显示的行数 */
            word-break: break-all;			/* 允许在单词内换行 */
            display: -webkit-box;			/* 对象作为伸缩盒子模型显示 */
		    -webkit-box-orient: vertical;	/* 设置或检索伸缩盒对象的子元素的排列方式 */
        }
        /* 纯CSS3幻灯手风琴效果hover切换 */
        .accordion {
            height: 240px;
        }
        .accordion li {
            width: 30px;
        }
        .accordion:hover li:not(:hover) {
            width: 30px;
        }
        .accordion li:hover {
            width: 480px;
        }
        /* 百度地图 */
        .baiduMap {
            height: 240px;
        }
    }
</style>