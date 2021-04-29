<template>
    <div class="noticeDetails" v-loading="noticeLoading">
        <el-page-header @back="goBack" content="公告详情"></el-page-header>

        <h2>{{ d.title }}</h2>

        <div class="noticeDetails_main">
            <p>{{ d.created_at }}</p>
            <div class="noticeDetails_content">
                {{ d.content }}
            </div>
        </div>
    </div>
</template>

<script>
    import { noticeDetailApi } from '../../http/api.js'
    export default {
        data () {
            return {
                noticeLoading: true,
                d:""
            }
        },
        methods: {
            noticeDetailData () {
                var _this = this;
                var data = {
                    id: this.$route.params.id
                }
                noticeDetailApi(data).then(res => {
                    _this.noticeLoading = false;
                    _this.d = res.data.message
                }).catch(err => {
                    _this.noticeLoading = false;
                })
            },
            // 返回
            goBack: function () {
                this.$router.go(-1)
            },
        },
        mounted() {
            this.noticeDetailData()
        },
    }
</script>

<style scoped>
    .noticeDetails .el-page-header{
        margin-bottom: 20px;
    }

    .noticeDetails h2{
        text-align: center;
        margin-bottom:30px;
    }

    .noticeDetails_main{
        padding: 0 74px;
    }
    .noticeDetails_main p{
        font-size: 14px;
        color: #9a9a9a;
    }

    .noticeDetails_content{
        margin: 28px 0 0 0;
        font-size: 14px;
        width: 780px;
        line-height: 30px;
        padding-bottom: 200px;
        color: #414755;
    }
</style>