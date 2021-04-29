<template>
    <div class="commission_report" v-loading="showLoading">
        <h4 class="title">佣金报表</h4>

        <div v-for="(item, index) in list" :key="index" class="commission_box">
            <el-row class="commission_title">
                <div class="fix" @click="item.showTable =! item.showTable">
                    <span class="left">{{ item.date_str }}</span>
                    <span class="right">
                        <i class="iconfont primary-color" :class="{ 'icon-plus': !item.showTable, 'icon-reduce': item.showTable }"></i>
                    </span>
                </div>
            </el-row>

            <el-row :gutter="15" class="commission_data">
                <el-col>
                    <div>
                        <p>
                            <i class="iconfont icon-qiandaizi yellow"></i>
                            当月佣金
                            <el-tooltip placement="top" class="item">
                                <div slot="content" style="font-size: 14px;line-height: 24px">每月2-5日发放上月佣金<br />当月佣金=实际盈亏*佣金比例+会员代存+上月结余+开客奖励+额外奖励</div>
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </p>
                        <span>{{ item.money }}</span>
                    </div>
                </el-col>
                <el-col>
                    <div>
                        <p>
                            <i class="iconfont icon-tuiguangzhuanqian pink"></i>
                            上月结余 
                            <el-tooltip class="item" effect="dark" content="上月待结算款项" placement="top">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </p>
                        <span>{{ item.last_balance }}</span>
                    </div>
                </el-col>
                <el-col>
                    <div>
                        <p>
                            <i class="iconfont icon-jianglijili blue"></i>
                            开客奖励
                            <el-tooltip class="item" effect="dark" content="通常有效客一个是200到400奖励" placement="top">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </p>
                        <span>{{ item.valid_reward }}</span>
                    </div>
                </el-col>
                <el-col>
                    <div>
                        <p>
                            <i class="iconfont icon-jianglidan violet"></i>
                            额外奖励
                            <el-tooltip class="item" effect="dark" content="代理额外福利补贴" placement="top">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </p>
                        <span>{{ item.correction }}</span>
                    </div>
                </el-col>
                <el-col>
                    <div>
                        <p>
                            <i class="el-icon-user-solid"></i>
                            会员代存
                        </p>
                        <span>{{ item.detail[0].transfer_user }}</span>
                    </div>
                </el-col>
                <el-col>
                    <div>
                        <p>
                            <i class="iconfont icon-16 yellow"></i>
                            实际盈亏
                            <el-tooltip class="item" effect="dark" content="会员输赢+红利/返水+手续费+平台费" placement="top">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </p>
                        <span :class="{ 'green': item.profit > 0, 'red': item.profit < 0 }">{{ item.profit }}</span>
                    </div>
                </el-col>
                <el-col>
                    <div>
                        <p>
                            <i class="iconfont icon-chart primary-color"></i>
                            佣金比例
                        </p>
                        <span>{{ item.rate }}</span>
                    </div>
                </el-col>
                <!-- <el-col>
                    <div>
                        <p>
                            <i class="el-icon-user-solid"></i>
                            有效用户
                        </p>
                        <span>{{ item.valid }}</span>
                    </div>
                </el-col> -->
            </el-row>

            <el-row class="commission_table" v-show="item.showTable">
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
                            <!-- <i class="iconfont primary-color" :class="{ 'icon-plus': !showFee[index], 'icon-reduce': showFee[index] }" style="float:right" @click="feeClick(index)"></i> -->
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
                <!-- 平台费表格 -->
                <!-- <el-table
                    :data="item.game_fee_desc.game"
                    border
                    show-summary
                    style="width: 100%;margin-top: 10px"
                    v-show="item.showFee">
                    <el-table-column
                        prop="name"
                        label="平台">
                    </el-table-column>
                    <el-table-column
                        prop="payout"
                        label="输赢">
                        <template slot-scope="scope">
                            <span :class="{ 'red': scope.row.payout < 0, 'green': scope.row.payout > 0 }">
                                {{ scope.row.payout }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="平台费率">
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.rate }} %
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="fee"
                        label="平台费">
                    </el-table-column>
                    <el-table-column
                        prop="valid_betamt"
                        label="流水">
                    </el-table-column>
                </el-table> -->
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
                showFee: [false,false,false]
            }
        },
        methods: {
            commissionReport () {
                var _this = this;
                commissionReportApi().then(res => {
                    _this.showLoading = false;
                    for(var i = 0; i < res.data.message.length; i++){
                        res.data.message[i].showTable = false
                    }
                    _this.list = res.data.message;
                    for(var i = 0; i < _this.list.length; i++){
                        _this.list[i].detail = [_this.list[i].detail];
                        _this.list[i].showBonus = false;
                        _this.list[i].showOther = false;
                    }

                    // 平台费表格-总计
                    // setTimeout(function(){
                    //     var dom = document.getElementsByClassName('el-table__footer');
                    //     var text0 = dom[0].childNodes[1].childNodes[0].childNodes[1].innerText;
                    //     if(text0 < 0){
                    //         dom[0].childNodes[1].childNodes[0].childNodes[1].classList.add('red')
                    //     }else if(text0 > 0){
                    //         dom[0].childNodes[1].childNodes[0].childNodes[1].classList.add('green')
                    //     }
                        
                    //     var text1 = dom[1].childNodes[1].childNodes[0].childNodes[1].innerText;
                    //     if(text1 < 0){
                    //         dom[1].childNodes[1].childNodes[0].childNodes[1].classList.add('red')
                    //     }else if(text1 > 0){
                    //         dom[1].childNodes[1].childNodes[0].childNodes[1].classList.add('green')
                    //     }

                    //     var text2 = dom[2].childNodes[1].childNodes[0].childNodes[1].innerText;
                    //     if(text2 < 0){
                    //         dom[2].childNodes[1].childNodes[0].childNodes[1].classList.add('red')
                    //     }else if(text2 > 0){
                    //         dom[2].childNodes[1].childNodes[0].childNodes[1].classList.add('green')
                    //     }
                    // },100)
                }).catch(err => {
                    _this.showLoading = false
                })
            },
            bonusClick(index) {
                var show = !this.list[index].showBonus;
                this.$set(this.list, index, { ...this.list[index], showBonus: show })

                var show2 = this.list[index].showBonus;
                this.$set(this.showBonus, index, show2)
            },
            feeClick(index) {
                var show = !this.list[index].showFee;
                this.$set(this.list, index, { ...this.list[index], showFee: show })

                var show2 = this.list[index].showFee;
                this.$set(this.showFee, index, show2)
            },
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