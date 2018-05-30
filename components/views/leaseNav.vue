<template>
    <ul class="clearfix selectBar">
        <li class="select-item" @mouseenter="selectMouseenter('position')" @mouseleave="selectMouseleave('position')">
            <a class="select-link" href="javascript:void(0);" :class="{ on:selectShow.position }">
				区域<i></i>
			</a>
            <dl class="subselectBar" style="display: none" v-show="selectShow.position">
                <dd>
                    <a class="subselect-link" 
						:class="{ active:active.active_p == -1 }" 
						@click="selectClick(-1, 'allType', 'position')">不限</a>
                </dd>
                <dd v-for="(position, index) in selectBars.placeType" :key="index">
                    <a class="subselect-link" 
						:class="{ active:active.active_p == index }" 
						@click="selectClick(index, position, 'position')">
						{{ position }}
					</a>
                </dd>
            </dl>
        </li>
        <li class="select-item" @mouseenter="selectMouseenter('area')" @mouseleave="selectMouseleave('area')">
            <a class="select-link" href="javascript:void(0);" :class="{ on:selectShow.area }">
				面积<i></i>
			</a>
            <dl class="subselectBar" style="display: none" v-show="selectShow.area">
				<dd>
                    <a class="subselect-link" 
						:class="{ active:active.active_a == -1 }" 
						@click="selectClick(-1, 'allType', 'area')">不限</a>
                </dd>
                <dd v-for="(area, index) in selectBars.areaType" :key="index">
                    <a class="subselect-link" 
						:class="{ active:active.active_a == index }" 
						@click="selectClick(index, area, 'area')">
						{{ area.bottom }}~{{ area.top }}
					</a>
                </dd>
            </dl>
        </li>
        <li class="select-item" @mouseenter="selectMouseenter('rental')" @mouseleave="selectMouseleave('rental')">
            <a class="select-link" href="javascript:void(0);" :class="{ on:selectShow.rental }">
				租金<i></i>
			</a>
            <dl class="subselectBar" style="display: none" v-show="selectShow.rental">
				<dd>
                    <a class="subselect-link" 
						:class="{ active:active.active_r == -1 }" 
						@click="selectClick(-1, 'allType', 'rental')">不限</a>
                </dd>
                <dd v-for="(rental, index) in selectBars.moneyType" :key="index">
                    <a class="subselect-link" 
						:class="{ active:active.active_r == index }" 
						@click="selectClick(index, rental, 'rental')">
						{{ rental.bottom }}~{{ rental.top }}
					</a>
                </dd>
            </dl>
        </li>
    </ul>
</template>

<script>
	import axios from 'axios'
    export default {
        data() {
            return {
				active: {
					active_p: -1,	// 区域
					active_a: -1,	// 面积
					active_r: -1	// 租金
				},
                selectShow: {
					'position': false,
					'area': false,
					'rental': false,
				},
                selectBars: {
                    placeType: [],
                    areaType: [{ top: '', bottom: '' }],
                    moneyType: [{ top: '', bottom: '' }],
					tagType: []
                }
            }
        },
		created() {
            this.leaseTypePost();
        },
		updated() {
            this.activeDOM();
        },
        methods: {
			activeDOM() {
                let _position = this.$store.state.lease.positionType;	// 区域类型
                let _area = this.$store.state.lease.areaType;			// 面积类型
                let _rental = this.$store.state.lease.rentalType;		// 租金类型
                if (_position != 'allType') {
                    for(let i=0, length=this.selectBars.placeType.length; i < length; i++) {
                        if (_position == this.selectBars.placeType[i]) {
                            this.active.active_p = i;
                        }
                    }
                }
				if (_area != 'allType') {
					let _area_ = JSON.stringify(_area);
                    for(let i=0, length=this.selectBars.areaType.length; i < length; i++) {
						if (_area_ == JSON.stringify(this.selectBars.areaType[i])) {
							this.active.active_a = i;
						}
                    }
                }
				if (_rental != 'allType') {
					let _rental_ = JSON.stringify(_rental);
                    for(let i=0, length=this.selectBars.moneyType.length; i < length; i++) {
						if (_rental_ == JSON.stringify(this.selectBars.moneyType[i])) {
							this.active.active_r = i;
						}
                    }
                }
            },
            selectMouseenter(target) {
				switch (target) {
					case 'position':
						this.selectShow.position = target;
						break;
					case 'area':
						this.selectShow.area = target;
						break;
					case 'rental':
						this.selectShow.rental = target;
						break;
				}
            },
            selectMouseleave(target) {
				switch (target) {
					case 'position':
						this.selectShow.position = !target;
						break;
					case 'area':
						this.selectShow.area = !target;
						break;
					case 'rental':
						this.selectShow.rental = !target;
						break;
				}
            },
			leaseTypePost() {
				axios.post('/api/leaseType').then( (response) => {
                    let res = response.data;
                    if ( res.status == 1 ) {
                        this.selectBars = res.result;
                    }
                }).catch( (error) => {
                    console.log(error);
                });
			},
			selectClick(index, value, type) {
				switch (type) {
					case 'position':
						if (this.active.active_p != index) {
							this.active.active_p = index;
							// vuex -> news
							let _type = { type, value };
							this.$store.commit('leaseFn', _type);
						}
						break;
					case 'area':
						if (this.active.active_a != index) {
							this.active.active_a = index;
							// vuex -> news
							let _type = { type, value };
							this.$store.commit('leaseFn', _type);
						}
						break;
					case 'rental':
						if (this.active.active_r != index) {
							this.active.active_r = index;
							// vuex -> news
							let _type = { type, value };
							this.$store.commit('leaseFn', _type);
						}
						break;
				}
			}
        }
    }
</script>

<style>
    /* selectBar */
	.selectBar .select-item {
		position: relative;
		float: left;
		margin-right: 15px;
		padding-bottom: 20px;
	}
	.selectBar .select-item .select-link {
		position: relative;
		display: block;
		height: 28px;
		padding: 0 45px 0 15px;
		font-size: 14px;
		line-height: 28px;
		text-align: center;
		color: #555;
		border: 1px solid #b4b4b4;
		cursor: pointer;
	}
	.selectBar .select-item .select-link i {
		position: absolute;
		top: 11px;
		right: 10px;
		width: 0;
		height: 0;
		border-top: 8px solid #b4b4b4;
		border-right: 8px solid transparent;
		border-bottom: 8px solid transparent;
		border-left: 8px solid transparent;
	}
	.selectBar .select-item .select-link.on,
	.selectBar .select-item .select-link.on {
		color: #CDAA3A;
		border: 1px solid #CDAA3A;
	}
	.selectBar .select-item .select-link.on i,
	.selectBar .select-item .select-link.on i {
		top: 3px;
		border-top: 8px solid transparent;
		border-right: 8px solid transparent;
		border-bottom: 8px solid #CDAA3A;
		border-left: 8px solid transparent;
	}
		/* subselectBar */
	.subselectBar {
		position: absolute;
		top: 50px;
		left: 0px;
		padding: 15px 0;
		background: #fff;
		border: 1px solid #ddd;
	}
	.subselectBar:before {
		display: block;
		position: absolute;
		top: -16px;
		left: 31px;
		height: 0;
		width: 0;
		padding: 0;
		border-bottom: 8px solid #FFFFFF;
		border-top: 8px solid transparent;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		box-sizing: content-box;
		content: '';
		z-index: 12;
	}
	.subselectBar:after {
		display: block;
		position: absolute;
		top: -18px;
		left: 30px;
		height: 0;
		width: 0;
		padding: 0;
		border-bottom: 9px solid #ddd;
		border-top: 9px solid transparent;
		border-left: 9px solid transparent;
		border-right: 9px solid transparent;
		box-sizing: content-box;
		content: '';
		z-index: 10;
	}
	.subselectBar .subselect-link {
		display: block;
		padding: 0 30px;
		font-size: 14px;
		line-height: 30px;
		color: #757575;
		cursor: pointer;
        word-break: keep-all;
        white-space: nowrap;
	}
	.subselectBar .active {
		color: #CDAA3A;
	}
	.subselectBar .subselect-link:focus,
	.subselectBar .subselect-link:hover {
		background: #EBEBEB;
	}
</style>