<template>
    <div class="vip_only">
        <h4 class="title">VIP专享</h4>
        <el-row v-loading="showLoading" style="min-height: 600px">
            <el-col :span="24" class="vip_only_list" v-for="(item,index) in list" :key="index">
                <img :src="item.img">
                <div 
                    class="flag" 
                    :class="{ 'orange_bg': item.label == '推荐', 'cyan_bg': item.label == '日常', 'blue_bg': item.label == '最新', 'green_bg': item.label == '新人' }">
                        {{ item.label }}
                </div>
                <div class="right">
                    <div class="conter">
                        <h5>{{ item.name }}</h5>
                        <span>{{ item.time }}</span>
                    </div>
                    <el-button type="primary" round @click="$router.push('/' + item.actId)">查询详情</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { vipListApi } from '../../http/api'
    export default {
        data () {
            return {
                showLoading: false,
                list: []
            }
        },
        methods: {
            vipList () {
                var _this = this;
                this.showLoading = true;
                vipListApi().then(res => {
                    _this.showLoading = false;
                    _this.list = res.data.message;
                }).catch(err => {
                    _this.showLoading = false;
                })
            }
        },
        mounted () {
            this.vipList()
        }
    }
</script>

<style scoped>
    @import url(../../assets/css/personalCenter.css);
</style>