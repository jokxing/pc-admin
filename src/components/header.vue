<template>
    <el-container class="header">
        <el-header height="80px" v-if="$route.path == '/login' || $route.path == '/register'" style="background:#5C7DEC">
            <el-row>
                <el-col :span="24">
                    <div class="logo">
                        LOGO
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-header height="80px" v-if="is_token == 1 && $route.path != '/login' && $route.path != '/register'">
            <el-row>
                <el-col :span="4">
                    <div class="logo" style="color: #333">
                        LOGO
                    </div>
                </el-col>
                <el-col :span="20" class="right">
                    <ul v-if="data != ''">
                        <li @click="logout">
                            <i class="el-icon-switch-button"></i>
                            <span>退出</span>
                        </li>
                        <li>
                            <i class="iconfont icon-zaixianjiedan"></i>
                            <span>
                                在线会员
                                <el-tooltip class="item" effect="dark" content="在线会员-24小时内登陆过的会员统计。" placement="bottom">
                                    <i class="el-tooltip el-icon-info"></i>
                                </el-tooltip>
                            </span>
                            <h4>{{ data.online_number }}</h4>
                        </li>
                        <li>
                            <i class="iconfont icon-tianjialianxiren"></i>
                            <span>今日新增会员</span>
                            <h4>{{ data.today_number }}</h4>
                        </li>
                        <li>
                            <i class="iconfont icon-cardb primary-color"></i>
                            <span>
                                礼金余额
                                <el-tooltip class="item" effect="dark" content="礼金余额-内容内容" placement="bottom">
                                    <i class="el-tooltip el-icon-info"></i>
                                </el-tooltip>
                            </span>
                            <h4 class="primary-color"><em>￥</em>{{ data.cmoney.toFixed(2) }}</h4>
                            <i class="iconfont icon-shuaxin primary-color" @click="mainInit"></i>
                        </li>
                        <li>
                            <i class="iconfont icon-qiandai"></i>
                            <span class="large">代理余额</span>
                            <h4><em>￥</em>{{ data.money }}</h4>
                            <i class="iconfont icon-shuaxin primary-color" @click="mainInit"></i>
                        </li>
                        <li>
                            <i class="iconfont icon-huiyuan"></i>
                            <span>{{ data.name }}</span>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </el-header>
    </el-container>
</template>

<script>
    import { mainApi } from '../http/api.js'
    export default {
        data() {
            return {
                is_token: -1,
                data:''
            }
        },
        methods: {
            mainInit() {
                var _this = this;
                mainApi().then(res => {
                    _this.data = res.data.message;
                    localStorage.setItem('mobile', res.data.message.mobile);
                    localStorage.setItem('money', res.data.message.money);
                    localStorage.setItem('cmoney', res.data.message.cmoney);
                    localStorage.setItem('has_pay_pwd', res.data.message.has_pay_pwd);
                    localStorage.setItem('bill_wtd', res.data.message.bill_wtd)
                }).catch(err => {

                })
            },
            // 退出
            logout() {
                localStorage.removeItem('access_token');
                localStorage.removeItem('expires_time');
                localStorage.removeItem('mobile');
                localStorage.removeItem('agentLink');
                localStorage.removeItem('withdrawMoney');
                localStorage.removeItem('selectedBgImg');
                localStorage.removeItem('money');
                localStorage.removeItem('generateBankCardData');
                localStorage.removeItem('cmoney');
                localStorage.removeItem('has_pay_pwd');
                localStorage.removeItem('bill_wtd');
                this.$router.back('/login')
            }
        },
        created() {
            if(localStorage.getItem('access_token')){
                this.is_token = 1
                this.mainInit()
            }else{
                this.is_token = 0
            }
        },
    }
</script>

<style scoped>
    .el-header{
        background-color: #fff;
    }
    .header .el-row{
        width: 1200px;
        height: 80px;
        margin: 0 auto;
    }
    .header .logo{
        float: left;
        line-height: 80px;
        font-size: 30px;
        color: #fff;
    }
    .header .logo img{
        height: 55px;
        vertical-align: middle;
    }

    .header .right{
        float: right;
        height: 80px;
    }
    .header .right ul li{
        float: right;
        line-height: 80px;
        margin-right: 30px;
    }
    .header .right ul li:first-child{
        margin-right: 0;
        cursor: pointer;
    }
    .header .right ul li i{
        font-size: 22px;
        margin-right: 6px;
        line-height: 80px;
        float: left;
    }
    .header .right ul li i.icon-shuaxin{
        font-size: 18px;
        margin-left: 6px;
        cursor: pointer;
    }
    .header .right ul li span{
        font-size: 14px;
        float: left;
        color: #8F8F8F;
    }
    .header .right ul li span i.item{
        float: none;
        color: rgb(213, 213, 213);
        cursor: pointer;
        line-height: normal;
        vertical-align: middle;
        margin-bottom: 3px;
        font-size: 18px;
    }
    .header .right ul li h4{
        float: left;
        margin-left: 10px;
        font-size: 20px;
    }
    .header .right ul li h4 em{
        font-style: initial;
        font-size: 12px;
    }

    .header .right ul li:last-child i{
        color: #6CC2BC;
    }
    .header .right ul li:nth-child(5) i,
    .header .right ul li:nth-child(5) h4{
        color: #EB7029;
    }
    .header .right ul li:nth-child(3) i,
    .header .right ul li:nth-child(3) h4{
        color: #67c23a;
    }
    .header .right ul li:nth-child(2) i,
    .header .right ul li:nth-child(2) h4{
        color: #29c7eb;
    }
    .header .right ul li:first-child i{
        color: #EC5C5C;
    }


    .login_sponsor{
        height: 80px;
        line-height: 80px;
    }
    .login_sponsor img{
        height: 60px;
        vertical-align: middle;
    }
</style>