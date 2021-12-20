<template>
    <div>
        <h4 class="title">代理邀请报表</h4>

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
                        <el-input placeholder="下线代理" v-model="data.agent_code"></el-input>
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
                :data="tableData"
                ref="table"
                border
                show-summary
                sum-text="总计"
                style="width: 100%"
                v-loading="showLoading">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="下线代理"
                        width="160">
                    </el-table-column>
                    <el-table-column
                        prop="level"
                        label="级别"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="profit"
                        label="实际收益"
                        width="150">
                            <template slot-scope="scope">
                                <span :class="{ red: scope.row.profit < 0, green: scope.row.profit > 0}">{{ scope.row.profit }}</span>
                            </template>
                    </el-table-column>
                    <el-table-column
                        prop="vuser_num"
                        label="有效会员（本月）"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="reward"
                        label="推广收益（预算）">
                            <template slot-scope="scope">
                                <span :class="{ red: scope.row.reward < 0, green: scope.row.reward > 0}">{{ scope.row.reward }}</span>
                            </template>
                    </el-table-column>
            </el-table>
        </el-row>
    </div>
</template>

<script>
    import { InvitAgentRewardReportApi } from '../../http/api';
    import { timeTab, selectTime } from '../../assets/js/utils'
    var myDate = new Date();
    var year = myDate.getFullYear()
    var month = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
    var day = myDate.getDate()
    export default {
        data() {
            return {
                date: [myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate(), myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()],
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < (myDate.getTime() - 24*60*60*1000*31*3) || time.getTime() >= (Date.now())
                    }
                },
                data: {
                    start_date: year + "-" + month + "-" + (day < 10 ? "0" + day : day),
                    end_date: year + "-" + month + "-" + (day < 10 ? "0" + day : day),
                    agent_code: "",
                },
                timeTab: timeTab(),
                tabPosition: '-1',

                showLoading: false,
                tableData: [],
            }
        },
        methods: {
            InvitationRewardReportData () {
                var _this = this;
                this.showLoading = true;
                InvitAgentRewardReportApi(_this.data).then(res => {
                    _this.showLoading = false;
                    _this.tableData = res.data.message;
                }).catch(err => {
                    _this.showLoading = false
                })
            },
            // 展开里面表格
            toogleExpand(row) {
                let $table = this.$refs.table;
                this.tableData.map((item) => {
                    if(item.user_id != row.user_id){
                        item.showCost = false;
                    }
                    $table.toggleRowExpansion(item, false)
                })
                row.showCost =! row.showCost;
                if(!row.showCost){
                    $table.toggleRowExpansion(row, false)
                }else{
                    $table.toggleRowExpansion(row, true)
                }
            },
            // 选择时间
            tabChange: function (tab, event) {
                this.date = selectTime(tab)
                this.data.start_date = this.date[0];
                this.data.end_date = this.date[1];
                this.InvitationRewardReportData()
            },
            handleQuery() {
                this.data.start_date = this.date[0];
                this.data.end_date = this.date[1];
                this.InvitationRewardReportData()
            },
            hanldReset () {
                var myDate = new Date();
                var year = myDate.getFullYear()
                var month = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
                var day = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();

                this.date = [year + "-" + month + "-01", year + "-" + month + "-" + day];
                this.data.start_date = year + "-" + month + "-01";
                this.data.end_date = year + "-" + month + "-" + day;
                this.data.user_name = '';

                this.tabPosition = '-1'
            },
        },
        mounted() {
            this.InvitationRewardReportData()
        },
    }
</script>

<style scoped>
    @import '../../assets/css/reportCenter.css';
</style>