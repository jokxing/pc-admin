<template>
    <div class="payout_report">
        <h4 class="title">输赢报表</h4>

        <el-row class="notice_tab" v-if="level_id != 3">
            <el-col :span="4" v-for="(item, index) in titleTabs" :key="index" :class="{ 'tab_active' : titleTabNum == index }">
                <div @click="titleClick(index)">{{ item }}</div>
            </el-col>
        </el-row>
        
        <el-row :gutter="20">
            <el-form>
                <el-form-item>
                    <el-col :span="7">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            :clearable="false"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions"
                            @change="tabPosition = '-1'">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="8">
                         <el-radio-group v-model="tabPosition" @change="tabChange">
                            <el-radio-button 
                                v-for="(item, index) in timeTab" 
                                :key="index" 
                                :label="item.val">
                                    {{ item.text }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="6" class="form_button">
                        <el-button class="primary-button" round @click="handleQuery">查询</el-button>
                        <el-button plain round @click="hanldReset">重置</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-row>

        <el-row v-if="level_id == 1" v-loading="showLoading">
            <onePayoutReport :oneLeveData="offline" :num="titleTabNum" :Start="data.Start" :End="data.End"></onePayoutReport>
        </el-row>

        <el-row v-if="level_id == 2 && titleTabNum == 1" v-loading="showLoading">
            <offlinePayoutReport :offlineData="offline"></offlinePayoutReport>
        </el-row>

        <el-row v-if="level_id == 3 || (level_id == 2 && titleTabNum == 0)">
            <el-table
                :data="tableData"
                border
                style="width: 100%"
                v-loading="showLoading">
                <el-table-column
                    prop="payout"
                    label="会员输赢"
                    width="100">
                    <template slot-scope="scope">
                        <span :class="{ red: scope.row.payout < 0, green: scope.row.payout > 0}">
                            {{ scope.row.payout.toFixed(2) }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="会员红利/返水"
                    width="160"
                    :render-header="bonusHeader">
                    <template slot-scope="scope">
                        <span>{{ (scope.row.bonus_money + scope.row.agent_bonus + scope.row.user_agent + scope.row.uservip_system + scope.row.bonus_system + scope.row.dpt_bonus_money + scope.row.water_money).toFixed(2) }}</span>
                        <i class="iconfont primary-color" :class="{ 'icon-plus': !showBonus, 'icon-reduce': showBonus }" style="float:right" @click="showBonus =! showBonus"></i>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="fee"
                    label="存款手续费"
                    width="140"
                    :render-header="feeHeader">
                </el-table-column>
                <el-table-column
                    label="平台费">
                    <template slot-scope="scope">
                        <span>{{ scope.row.game_fee.toFixed(2) }}</span>
                        <!-- <i class="iconfont primary-color" :class="{ 'icon-plus': !showFee, 'icon-reduce': showFee }" style="float:right" @click="showFee =! showFee"></i> -->
                    </template>
                </el-table-column>
                <el-table-column
                    label="实际盈亏"
                    :render-header="realHeader"
                    width="130">
                    <template slot-scope="scope">
                        <span :class="{ 'red': scope.row.real_win_lost < 0, 'green': scope.row.real_win_lost > 0 }">
                            {{ scope.row.real_win_lost }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop=""
                    label="其它"
                    width="96"
                    :render-header="otherHeader">
                    <template slot-scope="scope">
                        <i class="iconfont primary-color" :class="{ 'icon-plus': !showOther, 'icon-reduce': showOther }" @click="showOther =! showOther"></i>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="transfer_user"
                    label="会员代存">
                </el-table-column>
            </el-table>
            <!-- 红利表格 -->
            <el-table
                :data="tableData"
                border
                style="width: 100%;margin-top: 10px"
                v-show="showBonus">
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
            <!-- 平台费表格 -->
            <!-- <el-table
                :data="game_fee_desc"
                border
                show-summary
                style="width: 100%;margin-top: 10px"
                v-show="showFee">
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
                :data="tableData"
                border
                style="width: 100%;margin-top: 10px"
                v-show="showOther">
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
                    label="本月有效会员">
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
        </el-row>
    </div>
</template>

<script>
    import offlinePayoutReport from './offlinePayoutReport.vue'
    import onePayoutReport from './onePayoutReport.vue'
    import { companyReportApi } from '../../http/api';
    import { timeTab, selectTime } from '../../assets/js/utils'
    var myDate = new Date();
    var year = myDate.getFullYear()
    var month = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
    var day = myDate.getDate()
    export default {
        data() {
            return {
                level_id:localStorage.getItem('level_id'),
                titleTabs: ['总输赢报表', '下线输赢报表'],
                titleTabNum: 0,
                // 时间
                date: [myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate(), myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()],
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < (myDate.getTime() - 24*60*60*1000*31*3) || time.getTime() >= (Date.now())
                    }
                },
                data: {
                    Start: year + "-" + month + "-" + (day < 10 ? "0" + day : day),
                    End: year + "-" + month + "-" + (day < 10 ? "0" + day : day),
                },
                timeTab: timeTab(),
                tabPosition: '-1',

                tableData: [],
                offline: [],
                showLoading: false,
                // 红利表格
                showBonus: false,
                // 平台费
                // showFee: false,
                // game_fee_desc: [],
                // 其它表格
                showOther: false
            }
        },
        methods: {
            payoutReportData () {
                var _this = this;
                this.showLoading = true;
                if(this.level_id == 3){
                    var data = {
                        Start: this.data.Start,
                        End: this.data.End,
                    }
                }
                if(this.level_id == 2 || this.level_id == 1){
                    if(this.titleTabNum == 0){
                        var data = {
                            Start: this.data.Start,
                            End: this.data.End,
                        }
                    }else{
                        if(this.$route.query.id){
                            var data = {
                                Start: this.data.Start,
                                End: this.data.End,
                                Agent_id: this.$route.query.id
                            }
                        }else{
                            var data = {
                                Start: this.data.Start,
                                End: this.data.End,
                                Act: 2
                            }
                        }
                    };
                }
                this.offline = [];
                companyReportApi(data).then(res => {
                    _this.showLoading = false;
                    if((_this.level_id == 2 && _this.titleTabNum == 1) || _this.level_id == 1){
                        _this.offline = res.data.message
                        var code = _this.$route.query.code
                        if(code){
                            for (let i = _this.offline.length - 1; i >= 0; i--) {
                                if (_this.offline[i].code !== code) {
                                    _this.offline.splice(i, 1);
                                }
                            }
                        }
                        for(var i = 0; i < _this.offline.length; i++){
                            _this.offline[i]['showOther'] = false;
                            _this.offline[i]['showBonus'] = false;
                            _this.offline[i]['bonusDetail'] = [
                                {
                                    bonus_money: _this.offline[i].bonus_money,
                                    agent_bonus: _this.offline[i].agent_bonus,
                                    user_agent: _this.offline[i].user_agent,
                                    uservip_system: _this.offline[i].uservip_system,
                                    bonus_system: _this.offline[i].bonus_system,
                                    dpt_bonus_money: _this.offline[i].dpt_bonus_money,
                                    water_money: _this.offline[i].water_money,
                                }
                            ];
                            _this.offline[i]['otherDetail'] = [
                                {
                                    beat_num: _this.offline[i].beat_num,
                                    beat_money: _this.offline[i].beat_money,
                                    valid_betamt: _this.offline[i].valid_betamt,
                                    dpt_money: _this.offline[i].dpt_money,
                                    wtd_money: _this.offline[i].wtd_money,
                                    valid_user: _this.offline[i].valid_user,
                                    is_new_reg: _this.offline[i].is_new_reg,
                                    dpt_count: _this.offline[i].dpt_count,
                                    wtd_count: _this.offline[i].wtd_count,
                                    is_new_dpt: _this.offline[i].is_new_dpt,
                                    new_dpt_money: _this.offline[i].new_dpt_money,
                                }
                            ]
                        }
                    }else{
                        _this.tableData = res.data.message;
                    }
                }).catch(err => {
                    _this.showLoading = false
                })
            },
            // 标题tab
            titleClick (index) {
                this.titleTabNum = index;
                this.payoutReportData()
            },
            // 选择时间
            tabChange: function (tab, event) {
                this.date = selectTime(tab)

                this.data.Start = this.date[0];
                this.data.End = this.date[1];
                this.payoutReportData()
            },
            handleQuery() {
                this.data.Start = this.date[0];
                this.data.End = this.date[1];
                this.payoutReportData()
            },
            hanldReset () {
                var myDate = new Date();
                var year = myDate.getFullYear()
                var month = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
                var day = myDate.getDate()

                this.date = [year + "-" + month + "-01", year + "-" + month + "-" + day];
                this.data.Start = year + "-" + month + "-01";
                this.data.End = year + "-" + month + "-" + day;
            },
            // 展开里面表格
            toogleExpand(row, label) {
                let $table = this.$refs.table;
                this.tableData.map((item) => {
                    if(item.user_id != row.user_id){
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
            }
        },
        mounted() {
            if(this.$route.query.num){
                this.titleTabNum = this.$route.query.num
            }
            if(this.$route.params.num){
                this.titleTabNum = this.$route.params.num
            }
            this.payoutReportData()
        },
        components: {
            offlinePayoutReport,
            onePayoutReport
        }
    }
</script>

<style scoped>
</style>