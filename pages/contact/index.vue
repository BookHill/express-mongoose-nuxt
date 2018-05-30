<template>
    <div class="contactVue">
        <div class="banner">
            <img class="img-responsive" :src="'/static/banner/' + banner.img.name" :alt="banner.img.alt"/>
        </div>
        <div class="layout">
            <div class="clearfix contactus">
                <div class="text-center title">
                    <h2>Contact US</h2>
                    <i class="line"></i>
                </div>
                <ul class="clearfix contactusBox">
                    <li>
                        <dl class="message">
                            <dd>姓名：{{ system.message.name }}</dd>
                            <dd>电话：{{ system.message.tel }}</dd>
                            <dd>邮箱：{{ system.message.email }}</dd>
                        </dl>
                    </li>
                    <li>
                        <form id="contactus" name="contactus">
                            <dl class="makeOut">
                                <dd><input 
                                        type="text" 
                                        name="name" 
                                        placeholder="姓名" 
                                        v-model="form.name">
                                </dd>
                                <dd><input 
                                        type="text" 
                                        name="tel" 
                                        placeholder="电话" 
                                        v-model="form.tel">
                                </dd>
                                <dd><textarea 
                                        name="content" 
                                        placeholder="留言"
                                        v-model="form.content">
                                </textarea></dd>
                                <dt>
                                    <input 
                                        class="confirm" 
                                        type="button" 
                                        name="confirm" 
                                        value="提交"
                                        @click="ByForm()">
                                    <label class="label" name="label">{{ label }}</label>
                                </dt>
                            </dl>
                        </form>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        asyncData ({ params, error }) {
            function banner() {
                return axios.post('/api/banner', {
                        bannerType: 'contactus'
                    });
            }
            function system() {
                return axios.post('/api/system');
            }
            return axios.all([banner(), system()])
                .then(axios.spread( function(banner, system) {
                    // Both requests are now complete
                    return { 
                        banner: banner.data.result,
                        system: system.data.result
                    }
                }));
        },
        data() {
            return {
                label: '',
                form: {
                    name: '',
                    tel: '',
                    content: ''
                },
                banner: {
                    img: {}
                },
                system: {
                    SEO: {},
                    message: {}
                }
            }
        },
        methods: {
            onceTime() {
                setTimeout(() => {
                    this.label = '';
                },3000);
            },
            ByForm(){
                if(!this.form.name){
                    this.label = '请输入姓名！';
                    this.onceTime();
                    return false;
                }
                if(!this.form.tel){
                    this.label = '请输入联系方式！';
                    this.onceTime();
                    return false;
                }
                axios.post('/api/message', {
                    formData: this.form
                }).then( (response) => {
                    let res = response.data;
                    this.label = res.result;
                    setTimeout(() => {
                        this.$router.go(0);
                    },2000);
                }).catch( (error) => {
                    console.log(error);
                });
            }
        }
    }
</script>

<style>
    .contactVue {
        background: #F2F2F2;
    }
    .contactus {
        padding-top: 60px;
        padding-bottom: 90px;
    }
    .contactus .title h2 {
        font-size: 36px;
        font-family: '[HelveticaNeueLTPro]';
        color: #06079f;
    }
    .contactus .title .line {
        display: block;
        height: 2px;
        width: 36px;
        margin: 15px auto 60px;
        background: #06079f;
    }
    .contactusBox > li {
        float: left;
        width: 50%;
    }
    .contactusBox .message dd {
        height: 45px;
        font-size: 16px;
        color: #666;
    }
    .contactusBox .makeOut dd {
        margin-bottom: 20px;
    }
    .contactusBox dd input {
        height: 40px;
        width: 100%;
        font-size: 15px;
        color: #666;
        background: #F2F2F2;
        border-top: none;
        border-right: none;
        border-left: none;
        border-bottom: 1px solid #bfbfbf;
        box-sizing: border-box;
    }
    .contactusBox dd textarea {
        height: 60px;
        width: 100%;
        font-size: 15px;
        color: #666;
        background: #F2F2F2;
        border-top: none;
        border-right: none;
        border-left: none;
        border-bottom: 1px solid #bfbfbf;
        box-sizing: border-box;
        resize: none;
    }
    .contactusBox input.confirm {
        height: 40px;
        width: 100%;
        font-size: 16px;
        color: #fff;
        background: #7D6A3F;
        border: 1px solid #7D6A3F;
        border-radius: 2px;
        box-sizing: border-box;
        cursor: pointer;
    }
    .contactusBox input.confirm:focus,
	.contactusBox input.confirm:hover {
		background: #75633D;
        border: 1px solid #75633D;
	}
    .contactusBox label.label {
        display: block;
        height: 20px;
        margin-top: 15px;
        font-size: 14px;
        text-align: center;
        color: #5BBF05;
    }
</style>