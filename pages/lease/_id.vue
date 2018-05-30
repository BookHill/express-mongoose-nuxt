<template>
    <div class="leaseVue">
        <div class="layout">
            <lease-nav></lease-nav>
            <div class="leaseBox">
                <div class="leaseFilter">
                    <span>排序方式：</span>
					<a v-show="moneySort==1" @click="sort(-1)">价格&nbsp;<i>↑</i></a>
                    <a v-show="moneySort==-1" @click="sort(1)">价格&nbsp;<i>↓</i></a>
                </div>
                <div class="leasePack">
                    <div class="NoData" v-show="leases.length==0">
                        <img src="@/assets/NoData.png" alt="暂无数据"/>
                    </div>
                    <article class="clearfix item" v-for="(lease, index) in leases" :key="index">
                        <router-link class="img" :to="'/lease/shenzhen/' + lease.id">
                            <img class="img-responsive" :src="'/static/lease/' + lease.thumbnail" :alt="lease.title"/>
                        </router-link>
                        <div class="news">
                            <router-link :to="'/lease/shenzhen/' + lease.id">
                                <h2  class="text-element" :title="lease.title" v-text="lease.title"></h2>
                            </router-link>
                            <p class="text-elements summary" v-text="lease.summary"></p>
                            <p class="spec">
                                <span v-for="(tagType, index) in lease.tagType" :key="index">{{ tagType }}</span>
                            </p>
                        </div>
                        <div class="money">
                            <p><span>{{ lease.moneyType }}</span>元/月</p>
                        </div>
                    </article>
                </div>
            </div>
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
    import leaseNav from '~/components/views/leaseNav'
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
            // type(vuex) -> 分类; page -> 当前页
            let type = {
                position: store.state.lease.positionType,
                area: store.state.lease.areaType,
                rental: store.state.lease.rentalType
            }
            return axios.post('/api/lease', {
                    params: { type, page: id, sort: 1 }
                }).then( (response) => {
                    let res = response.data;
                    if ( res.status == 1 ) {
                        return {
                            leases: res.result.doc,
                            page: {
                                all: res.result.count,
                                current: res.result.current
                            }
                        }
                    } else {
                        return redirect('/404');
                    }
                }).catch( (error) => {
                    console.log(error);
                });
        },
        data() {
            return {
                leases: [],
                moneySort: 1,                   // 价格排序
                page: {
                    all: 1,                     // 记录总页数
                    current: 1                  // 当前的页数
                }
            }
        },
        components: {
            leaseNav
        },
		computed: {
            _positionType() {
                return this.$store.state.lease.positionType;
            },
            _areaType() {
                return this.$store.state.lease.areaType;
            },
            _rentalType() {
                return this.$store.state.lease.rentalType;
            }
        },
        watch: {
            _positionType() {
                this.leasePagePost(1);
            },
            _areaType() {
                this.leasePagePost(1);
            },
            _rentalType() {
                this.leasePagePost(1);
            }
        },
		methods: {
            sort(target) {
                this.moneySort = target;
                this.leasePagePost(1);
            },
            leasePagePost(page) {
				// type(vuex) -> 分类; page -> 当前页
				let type = {
                    position: this.$store.state.lease.positionType,
                    area: this.$store.state.lease.areaType,
                    rental: this.$store.state.lease.rentalType
                }
                axios.post('/api/lease', {
                    params: { type, page, sort: this.moneySort }
                }).then( (response) => {
                    let res = response.data;
                    if ( res.status == 1 ) {
						this.page.all = res.result.count;
                        this.page.current = res.result.current;
                        this.leases = res.result.doc;
                    }
                }).catch( (error) => {
                    console.log(error);
                });
            },
			pageLeft(left) {
                this.page.current = --left;
                this.$router.push({path: '/lease/'+left});
            },
            pageRight(right) {
                this.page.current = ++right;
                this.$router.push({path: '/lease/'+right});
            },
            pageTurn(turn) {
                this.page.current = turn;
                this.$router.push({path: '/lease/'+turn});
            }
        }
    }
</script>

<style>
    .leaseVue {
		padding-top: 20px;
		padding-bottom: 40px;
		background: #F2F2F2;
	}
    /* NoData */
    .leaseVue .NoData {
        padding: 60px 0;
        text-align: center;
        border-top: 1px solid #F2F2F2;
    }
    /* lease */
	.leaseBox {
		background: #fff;
	}
		/* leaseFilter */
	.leaseFilter {
		padding: 10px 20px;
	}
	.leaseFilter span,
	.leaseFilter a {
		margin-right: 10px;
		font-size: 13px;
		color: #757575;
	}
	.leaseFilter a.active {
		color: #90d4c2;
	}
	.leaseFilter a {
		cursor: pointer;
	}
		/* leasePack */
	.leasePack {
		padding: 0 20px;
	}
	.leasePack .item {
		padding: 20px 0;
		border-top: 1px solid #F2F2F2;
	}
	.leasePack a.img {
		float: left;
		display: block;
		height: 180px;
		width: 300px;
		overflow: hidden;
	}
	.leasePack div.news {
		float: left;
		width: 460px;
		margin-left: 30px;
	}
	.leasePack div.news h2 {
		height: 30px;
		margin-bottom: 15px;
		font-size: 20px;
		line-height: 30px;
		color: #4A4A4A;
		overflow: hidden;
	}
	.leasePack div.news p.summary {
		height: 4.5em;          /* 3倍行高 */
        font-size: 15px;
        line-height: 1.5em;
        color: #757575;
        letter-spacing: 2px;    /* 子间距 */
        -webkit-line-clamp: 3;  /* 显示的行数 */
	}
	.leasePack div.news p.spec {
		padding-top: 15px;
	}
	.leasePack div.news p.spec span {
		display: inline-block;
		margin: 10px 10px 0 0;
		padding: 0 5px;
		font-size: 12px;
		line-height: 28px;
		color: #757575;
		border: 1px solid #90d4c2;
	}
	.leasePack div.money {
		float: right;
		height: 180px;
		width: 200px;
		text-align: right;
	}
	.leasePack div.money p {
		font-size: 12px;
		color: #757575;
	}
	.leasePack div.money p span {
		font-size: 25px;
		font-weight: 400;
		color: #cdaa3a;
	}
	/* 分页 */
    .pageBox {
        padding: 30px 0;
    }
/* media */
    @media (max-width: 767px) {
        .leasePack a.img {
            height: 122px;
            width: 160px;
        }
        .leasePack div.news {
            height: 122px;
            width: 300px;
            margin-left: 15px;
            overflow: hidden;
        }
        .leasePack div.money {
            height: 122px;
            width: 100px;
        }
        .leasePack div.news h2 {
            height: 1.2em;
            margin-bottom: 10px;
            font-size: 16px;
            line-height: 1.2em;
        }
        .leasePack div.news p.summary {
            font-size: 13px;
            line-height: 1.5em;
            letter-spacing: 1px;
        }
        .leasePack div.news p.spec {
            padding-top: 0px;
        }
        .leasePack div.news p.spec span {
            margin: 5px 5px 0 0;
            padding: 0 5px;
            font-size: 12px;
            line-height: 24px;
        }
    }
</style>