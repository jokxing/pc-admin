<template>
    <div class="user_report">
        <h4 class="title">会员报表</h4>

        <el-row :gutter="6">
            <el-form>
                <el-form-item>
                    <el-col :span="6">
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
                    <el-col :span="7" style="width: 31%;">
                         <el-radio-group v-model="tabPosition" @change="tabChange">
                            <el-radio-button 
                                v-for="(item, index) in timeTab" 
                                :key="index" 
                                :label="item.val">
                                    {{ item.text }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="4">
                        <el-input placeholder="会员账号" v-model="data.user_name"></el-input>
                    </el-col>
                    <el-col :span="6" class="form_button">
                        <el-button class="primary-button" round @click="handleQuery">查询</el-button>
                        <el-button plain round @click="hanldReset">重置</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-row>

        <el-row>
            <el-table
                ref="table"
                :data="tableData"
                border
                style="width: 100%"
                v-loading="tableLoading"
                :default-sort = "{prop: 'real_win_lost', order: 'ascending'}"
                @sort-change="changeSort">
                <el-table-column
                    prop="user_name"
                    label="会员账号">
                </el-table-column>
                <el-table-column
                    prop="ins_win_money"
                    label="内容1"
                    sortable='custom'
                    width="110">
                        <template slot-scope="scope">
                            <span :class="{ 'red': scope.row.ins_win_money < 0, 'green': scope.row.ins_win_money > 0 }">
                                {{ scope.row.ins_win_money }}
                            </span>
                        </template>
                </el-table-column>
                <el-table-column
                    label="内容2"
                    width="128">
                        <template slot-scope="scope">
                            <span>{{ (scope.row.bonus_money + scope.row.agent_bonus + scope.row.user_agent + scope.row.uservip_system + scope.row.bonus_system + scope.row.dpt_bonus_money + scope.row.water_money).toFixed(2) }}</span>
                            <i class="iconfont primary-color" style="float: right;margin-left:6px" :class="{ 'icon-plus': !scope.row.showBonus, 'icon-reduce': scope.row.showBonus }" @click="toogleExpand(scope.row, 'bonus')"></i>
                        </template>
                </el-table-column>
                <el-table-column
                    prop="dpt_bonus_money"
                    label="内容3"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="game_fee"
                    label="内容4"
                    width="96">
                </el-table-column>
                <el-table-column
                    prop="real_win_lost"
                    label="内容5"
                    sortable='custom'
                    width="110">
                    <template slot-scope="scope">
                        <span :class="{ 'red': scope.row.real_win_lost < 0, 'green': scope.row.real_win_lost > 0 }">
                            {{ scope.row.real_win_lost }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="其它"
                    width="60">
                        <template slot-scope="scope">
                            <i class="iconfont primary-color" :class="{ 'icon-plus': !scope.row.showOther, 'icon-reduce': scope.row.showOther }" @click="toogleExpand(scope.row, 'other')"></i>
                        </template>
                </el-table-column>
                <el-table-column
                    prop="transfer"
                    sortable='custom'
                    label="内容6"
                    width="110">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="60">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="" placement="top">
                                <i class="el-icon-s-order"></i>
                            </el-tooltip>
                        </template>
                </el-table-column>

                <el-table-column type="expand" width="1">
                    <template slot-scope="scope">
                        <!-- 红利/返水 -->
                        <el-table
                            :data="scope.row.bonusDetail"
                            border
                            v-show="scope.row.showBonus">
                            <el-table-column
                                prop="bonus_money"
                                label="内容2-1">
                            </el-table-column>
                            <el-table-column
                                prop="agent_bonus"
                                label="内容2-2">
                            </el-table-column>
                            <el-table-column
                                prop="user_agent"
                                label="内容2-3">
                            </el-table-column>
                            <el-table-column
                                prop="uservip_system"
                                label="内容2-4">
                            </el-table-column>
                            <el-table-column
                                prop="bonus_system"
                                label="内容2-5">
                            </el-table-column>
                            <el-table-column 
                                prop="dpt_bonus_money"
                                label="内容2-6">
                            </el-table-column>
                            <el-table-column 
                                prop="water_money"
                                label="内容2-7">
                            </el-table-column>
                        </el-table>
                        <!-- 其它 -->
                        <el-table
                            :data="scope.row.otherDetail"
                            border
                            v-show="scope.row.showOther">
                            <el-table-column
                                prop="beat_num"
                                label="其他1">
                            </el-table-column>
                            <el-table-column
                                prop="beat_money"
                                label="其他2">
                            </el-table-column>
                            <el-table-column
                                prop="valid_betamt"
                                label="其他3">
                            </el-table-column>
                            <el-table-column
                                prop="dpt_money"
                                label="其他4">
                            </el-table-column>
                            <el-table-column
                                prop="wtd_money"
                                label="其他5">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 小计 -->
        </el-row>

        <!-- 分页 -->
        <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page.sync="data.page" 
            :total="total"
            :page-size="pagesize"
            :hide-on-single-page="true">
        </el-pagination>
    </div>
</template>

<script>
    import { AllUserReportApi } from '../../http/api';
    import { timeTab, selectTime } from '../../assets/js/utils'
    export default {
        data () {
            var myDate = new Date();
            var year = myDate.getFullYear()
            var month = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
            var day = myDate.getDate()
            return {
                date: [myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate(), myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()],
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < (myDate.getTime() - 24*60*60*1000*31*3) || time.getTime() >= (Date.now())
                    }
                },
                data: {
                    Start: year + "-" + month + "-" + (day < 10 ? "0" + day : day),
                    End: year + "-" + month + "-" + (day < 10 ? "0" + day : day),
                    page: 1,
                    user_name: "",
                    sort: "real_win_lost",
                    sort_type: "asc"
                },
                timeTab: timeTab(),
                tabPosition: '-1',

                tableData:[],
                tableLoading: false,

                total: 0,
                pagesize: 0,

                CountSubtotal: [],
                CountTotal: [],
                tableError: false
            }
        },
        methods: {
            AllUserReportData () {
                var _this = this;
                this.tableLoading = true;
                AllUserReportApi(_this.data).then(res => {
                    _this.tableLoading = false;
                    _this.tableError = false;
                    _this.tableData = res.data.message.Data;
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
                            }
                        ]
                    }
                    _this.total = res.data.message.Total;
                    _this.pagesize = res.data.message.Pagesize;

                    _this.CountSubtotal = [res.data.message.Count_Subtotal];
                    for(var i = 0; i < _this.CountSubtotal.length; i++){
                        _this.CountSubtotal[i]['showBonus'] = false;
                        _this.CountSubtotal[i]['showOther'] = false;
                        _this.CountSubtotal[i]['countBonusDetail'] = [
                            {
                                bonus_money: _this.CountSubtotal[i].bonus_money,
                                agent_bonus: _this.CountSubtotal[i].agent_bonus,
                                user_agent: _this.CountSubtotal[i].user_agent,
                                uservip_system: _this.CountSubtotal[i].uservip_system,
                                bonus_system: _this.CountSubtotal[i].bonus_system,
                                dpt_bonus_money: _this.CountSubtotal[i].dpt_bonus_money,
                                water_money: _this.CountSubtotal[i].water_money,
                            }
                        ];
                        _this.CountSubtotal[i]['countOtherDetail'] = [
                            {
                                beat_num: _this.CountSubtotal[i].beat_num,
                                beat_money: _this.CountSubtotal[i].beat_money,
                                valid_betamt: _this.CountSubtotal[i].valid_betamt,
                                dpt_money: _this.CountSubtotal[i].dpt_money,
                                wtd_money: _this.CountSubtotal[i].wtd_money,
                            }
                        ]
                    }

                    _this.CountTotal = [res.data.message.Count_Total];
                    for(var i = 0; i < _this.CountTotal.length; i++){
                        _this.CountTotal[i]['showBonus'] = false;
                        _this.CountTotal[i]['showOther'] = false;
                        _this.CountTotal[i]['countBonusDetail'] = [
                            {
                                bonus_money: _this.CountTotal[i].bonus_money,
                                agent_bonus: _this.CountTotal[i].agent_bonus,
                                user_agent: _this.CountTotal[i].user_agent,
                                uservip_system: _this.CountTotal[i].uservip_system,
                                bonus_system: _this.CountTotal[i].bonus_system,
                                dpt_bonus_money: _this.CountTotal[i].dpt_bonus_money,
                                water_money: _this.CountTotal[i].water_money,
                            }
                        ];
                        _this.CountTotal[i]['countOtherDetail'] = [
                            {
                                beat_num: _this.CountTotal[i].beat_num,
                                beat_money: _this.CountTotal[i].beat_money,
                                valid_betamt: _this.CountTotal[i].valid_betamt,
                                dpt_money: _this.CountTotal[i].dpt_money,
                                wtd_money: _this.CountTotal[i].wtd_money,
                            }
                        ]
                    }
                }).catch(err => {
                    _this.tableLoading = false;
                    _this.tableError = true;
                })
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
            SubToogleExpand(row, label) {
                let $table = this.$refs.SubTable;
                this.CountSubtotal.map((item) => {
                    if(label == 'other'){
                        item.showBonus = false;
                        item.showOther =! item.showOther;
                    }else{
                        item.showBonus =! item.showBonus
                        item.showOther = false
                    }
                    $table.toggleRowExpansion(item, false)
                })
                if(!row.showOther && !row.showBonus){
                    $table.toggleRowExpansion(row, false)
                }else{
                    $table.toggleRowExpansion(row, true)
                }
            },
            TotalToogleExpand(row, label) {
                let $table = this.$refs.TotalTable;
                this.CountTotal.map((item) => {
                    if(label == 'other'){
                        item.showBonus = false;
                        item.showOther =! item.showOther;
                    }else{
                        item.showBonus =! item.showBonus
                        item.showOther = false
                    }
                    $table.toggleRowExpansion(item, false)
                })
                if(!row.showOther && !row.showBonus){
                    $table.toggleRowExpansion(row, false)
                }else{
                    $table.toggleRowExpansion(row, true)
                }
            },
            // 选择时间
            tabChange: function (tab, event) {
                this.date = selectTime(tab)

                this.data.Start = this.date[0];
                this.data.End = this.date[1];
                this.AllUserReportData()
            },
            // 计算时间戳
            getDate: function (time) {
                var myDate = new Date(time);
                var year = myDate.getFullYear();
                var month = myDate.getMonth() + 1;
                var day = myDate.getDate();
                return year + "-" + month + "-" + day;
            },
            handleQuery() {
                this.data.Start = this.date[0];
                this.data.End = this.date[1];
                this.data.page = 1;
                this.AllUserReportData()
            },
            hanldReset () {
                var myDate = new Date();
                var year = myDate.getFullYear()
                var month = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
                var day = myDate.getDate()

                this.date = [year + "-" + month + "-" + day, year + "-" + month + "-" + day];
                this.data.Start = year + "-" + month + "-" + day;
                this.data.End = year + "-" + month + "-" + day;

                this.tabPosition = '-1';
                this.data.user_name = '';
                this.data.page = 1;

                this.AllUserReportData()
            },
            // 排序
            changeSort (val){
                this.data.sort = val.prop;
                // 顺序还是倒序
                if(val.order == "descending"){
                    this.data.sort_type = 'desc'
                }else{
                    this.data.sort_type = 'asc'
                };

                this.AllUserReportData()
            },
            // 分页
            handleCurrentChange(val) {
                this.data.page = val;
                this.AllUserReportData()
            }
        },
        mounted () {
            this.AllUserReportData()
        }
    }
</script>

<style scoped>
    @import '../../assets/css/reportCenter.css';
</style>