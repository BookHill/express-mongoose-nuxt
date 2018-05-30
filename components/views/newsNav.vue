<template>
    <ul class="clearfix navVue">
        <li v-for="(newsType, index) in newsTypes" :key="index">
            <a  class="newsType" 
                :class="{ active:newsType.typeId == active }"
                @click="newsTypeClick(newsType.typeId, newsType.name)">
                {{ newsType.name }}
            </a>
        </li>
    </ul>
</template>

<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                active: -1,
                newsTypes: {}
            }
        },
        created() {
            this.newsTypePost();
        },
        updated() {
            this.activeDOM();
        },
        methods: {
            activeDOM() {
                let type = this.$store.state.news.newsType;
                if (type != 'allType') {
                    for(let i=0, length=this.newsTypes.length; i<length; i++) {
                        if (type == this.newsTypes[i].name) {
                            this.active = this.newsTypes[i].typeId;
                            return false;
                        }
                    }
                }
            },
            newsTypePost() {
                axios.post('/api/newsType').then( (response) => {
                    let res = response.data;
                    if ( res.status == 1 ) {
                        this.newsTypes = res.result;
                    }
                }).catch( (error) => {
                    console.log(error);
                });
            },
            newsTypeClick(index, type) {
                if (this.active != index) {
                    this.active = index;
                    // vuex -> news
                    this.$store.commit('newsFn', type);
                }
            }
        }
    }
</script>

<style>
    .navVue {
        padding-top: 45px;
        padding-bottom: 20px;
    }
    .navVue li {
        float: left;
        margin-right: 10px;
    }
    .navVue .newsType {
        display: block;
        height: 40px;
        padding-left: 15px;
        padding-right: 15px;
        font-size: 15px;
        line-height: 40px;
        color: #f8f8f8;
        background-color: #343442;
        cursor: pointer;
    }
    .navVue .newsType.active {
        background: #F4BB31;
        cursor: default;
    }
/* media */
    @media (max-width: 767px) {
        .navVue {
            padding-top: 15px;
            padding-bottom: 15px;
        }
    }
</style>