<template>
    <div class="agent_deposit" v-loading.fullscreen="loading">
        <h3 class="title">{{ title }}</h3>

        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="name" name="first" class="agent_deposit_form">
                <el-row>
                    <h5>付款账户</h5>
                    <div class="payment_account">
                        <p class="primary-color">{{ name }}钱包</p>
                        <h2 class="primary-color">{{ money }}</h2>
                    </div>
                </el-row>

                <el-row>
                    <h5>会员账号</h5>
                    <span v-if="data.member_name == ''" style="color: #898989;font-weight: normal;">请从 <router-link to="/memberList" class="primary-color">会员管理</router-link> 输入账号进行处理</span>
                    <el-input placeholder="请输入会员账号" disabled v-model="data.member_name" v-if="data.member_name != ''"></el-input>
                </el-row>

                <el-row>
                    <h5>存款金额</h5>
                    <ul class="money">
                        <li v-for="(item, index) in moneyTab" :key="index" :class="{ 'bor_active': num == index }" @click="moneyTabClick(item,index)">
                            ￥{{ item }}
                        </li>
                    </ul>
                    <el-input v-model="data.amount" placeholder="请输入存款金额" @keyup.native="moneyKeyup()"></el-input>
                </el-row>

                <el-row>
                    <h5>备注</h5>
                    <el-input placeholder="20个字" v-model="data.remark"></el-input>
                </el-row>

                <el-row>
                    <h5>支付密码</h5>
                    <el-input placeholder="请输入支付密码" type="password" v-model="data.paypassword" maxlength="6"></el-input>
                    <span class="primary-color" style="margin-left: 10px;cursor: pointer;" @click="$router.push('/information')">忘记密码？</span>
                </el-row>

                <el-row>
                    <el-button class="primary-button" round @click="submit">确认{{ name }}</el-button>
                </el-row>
            </el-tab-pane>
            <el-tab-pane :label="name + '记录'" name="second">
                <agentRecord :type="name"></agentRecord>
            </el-tab-pane>
        </el-tabs>

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
    import agentRecord from './agentRecord.vue'

    import { agentDepositApi,  agentBonusApi } from '../../http/api'
    export default {
        data() {
            return {
                loading: false,
                title: "",
                name: "",
                // tab
                activeName: 'first',
                // 存款选择金额
                moneyTab: ['18','50','100','200','500'],
                num: -1,
                // 代存余额
                money: 0,
                // 提交数据
                data: {
                    member_name: "",
                    amount: "",
                    remark: "",
                    paypassword: ""
                },
                // 温馨提示
                showPay: false
            }
        },
        methods: {
            // tab
            handleClick(tab, event) {
            },
            // 存款金额-选择金额
            moneyTabClick(item, index) {
                this.num = index;
                this.data.amount = item
            },
            moneyKeyup() {
                this.num = -1
            },
            // 提交
            submit () {
                var _this = this;
                if(this.data.member_name == ''){
                    this.$message({
                        message: "请从会员管理输入账号进行处理",
                        type: "warning"
                    })
                }else if(this.data.amount == ''){
                    this.$message({
                        message: "存款金额不能为空",
                        type: "warning"
                    })
                }else if(this.data.paypassword == ""){
                    this.$message({
                        message: "支付密码不能为空",
                        type: "warning"
                    })
                }else{
                    this.loading = true;
                    if(this.name == '代存'){
                        agentDepositApi(_this.data).then(res => {
                            _this.loading = false;
                            _this.$message.success(res.data.message);
                            _this.$router.push('/userFund')
                        }).catch(err => {
                            _this.loading = false;
                            _this.$message.error(err.message)
                        })
                    }
                    if(this.name == '礼金'){
                        agentBonusApi(_this.data).then(res => {
                            _this.loading = false;
                            _this.$message.success(res.data.message);
                            _this.$router.push('/userFund')
                        }).catch(err => {
                            _this.loading = false;
                            _this.$message.error(err.message)
                        })
                    }
                }
            }
        },
        mounted() {
            if(this.$router.history.current.path == '/agentBonus'){
                this.title = "礼金赠送";
                this.name = "礼金";
                var money = localStorage.getItem('cmoney')
                this.money = JSON.parse(money).toFixed(2)
            }else{
                this.title = "会员代存";
                this.name = "代存";
                var money = localStorage.getItem('money')
                this.money = JSON.parse(money).toFixed(2)
            };

            if(this.$route.query.name){
                this.data.member_name = this.$route.query.name
            }

            var has_pay_pwd = localStorage.getItem('has_pay_pwd')
            if(has_pay_pwd == 'true'){
                
            }else{
                this.showPay = true
            }
        },
        watch: {
            $route(to, from){
                this.activeName = "first";
                if(to.fullPath == '/agentBonus'){
                    this.title = "礼金赠送";
                    this.name = "礼金";
                    var money = localStorage.getItem('cmoney')
                    this.money = JSON.parse(money).toFixed(2)
                }else{
                    this.title = "会员代存";
                    this.name = "代存";
                    var money = localStorage.getItem('money')
                    this.money = JSON.parse(money).toFixed(2)
                };
                if(this.$route.query.name){
                    this.data.member_name = this.$route.query.name
                }else{
                    this.data.member_name = ''
                }
                this.data.member_name = '';
                this.data.amount = '';
                this.data.remark = '';
                this.data.paypassword = '';
            }
        },
        components:{
            agentRecord
        }
    }
</script>

<style scoped>
    @import url(../../assets/css/finance.css);
</style>