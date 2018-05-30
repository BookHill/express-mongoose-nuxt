<template>
    <footer class="foot">
        <div class="layout">
            <ul class="clearfix linksBox">
                <li><strong>友情链接：</strong></li>
                <li v-for="(links, index) in system.friendlyLink" :key="index">
                    <a class="links" 
                        :href="links.url" 
                        v-text="links.name" 
                        target="_blank">
                    </a>
                </li>
            </ul>
            <p class="copyright">{{ system.copyright }}</p>
        </div>
    </footer>
</template>

<script>
    import eventBus from '~/plugins/event-bus.js'
    export default {
        data() {
            return {
                system: {
                    SEO: {},
                    message: {}
                }
            }
        },
        created() {
            eventBus.$once('system', (target) => {
                this.system = target;
            });
        }
    }
</script>

<style>
    .foot {
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .linksBox li {
        float: left;
        margin-right: 15px;
        margin-bottom: 10px;
    }
    .linksBox li strong {
        font-size: 15px;
        color: #484848;
    }
    .linksBox li a {
        font-size: 14px;
        color: #666;
    }
    .linksBox li a:focus,
    .linksBox li a:hover {
        color: #ff0000;
    }
    .copyright {
        padding: 5px 0;
        font-size: 14px;
        text-align: right;
        color: #484848;
    }
</style>