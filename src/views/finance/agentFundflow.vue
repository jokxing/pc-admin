<template>
    <div>
        <h3 class="title">代存转账记录</h3>

        <el-row :gutter="6" class="head">
            <el-form>
                <el-form-item style="margin-bottom: 10px">
                    <el-col :span="7">
                        <el-input :placeholder="level_id == 3 ? '会员账号' : '代理账号'" v-model="data.Name"></el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-select placeholder="请选择资金类型" v-model="data.Type">
                            <el-option label="全部类型" value=""></el-option>
                            <el-option label="收入" value="1"></el-option>
                            <el-option label="支出" value="2"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="7">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            :clearable="false"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
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
                    <el-col :span="8">
                        <el-button round class="primary-button" @click="query()">查询</el-button>
                        <el-button round plain @click="reset()">重置</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-row>

        <!-- 表格 -->
        <el-row>
            <el-table
                :data="tableData"
                style="width: 100%"
                v-loading="tableLoading">
                <el-table-column
                    type="index"
                    label="序号"
                    width="60">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="代理账号">
                </el-table-column>
                <el-table-column
                    prop="realname"
                    label="姓名">
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="转账金额">
                    <template slot-scope="scope">
                        <span :class="{ red: scope.row.type == '收入', green: scope.row.type == '支出'}">{{ scope.row.money }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="leave_money"
                    label="剩余金额">
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="资金类型">
                    <template slot-scope="scope">
                        <span :class="{ red: scope.row.type == '收入', green: scope.row.type == '支出'}">{{ scope.row.type }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    label="完成时间"
                    width="160">
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
    import { agentFundflowApi } from '../../http/api'
    import { timeTab, selectTime } from '../../assets/js/utils'
    export default {
        data () {
            // var myDate = new Date();
            return {
                level_id: localStorage.getItem('level_id'),
                tableLoading: true,
                // 查询
                date: [],
                pickerOptions: {
                    // disabledDate: (time) => {
                    //     return time.getTime() < (myDate.getTime() - 24*60*60*1000*31) || time.getTime() >= (Date.now())
                    // }
                },
                data: {
                    Type: "",
                    Start: "",
                    End: "",
                    Name: "",
                    Page: 1
                },
                timeTab: timeTab(),
                tabPosition: '-1',
                // 表格
                tableData:[],
                // 分页
                total: 0,
                pagesize: 50,
            }
        },
        methods: {
            agentFundflowData () {
                var _this = this;
                this.tableLoading = true;
                agentFundflowApi(_this.data).then(res => {
                    _this.tableLoading = false;
                    _this.tableData = res.data.message.data;
                    _this.total = res.data.message.total;
                    _this.pagesize = res.data.message.per_page
                }).catch(err => {
                    _this.tableLoading = false
                })
            },
            // 选择时间
            tabChange: function (tab, event) {
                this.date = selectTime(tab)
            },
            // 查询
            query: function () {
                var date1 = new Date(this.date[0]).getTime();
                var date2 = new Date(this.date[1]).getTime();
                var dates = date2 - date1;
                var days = dates / (24*60*60*1000)

                this.data.Start = this.date[0];
                this.data.End = this.date[1]

                this.agentFundflowData()
            },
            // 重置
            reset () {
                var myDate = new Date();
                this.data.Type = "";
                this.data.Start = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-01";
                this.data.End = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
                this.data.Name = "";

                this.date = [myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-01", myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()];

                this.tabPosition = "-1"

                this.agentFundflowData()
            },
            // 分页
            handleCurrentChange(val) {
                this.data.Page = val;
                this.agentFundflowData()
            }
        },
        mounted() {
            this.agentFundflowData()
        },
    }
</script>

<style scoped>
    @import url(../../assets/css/finance.css);
</style>