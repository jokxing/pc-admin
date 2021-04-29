<template>
    <div>
        <h4 class="title">邀请有奖报表</h4>

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
                :data="tableData"
                ref="table"
                border
                style="width: 100%"
                v-loading="showLoading">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        label="会员账号">
                        <template slot-scope="scope">
                            <span :class="{ red: scope.row.user_name == userName}">
                                {{ scope.row.user_name }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="一级/二级">
                        <template slot-scope="scope">
                            <div>
                                <span class="primary-color">{{ scope.row.suser1 }}</span> / {{ scope.row.suser2 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="推广成本">
                        <template slot-scope="scope">
                            <span>{{ scope.row.cost.toFixed(2) }}</span>
                            <i class="iconfont primary-color" style="float: right" :class="{ 'icon-plus': !scope.row.showCost, 'icon-reduce': scope.row.showCost }" @click="toogleExpand(scope.row)"></i>
                        </template>
                    </el-table-column>
                    <el-table-column type="expand" width="1">
                        <template slot-scope="scope">
                            <el-table
                                :data="scope.row.sub_users"
                                border>
                                <el-table-column
                                    label="下级账号">
                                    <template slot-scope="scope">
                                        <span :class="{ red: scope.row.user_name == userName }">{{ scope.row.user_name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="user_level"
                                    label="级别">
                                </el-table-column>
                                <el-table-column
                                    prop="cost"
                                    label="推广成本">
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
            </el-table>
            <!-- 小计 -->
            <el-table
                :data="CountSubtotal"
                :show-header="false"
                border
                style="width: 100%"
                v-if="CountSubtotal.length > 0">
                    <el-table-column
                        width="80">
                        <template>
                            <span>小计</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="user_name">
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div>
                                <span class="primary-color">{{ scope.row.suser1 }}</span> / {{ scope.row.suser2 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <span>{{ scope.row.cost.toFixed(2) }}</span>
                        </template>
                    </el-table-column>
            </el-table>
            <!-- 总计 -->
            <el-table
                :data="CountTotal"
                :show-header="false"
                border
                style="width: 100%"
                v-if="CountTotal.length > 0">
                    <el-table-column
                        width="80">
                        <template>
                            <span>总计</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="user_name">
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div>
                                <span class="primary-color">{{ scope.row.suser1 }}</span> / {{ scope.row.suser2 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <span>{{ scope.row.cost.toFixed(2) }}</span>
                        </template>
                    </el-table-column>
            </el-table>
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
    import { InvitationRewardReportApi } from '../../http/api';
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
                    user_name: "",
                    page: 1
                },
                timeTab: timeTab(),
                tabPosition: '-1',

                userName: '',

                showLoading: false,
                tableData: [],
                CountSubtotal: [],
                CountTotal: [],

                total: 0,
                pagesize: 50,
            }
        },
        methods: {
            InvitationRewardReportData () {
                var _this = this;
                this.showLoading = true;
                InvitationRewardReportApi(_this.data).then(res => {
                    _this.showLoading = false;
                    _this.tableData = res.data.message.Data;
                    for(var i = 0; i < _this.tableData.length; i++){
                        _this.tableData[i]['showCost'] = false;
                    };
                    _this.total = res.data.message.Total;
                    _this.pagesize = res.data.message.per_page

                    _this.CountSubtotal = [res.data.message.Count_Subtotal];
                    _this.CountTotal = [res.data.message.Count_Total]
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
                this.userName = this.data.user_name
                this.InvitationRewardReportData()
            },
            hanldReset () {
                var myDate = new Date();
                var year = myDate.getFullYear()
                var month = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
                var day = myDate.getDate()

                this.date = [year + "-" + month + "-01", year + "-" + month + "-" + day];
                this.data.start_date = year + "-" + month + "-01";
                this.data.end_date = year + "-" + month + "-" + day;
                this.data.user_name = '';

                this.userName = ''
            },
            // 分页
            handleCurrentChange(val) {
                this.data.page = val;
                this.InvitationRewardReportData()
            }
        },
        mounted() {
            this.InvitationRewardReportData()
        },
    }
</script>

<style scoped>
    @import '../../assets/css/reportCenter.css';
</style>