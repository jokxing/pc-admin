<template>
    <div>
        <el-row>
            <headers></headers>
        </el-row>

        <el-row class="inner">
            <announcement></announcement>

            <div v-loading.fullscreen.lock="fullscreenLoading">
                <el-aside width="218px">
                    <el-row class="list">
                        <a v-for="(item, index) in list" :key="index" :class="{ active: num == index }" @click="tabClick(item,index)">
                            <span>{{ item.text }}</span>
                        </a>
                    </el-row>
                </el-aside>

                <el-main>
                    <el-page-header @back="$router.go(-1)" content="帮助中心"></el-page-header>

                    <div class="support_center" v-html="content"></div>
                </el-main>
            </div>
        </el-row>

        <el-row>
            <footers></footers>
        </el-row>
    </div>
</template>

<script>
    import headers from '../../components/header.vue'
    import announcement from '../../components/announcement.vue'
    import footers from '../../components/footer.vue'

    import { supportCenterApi } from '../../http/api'

    export default {
        data () {
            return {
                fullscreenLoading: true,
                list:[],
                num: 0,
                contents: [],
                content: ""
            }
        },
        methods: {
            supportCenterData () {
                var _this = this;
                supportCenterApi().then(res => {
                    _this.fullscreenLoading = false;
                    _this.list = res.data.message.list;
                    _this.contents = res.data.message.contents;
                    _this.content = _this.contents[0].content
                }).catch(err => {
                    _this.fullscreenLoading = false
                })
            },
            tabClick (item,index) {
                this.num = index;
                for(var i = 0; i < this.contents.length; i++){
                    if(this.contents[i].id == item.id){
                        this.content = this.contents[i].content
                    }
                }
            }
        },
        mounted() {
            this.supportCenterData()
        },
        components:{
            headers,
            announcement,
            footers
        }
    }
</script>

<style scoped>
    @import url(../../assets/css/personalCenter.css);
    .inner{
        width: 1200px;
        margin: 0 auto;
    }
    .el-main{
        width: 970px;
        min-height: 980px;
        background-color: #fff;
        border-radius: 10px;
        float: right;
    }

    .el-aside{
        height: 980px;
        background-color: #fff;
        border-radius: 10px;
        float: left;
    }
    .list{
        width: 100%;
        position: relative;
        padding-top: 20px;
    }
    .list::before{
        content: '';
        width: 200px;
        height: 1px;
        background-color: #EFEFEF;
        position: absolute;
        bottom: 0;
        left: 9px;
    }
    .list:last-child::before{
        height: 0;
    }
    .list a{
        font-size: 14px;
        height: 48px;
        line-height: 48px;
        display: block;
        text-align: center;
    }
    .list a:last-child{
        padding-bottom: 6px;
    }
    .list p{
        font-size: 13px;
        color: #8E8E8E;
        padding: 14px 14px 6px 14px;
    }

    .list a.active{
        position: relative;
    }
    .list a.active::after{
        content: '';
        width: 5px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        border-radius: 0 3px 3px 0;
    }
</style>