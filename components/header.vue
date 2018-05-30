<template>
    <header class="head">
        <div class="layout">
            <a class="left black logolink" href="/">
                <img :src="logoSrc" :alt="h1"/>
            </a>
            <nav class="right column">
                <h1 class="text-element" v-text="h1" :title="h1"></h1>
                <router-link class="columnlink" to="/lease">招租</router-link>
                <router-link class="columnlink" to="/news">新闻</router-link>
                <router-link class="columnlink" to="/contact">联系我们</router-link>
            </nav>
        </div>
    </header>
</template>

<script>
    import axios from 'axios'
    import eventBus from '~/plugins/event-bus.js'
    export default {
        head() {
            return {
                link: [
                    { hid: 'icon', rel: 'icon', type: 'image/x-icon', href: '/static/logo/'+this.$store.state.icon }
                ],
                title: this.$store.state.SEO.title,
                meta: [
                    { hid: 'keywords', name: 'keywords', content: this.$store.state.SEO.keywords },
                    { hid: 'description', name: 'description', content: this.$store.state.SEO.description },
                ]
            }
        },
        data() {
            return {
                logoSrc: '/transparent.png',
                h1: this.$store.state.h1,
                system: {
                    SEO: {},
                    message: {}
                }
            }
        },
        created() {
            this.systemPost();
        },
        methods: {
            systemPost() {
                axios.post('/api/system').then( (response) => {
                    let res = response.data;
                    if ( res.status == 1 ) {
                        this.system = res.result;
                        this.logoSrc = '/static/logo/' + res.result.logo;
                        // eventBus
                        eventBus.$emit('system', this.system);
                    }
                }).catch( (error) => {
                    console.log(error);
                });
            }
        }
    }
</script>

<style>
	.head {
		background: #fff;
		border-bottom: 1px solid #DCDCDC;
		box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
	}
	.logolink {
		height: 70px;
		width: 200px;
        font-size: 0;
        text-align: left;
        overflow: hidden;
	}
    .logolink::after {
        height: 100%;
        content: '';
        display: inline-block;
        vertical-align: middle;
    }
	.logolink img {
        max-height: 100%;
        max-width: 100%;
        vertical-align: middle;
	}
	.column h1 {
        float: left;
        height: 70px;
		max-width: 360px;
		margin-right: 30px;
        color: #888;
		font-size: 14px;
        line-height: 70px;
        text-align: right;
		letter-spacing: 3px;    /* 子间距 */
	}
	.column .columnlink {
		float: left;
		display: inline-block;
        height: 70px;
		padding-left: 30px;
		padding-right: 30px;
		font-size: 15px;
		line-height: 70px;
		text-align: center;
		color: #666;
		border-left: 1px solid #eee;
	}
	.column .columnlink:last-child {
		border-right: 1px solid #eee;
	}
	.column .columnlink:focus,
	.column .columnlink:hover {
		background: #F5F5F5;
	}
    .column a.active {
        background: #F5F5F5;
    }
/* media */
    @media (max-width: 767px) {
        .logolink {
            width: 150px;
        }
        .column h1 {
            max-width: 220px;
            margin-right: 15px;
            font-size: 13px;
        }
        .column .columnlink {
            padding-left: 15px;
            padding-right: 15px;
            font-size: 15px;
        }
    }
</style>