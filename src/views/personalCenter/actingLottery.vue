<template>
    <div class="vip_only_detail">
        <headers v-if="this.app != 1"></headers>

        <el-row class="inner">
            <el-main>
                <el-page-header @back="$router.go(-1)" content="代理彩金" v-if="this.app != 1"></el-page-header>

                <el-row>
                    <el-row class="rule">
                        <p class="red">代理彩金-根据代理线上个月的代理输赢数值的绝对值3.5%返，只能用于活动，不能用于非法提现</p>
                        <p>代理可以将自身彩金钱包的彩金给自身下线会员进行彩金赠送。</p>
                        <p>每个月每个玩家的上限是根据会员等级而定的</p>
                    </el-row>

                    <el-row class="give">
                        <p>赠送对象：<span class="primary-color">博门体育全站会员</span></p>
                        <p>赠送条件：<span class="primary-color">会员必须完善资料才可赠送送彩金</span></p>
                        <p>赠送彩金：<span class="primary-color">1倍流水</span></p>
                    </el-row>

                    <el-row class="table">
                        <el-table
                            :data="tableData"
                            style="width: 100%">
                            <el-table-column
                                prop="level"
                                label="会员等级">
                            </el-table-column>
                            <el-table-column
                                prop="upLimit"
                                label="每月最高上限">
                            </el-table-column>
                        </el-table>
                    </el-row>

                    <el-row>
                        <h5>如何彩金赠送</h5>
                        <p>登录代理后台--财务中心--彩金赠送</p>
                        <p>彩金赠送前请先设置支付密码，支付密码设置步骤：代理代理后台--个人资料--设置支付密码即可</p>
                        <br>
                        <h5>彩金赠送常见问题</h5>
                        <p>a.每月彩金可以留着下个月使用吗？ 每月月底最后一天最后12个小时左右彩金清0，不累积下个月。</p>
                        <p>b.在哪里查看我的彩金赠送记录？在彩金赠送页面，点击彩金记录，即可查看历史彩金记录；</p>
                    </el-row>
                </el-row>
            </el-main>
        </el-row>

        <footers v-if="this.app != 1"></footers>
    </div>
</template>

<script>
    import headers from '../../components/header.vue'
    import footers from '../../components/footer.vue'
    export default {
        data () {
            return {
                app: '0',
                tableData: [
                    {
                        level: "倔强铜",
                        upLimit: "1500",
                    },
                    {
                        level: "无畏银V1",
                        upLimit: "2000",
                    },
                    {
                        level: "无畏银V2",
                        upLimit: "2000",
                    },
                    {
                        level: "热血金V1",
                        upLimit: "3500",
                    },
                    {
                        level: "热血金V2",
                        upLimit: "3500",
                    },
                    {
                        level: "宝藏铂V1",
                        upLimit: "4000",
                    },
                    {
                        level: "宝藏铂V2",
                        upLimit: "4000",
                    },
                    {
                        level: "锦鲤钻V1",
                        upLimit: "5000",
                    },
                    {
                        level: "锦鲤钻V2",
                        upLimit: "5000",
                    },
                    {
                        level: "皇帝冠V1",
                        upLimit: "6000",
                    },
                    {
                        level: "皇帝冠V2",
                        upLimit: "6000",
                    },
                ]
            }
        },
        mounted () {
            this.app = this.$route.query.app
        },
        components:{
            headers,
            footers,
        }
    }
</script>

<style scoped>
    @import url(../../assets/css/personalCenter.css);
</style>