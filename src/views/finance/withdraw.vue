<template>
    <div class="withdraw">
        <h3 class="title">提现专区</h3>

        <el-row :gutter="30">
            <el-col :span="12">
                <div class="inner">
                    <div class="head primary-bg fix">
                        <i class="iconfont icon-qian"></i>
                        <h5>佣金钱包</h5>
                    </div>
                    <div class="main fix">
                        <p>可用余额(元)</p>
                        <h2>{{ data.balance }}</h2>
                        <p>
                            不可用余额(元)
                            <el-tooltip placement="right" class="item">
                                <div slot="content" style="font-size: 14px">待审核提款的累计金额，您可以通过<br />提款记录中查询</div>
                                <i class="iconfont icon-bangzhu"></i>
                            </el-tooltip>
                        </p>
                        <h4>{{ data.block }}</h4>
                        <el-button class="primary-button" @click="tkBtn">提款</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-dialog
            title="温馨提示"
            :visible.sync="showPay"
            :show-close=false
            width="35%"
            center
            :close-on-click-modal=false
            class="reminder">
            <p>为了您的资金安全，请先设置支付密码</p>
            <span slot="footer" class="dialog-footer">
                <el-button round plain class="btn_bor_primary" @click="showPay = false; $router.go(-1)">取 消</el-button>
                <el-button type="primary" round @click="showPay = false; $router.push('/information')">去设置</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { DrawMoneyInfoApi } from '../../http/api.js'
    export default {
        data() {
            return {
                data: {
                    balance: "loading..",
                    block: "loading..",
                },
                showPay: false
            }
        },
        methods: {
            DrawMoneyInfoData () {
                var _this = this;
                DrawMoneyInfoApi().then(res => {
                    _this.data = res.data.message;
                }).catch(err => {

                })
            },
            tkBtn () {
                this.$router.push('/withdraw/drawing');
                this.$cookies.set('balance', this.data.balance);
                this.$cookies.set('block', this.data.block)
            }
        },
        mounted() {
            var has_pay_pwd = localStorage.getItem('has_pay_pwd')
            if(has_pay_pwd == 'true'){
                this.DrawMoneyInfoData()
            }else{
                this.showPay = true
            }
        },
    }
</script>

<style scoped>
    @import url(../../assets/css/finance.css);
</style>