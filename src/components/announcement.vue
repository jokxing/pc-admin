<template>
    <div class="announcement">
        <i class="iconfont icon-gonggao primary-color"></i>
        <marquee scrollamount="2" @click="$router.push('/notice')">
            <span>{{ content }}</span>
        </marquee>
    </div>
</template>

<script>
    import { marqueeApi } from '../http/api'
    export default {
        data() {
            return {
                content: ""
            }
        },
        methods: {
            marqueeData () {
                var _this = this;
                marqueeApi().then(res => {
                    for(var i = 0; i < res.data.message.length; i++){
                        _this.content += res.data.message[i].title + ":" + res.data.message[i].content + " "
                    }
                }).catch(err => {
                    
                })
            }
        },
        mounted() {
            this.marqueeData()
        },
    }
</script>

<style scoped>
    .announcement{
        width: calc(100% - 48px);
        height: 54px;
        background-color: #fff;
        border-radius: 10px;
        margin: 25px 0 12px 0;
        line-height: 54px;
        padding: 0 24px;
    }
    .announcement i{
        font-size: 22px;
        float: left;
        margin-right: 20px;
    }
    .announcement marquee{
        width: 1110px;
        float: left;
        cursor: pointer;
    }
</style>
