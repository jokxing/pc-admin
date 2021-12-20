<template>
    <div>
        <h4 class="title agent_subordinate">
            <el-page-header @back="back" content="三级代理"></el-page-header>
        </h4>

        <el-table
            :data="tableData"
            ref="table"
            border
            style="width: 100%"
            v-loading="showLoading">
            <el-table-column
                label="代理账号（三级代理）"
                width="182">
                <template slot-scope="scope">
                    <div>
                        <router-link :to="'/lowerLevelMemberList?id=' + scope.row.id + '&Start=' + $route.query.Start + '&End=' + $route.query.End">
                            {{ scope.row.code }} ({{ scope.row.realname }})
                        </router-link>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="payout"
                label="代理总输赢">
                <template slot-scope="scope">
                    <span>
                        {{ scope.row.payout.toFixed(2) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="红利/返水"
                width="140"
                :render-header="bonusHeader">
                <template slot-scope="scope">
                    <span>{{ (scope.row.bonus_money + scope.row.agent_bonus + scope.row.user_agent + scope.row.uservip_system + scope.row.bonus_system + scope.row.dpt_bonus_money + scope.row.water_money).toFixed(2) }}</span>
                    <i class="iconfont primary-color" style="float: right;margin-left:6px" :class="{ 'icon-plus': !scope.row.showBonus, 'icon-reduce': scope.row.showBonus }" @click="toogleExpand(scope.row, 'bonus')"></i>
                </template>
            </el-table-column>
            <el-table-column
                prop="fee"
                label="手续费"
                width="112"
                :render-header="feeHeader">
            </el-table-column>
            <el-table-column
                label="平台费"
                width="90">
                <template slot-scope="scope">
                    <span>{{ scope.row.game_fee.toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="实际盈亏"
                width="126"
                :render-header="realHeader">
                <template slot-scope="scope">
                    <span :class="{ 'red': scope.row.real_win_lost < 0, 'green': scope.row.real_win_lost > 0 }">
                        {{ scope.row.real_win_lost }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop=""
                label="其它"
                width="92"
                :render-header="otherHeader">
                <template slot-scope="scope">
                    <i class="iconfont primary-color" :class="{ 'icon-plus': !scope.row.showOther, 'icon-reduce': scope.row.showOther }" @click="toogleExpand(scope.row, 'other')"></i>
                </template>
            </el-table-column>
            <el-table-column
                prop="transfer_user"
                label="会员代存"
                width="86">
            </el-table-column>

            <el-table-column type="expand" width="1">
                <template slot-scope="scope">
                    <!-- 红利表格 -->
                    <el-table
                        :data="scope.row.bonusDetail"
                        border
                        v-show="scope.row.showBonus">
                        <el-table-column
                            prop="bonus_money"
                            label="红利"
                            width="120">
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

                    <!-- 其它 -->
                    <el-table
                        :data="scope.row.otherDetail"
                        border
                        v-show="scope.row.showOther">
                        <el-table-column
                            prop="beat_num"
                            label="注单笔数"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="beat_money"
                            label="投注金额"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="valid_betamt"
                            label="有效投注"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="dpt_money"
                            label="存款金额"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="wtd_money"
                            label="取款金额"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="valid_user"
                            label="有效会员"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="is_new_reg"
                            label="注册数">
                        </el-table-column>
                        <el-table-column
                            prop="dpt_money"
                            label="存款金额"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="dpt_count"
                            label="存款人数"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="wtd_money"
                            label="提款金额"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="wtd_count"
                            label="提款人数"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="new_dpt_money"
                            label="首存金额"
                            width="90">
                        </el-table-column>
                        <el-table-column
                            prop="is_new_dpt"
                            label="首存人数"
                            width="90">
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { companyReportApi } from '../../http/api'
    export default {
        data() {
            return {
                showLoading: false,
                tableData: []
            }
        },
        methods: {
            payoutReportData () {
                var _this = this;
                this.showLoading = true;
                var data = {
                    Start: this.$route.query.Start,
                    End: this.$route.query.End,
                    Agent_id: this.$route.params.id,
                    Act: 2
                }
                companyReportApi(data).then(res => {
                    _this.showLoading = false;
                    _this.tableData = res.data.message
                    var code = _this.$route.query.code
                    if(code){
                        for (let i = _this.tableData.length - 1; i >= 0; i--) {
                            if (_this.tableData[i].code !== code) {
                                _this.tableData.splice(i, 1);
                            }
                        }
                    }
                    for(var i = 0; i < _this.tableData.length; i++){
                        _this.tableData[i]['showOther'] = false;
                        _this.tableData[i]['showBonus'] = false;
                        _this.tableData[i]['bonusDetail'] = [
                            {
                                bonus_money: _this.tableData[i].bonus_money,
                                agent_bonus: _this.tableData[i].agent_bonus,
                                user_agent: _this.tableData[i].user_agent,
                                uservip_system: _this.tableData[i].uservip_system,
                                bonus_system: _this.tableData[i].bonus_system,
                                dpt_bonus_money: _this.tableData[i].dpt_bonus_money,
                                water_money: _this.tableData[i].water_money,
                            }
                        ];
                        _this.tableData[i]['otherDetail'] = [
                            {
                                beat_num: _this.tableData[i].beat_num,
                                beat_money: _this.tableData[i].beat_money,
                                valid_betamt: _this.tableData[i].valid_betamt,
                                dpt_money: _this.tableData[i].dpt_money,
                                wtd_money: _this.tableData[i].wtd_money,
                                valid_user: _this.tableData[i].valid_user,
                                is_new_reg: _this.tableData[i].is_new_reg,
                                dpt_count: _this.tableData[i].dpt_count,
                                wtd_count: _this.tableData[i].wtd_count,
                                is_new_dpt: _this.tableData[i].is_new_dpt,
                                new_dpt_money: _this.tableData[i].new_dpt_money,
                            }
                        ]
                    }
                }).catch(err => {
                    _this.showLoading = false
                })
            },
            // 展开里面表格
            toogleExpand(row, label) {
                let $table = this.$refs.table;
                this.tableData.map((item) => {
                    if(item.id != row.id){
                        item.showOther = false;
                        item.showBonus = false
                    }
                    $table.toggleRowExpansion(item, false)
                })
                if(label == 'other'){
                    row.showOther =! row.showOther;
                    row.showBonus = false
                }else{
                    row.showBonus =! row.showBonus;
                    row.showOther = false
                }
                if(!row.showOther && !row.showBonus){
                    $table.toggleRowExpansion(row, false)
                }else{
                    $table.toggleRowExpansion(row, true)
                }
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
            },
            back () {
                this.$router.push({
                    name: 'payoutReport',
                    params:{
                        num: 1
                    }
                })
            }
        },
        mounted () {
            this.payoutReportData()
        }
    }
</script>

<style scoped>
</style>