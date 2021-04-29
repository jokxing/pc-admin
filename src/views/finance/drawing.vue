<template>
    <div class="drawing">
        <el-page-header @back="back" content="提款"></el-page-header>
        <!-- <div class="drawing_explain">
            <i class="iconfont icon-bangzhu primary-color"></i>
            <el-link :underline="false">提款说明</el-link>
        </div> -->

        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="提款至银行卡" name="first" class="input_money">
                <el-row>
                    <el-col :span="4">
                        <span>可提余额</span>
                        <h5 class="primary-color">{{ balance }}</h5>
                    </el-col>
                    <el-col :span="4">
                        <span>不可用余额</span>
                        <h5 class="primary-color">{{ block }}</h5>
                    </el-col>
                </el-row>
                <el-row>输入金额</el-row>
                <el-row>
                    <el-input placeholder="请输入金额" v-model="money" @input="moneyKeyup"></el-input>
                    <!-- <span class="primary-color whole" @click="allMoneyClick">全部</span> -->
                    <p>单次最高提款200,000.00元，今天最多还可提出 2,000,000.00 元</p>
                </el-row>
                <el-row>
                    <el-button round class="primary-button" @click="nextClick">下一步</el-button>
                </el-row>

                <el-row class="input_money_table">
                    <h3>最近5笔提款<span class="primary-color" @click="seeAllClick">查看全部</span></h3>

                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        :show-header="false"
                        id="notice_table"
                        v-loading="tableLoading">
                        <el-table-column
                            prop="created_at"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="fundsn">
                        </el-table-column>
                        <el-table-column
                            prop="account"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="money"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            width="100">
                                <template slot-scope="scope">
                                    <span :class="{ 'green': scope.row.status == '成功', 'red': scope.row.status == '失败', 'grey': scope.row.status == '处理中' }">
                                        {{ scope.row.status }}
                                    </span>
                                </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-tab-pane>

            <el-tab-pane label="提款至虚拟币" name="usdt" style="text-align: center;margin-top: 200px;">暂未开放</el-tab-pane>

            <el-tab-pane label="提款记录" name="second">
                <el-row :gutter="10">
                    <el-form>
                        <el-form-item>
                            <el-col :span="5">
                                <el-select placeholder="全部" v-model="Status">
                                    <el-option value="1" label="全部"></el-option>
                                    <el-option value="2" label="成功"></el-option>
                                    <el-option value="3" label="失败"></el-option>
                                    <el-option value="4" label="处理中"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6" class="form_button">
                                <el-button class="primary-button" round @click="DrawHisData">查询</el-button>
                                <el-button plain round @click="Status = ''">重置</el-button>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-row>

                <el-row>
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        v-loading="tableLoading">
                            <el-table-column
                                label="提款时间"
                                width="180"
                                prop="created_at">
                            </el-table-column>
                            <el-table-column
                                label="订单号"
                                prop="fundsn">
                            </el-table-column>
                            <el-table-column
                                label="提款账号"
                                width="100"
                                prop="account">
                            </el-table-column>
                            <el-table-column
                                label="提款金额"
                                width="100"
                                prop="money">
                            </el-table-column>
                            <el-table-column
                                label="状态"
                                width="100">
                                    <template slot-scope="scope">
                                        <span :class="{ 'green': scope.row.status == '成功', 'red': scope.row.status == '失败', 'grey': scope.row.status == '处理中' }">
                                            {{ scope.row.status }}
                                        </span>
                                    </template>
                            </el-table-column>
                    </el-table>

                    <!-- 分页 -->
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="handleCurrentChange"
                        :current-page.sync="Page" 
                        :total="total"
                        :page-size="PageSize"
                        :hide-on-single-page="true">
                    </el-pagination>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { DrawHisApi } from '../../http/api.js'
    export default {
        data() {
            var myDate = new Date();
            return {
                tableLoading: true,
                activeName: 'first',
                // 可提余额
                balance: $cookies.get('balance'),
                block: $cookies.get('block'),
                // 提款
                money: "",
                // 提款记录表格
                tableData: [],
                Status: "",
                // 分页
                Page: 1,
                PageSize: 5,
                total: 0
            };
        },
        methods: {
            // 提款记录
            DrawHisData () {
                var _this = this;
                var data = {
                    Page: this.Page,
                    PageSize: this.PageSize,
                    Status: this.Status
                }
                _this.tableData = [];
                _this.tableLoading = true;
                DrawHisApi(data).then(res => {
                    _this.tableLoading = false;
                    _this.tableData = res.data.message.Data;
                    _this.total = res.data.message.Total
                }).catch(err => {
                    _this.tableLoading = false
                })
            },
            // 全部金额
            allMoneyClick () {
                this.money = this.balance
            },
            // 查看全部
            seeAllClick () {
                this.activeName = 'second';
                this.Page = 1;
                this.Status = "";
                this.PageSize = 15;
                this.DrawHisData()
            },
            // 金额输入事件
            moneyKeyup () {
                if(parseInt(this.money) > 200000){
                    this.money = 200000;
                    this.$message({
                        message: '单次最高提款200,000.00元',
                        type: 'warning'
                    })
                }

                if(parseInt(this.balance) < parseInt(this.money)){
                    this.money = this.balance
                }
            },
            // 下一步
            nextClick () {
                if(parseInt(this.money) < 100 || this.money == ''){
                    this.$message({
                        message: '最低提款金额为100，请重新输入',
                        type: 'warning'
                    });
                }else{
                    var money = parseInt(this.money);
                    var sum = (money / 10000) / 3 + 1;
                    var num = parseInt(sum);

                    var bankData = [];

                    if(num > 1){
                        var max = money / num;
                        var min = max / 1.2;
                        var aryRet = [];
                        var iAcc = 0;
                        for(var i = 0; i < (num - 1); i++){
                            var iTmp = Math.floor(Math.random() * (max-min+1)+min);
                            aryRet.push(iTmp);
                            iAcc += iTmp
                        }
                        aryRet.push(money-iAcc)

                        for(var i = 0; i < aryRet.length; i++){
                            bankData.push({
                                card_number: "",
                                bank_name: "",
                                money: aryRet[i],
                                account: ""
                            })
                        }
                    }else{
                        bankData.push({
                            card_number: "",
                            bank_name: "",
                            money: money,
                            account: ""
                        })
                    }
                    // 银行列表赋值金额并保存localstorage
                    var banks = JSON.stringify(bankData)
                    localStorage.setItem("generateBankCardData",banks)
                    // 要提款的金额保存localstorage
                    localStorage.setItem("withdrawMoney", this.money)

                    this.$alert('单张卡最高提款49999，系统将自动生成' + num + '笔订单', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            if(action != 'cancel'){
                                this.$cookies.set('withdrawMoney',this.money)
                                this.$router.push('/withdraw/safetyVerification')
                            }
                        }
                    });
                }
            },
            // tab
            handleClick(tab, event) {
                this.Page = 1;
                this.Status = "";
                if(tab.index == 0){
                    this.PageSize = 5
                }else{
                    this.PageSize = 15
                }
                this.DrawHisData()
            },
            // 分页
            handleCurrentChange(val) {
                this.Page = val;
                this.DrawHisData()
            },
            // 返回
            back () {
                this.$router.push('/withdraw');
                this.$cookies.remove('balance');
                this.$cookies.remove('block')
            },
        },
        mounted() {
            if(this.$router.history.current.params.activeName){
                this.activeName = this.$router.history.current.params.activeName;
                this.PageSize = 15
            }

            this.DrawHisData();
        },
    }
</script>

<style scoped>
    @import url(../../assets/css/finance.css);
</style>