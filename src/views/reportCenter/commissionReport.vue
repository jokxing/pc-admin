<template>
    <div class="commission_report" v-loading="showLoading">
        <h4 class="title">佣金报表</h4>

        <div v-for="(item, index) in list" :key="index" class="commission_box">
            <el-row class="commission_title">
                <div class="fix">
                    <span class="left">{{ item.date_str }}</span>
                </div>
            </el-row>

            <el-row :gutter="15" class="commission_data">
                <el-col :span="6">
                    <div>
                        <p>
                            <i class="iconfont icon-qiandaizi yellow"></i>
                            当月佣金
                            <el-tooltip placement="top" class="item">
                                <div slot="content" style="font-size: 14px;line-height: 24px">每月2-5日发放上月佣金<br />当月佣金=实际盈亏*佣金比例+会员代存+上月结余+开客奖励+额外奖励<br/>正数为代理欠公司，负数为代理盈利。</div>
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </p>
                        <span :class="{ red: item.money < 0, green: item.money > 0}">{{ item.money }}</span>
                        <i class="iconfont detail primary-color" :class="{ 'icon-plus': !item.showMoney, 'icon-reduce': item.showMoney }" @click="moneyClick(item)"></i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div>
                        <p>
                            <i class="el-icon-user-solid"></i>
                            有效会员
                        </p>
                        <span>{{ item.valid }}</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div>
                        <p>
                            <i class="iconfont icon-16 yellow"></i>
                            实际盈亏
                            <el-tooltip class="item" effect="dark" content="会员输赢+红利/返水+手续费+平台费" placement="top">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </p>
                        <span :class="{ 'green': item.profit > 0, 'red': item.profit < 0 }">{{ item.profit }}</span>
                        <i class="iconfont detail primary-color" :class="{ 'icon-plus': !item.showProfit, 'icon-reduce': item.showProfit }" @click="profitClick(item)"></i>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div>
                        <p>
                            <i class="iconfont icon-chart primary-color"></i>
                            佣金比例
                        </p>
                        <span>{{ item.rate }}</span>
                    </div>
                </el-col>
            </el-row>

            <!-- 当月佣金 -->
            <el-row class="commission_table" v-show="item.showMoney">
                <el-table
                    :data="item.moneyList"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="profit"
                        label="实际盈亏">
                        <template slot-scope="scope">
                            <span :class="{ red: scope.row.profit < 0, green: scope.row.profit > 0}">
                                {{ scope.row.profit }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="rate"
                        label="佣金比例">
                    </el-table-column>
                    <el-table-column
                        prop="last_balance"
                        label="上月结余">
                    </el-table-column>
                    <el-table-column
                        label="资金调整"
                        align="center">
                        <el-table-column 
                            prop="valid_reward"
                            label="人头奖励"
                            align="center"
                            width="60">
                        </el-table-column>
                        <el-table-column 
                            prop="other_reward"
                            label="额外奖励"
                            align="center"
                            width="60">
                        </el-table-column>
                        <el-table-column 
                            prop="correction"
                            label="手工调整"
                            align="center"
                            width="60">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                        label="代理邀请"
                        align="center"
                        v-if="level_id == 3 && bill_wtd">
                        <el-table-column 
                            prop="invite_back_reward"
                            label="返佣"
                            align="center"
                            width="60">
                        </el-table-column>
                        <el-table-column 
                            prop="invite_correction"
                            label="人头奖励"
                            align="center"
                            width="60">
                        </el-table-column>
                        <el-table-column 
                            prop="correction"
                            label="手工调整"
                            align="center"
                            width="60">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                        prop="transfer_user"
                        label="会员代存">
                    </el-table-column>
                    <el-table-column
                        label="当月佣金">
                        <template slot-scope="scope">
                            <span :class="{ red: scope.row.money < 0, green: scope.row.money > 0}">
                                {{ scope.row.money }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="leave_money"
                        label="本月结余">
                    </el-table-column>
                </el-table>

                <div class="distribution_time">发放时间<span>{{ item.created_at }}</span></div>
            </el-row>

            <!-- 实际盈亏 -->
            <el-row class="commission_table" v-show="item.showProfit">
                <el-table
                    :data="item.detail"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="code"
                        label="代理账号">
                    </el-table-column>
                    <el-table-column
                        prop="payout"
                        label="会员输赢">
                            <template slot-scope="scope">
                                <span :class="{ 'green': scope.row.payout > 0, 'red': scope.row.payout < 0 }">
                                    {{ scope.row.payout }}
                                </span>
                            </template>
                    </el-table-column>
                    <el-table-column
                        label="红利/返水"
                        :render-header="bonusHeader">
                        <template slot-scope="scope">
                            <span>{{ (scope.row.bonus_money + scope.row.agent_bonus + scope.row.user_agent + scope.row.uservip_system + scope.row.bonus_system + scope.row.dpt_bonus_money + scope.row.water_money).toFixed(2) }}</span>
                            <i class="iconfont primary-color" :class="{ 'icon-plus': !showBonus[index], 'icon-reduce': showBonus[index] }" style="float:right" @click="bonusClick(index)"></i>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="fee"
                        label="手续费"
                        :render-header="feeHeader">
                    </el-table-column>
                    <el-table-column
                        label="平台费">
                        <template slot-scope="scope">
                            <span>{{ scope.row.game_fee }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="实际盈亏"
                        :render-header="realHeader">
                            <template slot-scope="scope">
                                <span :class="{ 'green': scope.row.real_win_lost > 0, 'red': scope.row.real_win_lost < 0 }">
                                    {{ scope.row.real_win_lost }}
                                </span>
                            </template>
                    </el-table-column>
                    <el-table-column
                        label="其它"
                        width="100"
                        :render-header="otherHeader">
                        <template slot-scope="scope">
                            <i class="iconfont primary-color" :class="{ 'icon-plus': !showOther[index], 'icon-reduce': showOther[index] }" @click="otherClick(index)"></i>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 红利表格 -->
                <el-table
                    :data="item.detail"
                    border
                    style="width: 100%;margin-top: 10px"
                    v-show="item.showBonus">
                    <el-table-column
                        prop="bonus_money"
                        label="红利">
                    </el-table-column>
                    <el-table-column
                        prop="agent_bonus"
                        label="代理彩金">
                    </el-table-column>
                    <el-table-column
                        prop="user_agent"
                        label="邀请有奖">
                    </el-table-column>
                    <el-table-column
                        prop="uservip_system"
                        label="VIP系统">
                    </el-table-column>
                    <el-table-column
                        prop="bonus_system"
                        label="彩金系统">
                    </el-table-column>
                    <el-table-column
                        prop="dpt_bonus_money"
                        label="存款优惠">
                    </el-table-column>
                    <el-table-column
                        prop="water_money"
                        label="返水">
                    </el-table-column>
                </el-table>
                <!-- 其它表格 -->
                <el-table
                    :data="item.detail"
                    border
                    style="width: 100%;margin-top: 10px"
                    v-show="item.showOther">
                    <el-table-column
                        prop="beat_num"
                        label="注单笔数">
                    </el-table-column>
                    <el-table-column
                        prop="beat_money"
                        label="投注金额">
                    </el-table-column>
                    <el-table-column
                        prop="valid_betamt"
                        label="有效投注">
                    </el-table-column>
                    <el-table-column
                        prop="dpt_money"
                        label="存款金额">
                    </el-table-column>
                    <el-table-column
                        prop="wtd_money"
                        label="提款金额">
                    </el-table-column>
                    <el-table-column
                        prop="valid_user"
                        label="本月有效客">
                    </el-table-column>
                </el-table>
            </el-row>
        </div>
    </div>
</template>

<script>
    import { commissionReportApi } from '../../http/api'
    export default {
        data() {
            var myDate = new Date();
            return {
                list: [],
                tableData: [],
                showLoading: true,
                showBonus: [false,false,false],
                showOther: [false,false,false],
                showFee: [false,false,false],
                level_id: localStorage.getItem('level_id'),
                bill_wtd: localStorage.getItem('bill_wtd')
            }
        },
        methods: {
            commissionReport () {
                var _this = this;
                commissionReportApi().then(res => {
                    _this.showLoading = false;
                    for(var i = 0; i < res.data.message.length; i++){
                        res.data.message[i].showProfit = false;
                        res.data.message[i].showMoney = false
                    }
                    _this.list = res.data.message;
                    for(var i = 0; i < _this.list.length; i++){
                        _this.list[i].detail = [_this.list[i].detail];
                        _this.list[i].showBonus = false;
                        _this.list[i].showOther = false;
                        _this.list[i].moneyList = [
                            {
                                profit: _this.list[i].profit,
                                rate: _this.list[i].rate,
                                last_balance: _this.list[i].last_balance,
                                valid_reward: _this.list[i].valid_reward,
                                other_reward: _this.list[i].other_reward,
                                correction: _this.list[i].correction,
                                transfer_user: _this.list[i].detail[0].transfer_user,
                                money: _this.list[i].money,
                                leave_money: _this.list[i].leave_money,
                                invite_back_reward: _this.list[i].invite_back_reward,
                                invite_vuser_reward: _this.list[i].invite_vuser_reward,
                                invite_correction: _this.list[i].invite_correction,
                            }
                        ]
                    }
                }).catch(err => {
                    _this.showLoading = false
                })
            },
            // 当月佣金+号事件
            moneyClick (item) {
                item.showMoney =! item.showMoney;
                for(var i = 0; i < this.list.length; i++){
                    this.list[i].showProfit = false;
                }
            },
            // 实际盈亏+号事件
            profitClick(item) {
                item.showProfit =! item.showProfit;
                for(var i = 0; i < this.list.length; i++){
                    this.list[i].showMoney = false;
                }
            },
            // 实际盈亏-红利/返水+号事件
            bonusClick(index) {
                var show = !this.list[index].showBonus;
                this.$set(this.list, index, { ...this.list[index], showBonus: show })

                var show2 = this.list[index].showBonus;
                this.$set(this.showBonus, index, show2)
            },
            // 实际盈亏-其它+号事件
            otherClick(index) {
                var show = !this.list[index].showOther;
                this.$set(this.list, index, { ...this.list[index], showOther: show })

                var show2 = this.list[index].showOther;
                this.$set(this.showOther, index, show2)
            },
            // 表头-实际盈亏
            realHeader(h,{column}){
                const inReview = '会员输赢+红利/返水+手续费+平台费'
                return h(
        　　　　    'div', [
                        h('span', column.label),
                        h('el-tooltip', {
                            props: {
                                placement: 'top'
                            }
                        }, [
                            h('div', {
                                slot: 'content',
                                style: {
                                    'width':'200px',
                                    whiteSpace: 'normal',
                                    'margin-bottom': '10px'
                                }
                            }, inReview),
                            h('i', {
                                class: 'el-icon-info',
                                style: 'margin-left:5px;vertical-align: middle;color: #d5d5d5'
                            })
                        ],)
                    ]
        　　　　 )
            },
            // 表头-手续费
            feeHeader (h,{column}) {
                const inReview = '会员存款量的1%，代理存款不算'
                return h(
        　　　　    'div', [
                        h('span', column.label),
                        h('el-tooltip', {
                            props: {
                                placement: 'top'
                            }
                        }, [
                            h('div', {
                                slot: 'content',
                                style: {
                                    'width':'180px',
                                    whiteSpace: 'normal',
                                    'margin-bottom': '10px'
                                }
                            }, inReview),
                            h('i', {
                                class: 'el-icon-info',
                                style: 'margin-left:5px;vertical-align: middle;color: #d5d5d5'
                            })
                        ],)
                    ]
        　　　　 )
            },
            // 表头-红利/返水
            bonusHeader (h,{column}) {
                const inReview = '红利+代理彩金+邀请有奖+VIP系统+彩金系统+返水'
                return h(
        　　　　    'div', [
                        h('span', column.label),
                        h('el-tooltip', {
                            props: {
                                placement: 'top'
                            }
                        }, [
                            h('div', {
                                slot: 'content',
                                style: {
                                    'width':'200px',
                                    'line-height' : '18px',
                                    whiteSpace: 'normal',
                                    'margin-bottom': '10px'
                                }
                            }, inReview),
                            h('i', {
                                class: 'el-icon-info',
                                style: 'margin-left:5px;vertical-align: middle;color: #d5d5d5'
                            })
                        ],)
                    ]
        　　　　 )
            },
            // 表头-其它
            otherHeader(h,{column}) {
                const inReview = '只作参考，不作计算'
                return h(
        　　　　    'div', [
                        h('span', column.label),
                        h('el-tooltip', {
                            props: {
                                placement: 'top'
                            }
                        }, [
                            h('div', {
                                slot: 'content',
                                style: {
                                    'width':'110px',
                                    whiteSpace: 'normal',
                                    'margin-bottom': '10px'
                                }
                            }, inReview),
                            h('i', {
                                class: 'el-icon-info',
                                style: 'margin-left:5px;vertical-align: middle;color: #d5d5d5'
                            })
                        ],)
                    ]
        　　　　 )
            }
        },
        mounted() {
            this.commissionReport()
        },
    }
</script>

<style scoped>
    @import '../../assets/css/reportCenter.css';
</style>