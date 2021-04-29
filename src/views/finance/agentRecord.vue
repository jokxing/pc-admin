<template>
    <div>
        <el-row :gutter="6" class="head">
            <el-form>
                <el-form-item>
                    <el-col :span="6">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            :clearable="false"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="tabPosition = '-1'">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="7">
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
                        <el-input placeholder="会员账号" v-model="data.Name"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button round class="primary-button" @click="query()">查询</el-button>
                        <el-button round plain @click="reset()">重置</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-row>

        <el-row>
            <el-table
                :data="tableData"
                style="width: 100%"
                v-loading="tableLoading"
                @sort-change="changeSort">
                    <el-table-column
                        prop="date"
                        :label="type + '日期'"
                        width="170">

                    </el-table-column>
                    <el-table-column
                        prop="user"
                        label="会员账号"
                        width="120">

                    </el-table-column>
                    <el-table-column
                        prop="fundsn"
                        label="单号"
                        width="">

                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        :label="type + '金额'"
                        sortable
                        width="140">

                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态"
                        width="90">

                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="备注"
                        width="">

                    </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :current-page.sync="data.Page" 
                :total="total"
                :page-size="PageSize"
                :hide-on-single-page="true">
            </el-pagination>
        </el-row>
    </div>
</template>

<script>
    import { agentDepositRecordApi, aagentBonusRecordApi } from '../../http/api';
    import { timeTab, selectTime } from '../../assets/js/utils'
    export default {
        props:['type'],
        data() {
            var myDate = new Date();
            return {
                date: [],
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < (myDate.getTime() - 24*60*60*1000*31*3) || time.getTime() >= (Date.now())
                    }
                },
                timeTab: timeTab(),
                tabPosition: '-1',
                data:{
                    Start: "",
                    End: "",
                    Name: "",
                    Sort: "",
                    SortType: "",
                    Page: 1
                },
                tableData: [],
                total: 0,
                PageSize: 0,
                tableLoading: false
            }
        },
        methods: {
            recordData() {
                var _this = this;
                this.tableLoading = true;
                setTimeout(function(){
                    if(_this.type == '代存'){
                        agentDepositRecordApi(_this.data).then(res => {
                            _this.tableLoading = false;
                            _this.total = res.data.message.Total;
                            _this.PageSize = res.data.message.PageSize;
                            _this.tableData = res.data.message.Data
                        }).catch(err => {
                            _this.tableLoading = false
                        })
                    }else{
                        aagentBonusRecordApi(_this.data).then(res => {
                            _this.tableLoading = false;
                            _this.total = res.data.message.Total;
                            _this.PageSize = res.data.message.PageSize;
                            _this.tableData = res.data.message.Data
                        }).catch(err => {
                            _this.tableLoading = false
                        })
                    }
                },100)
            },
            // 排序
            changeSort (val) {
                // 顺序还是倒序
                if(val.order == "descending"){
                    this.data.SortType = 'desc'
                }else{
                    this.data.SortType = 'asc'
                }
                this.data.Sort = "money";
                // 默认第一页
                this.data.Page = 1;

                this.recordData()
            },
            // 选择时间
            tabChange: function (tab, event) {
                this.date = selectTime(tab)

                if(this.data.Name != ""){
                    this.data.Start = this.date[0];
                    this.data.End = this.date[1];
                    this.recordData()
                }
            },
            // 查询
            query: function () {
                this.data.Start = this.date[0];
                this.data.End = this.date[1];
                this.recordData()
            },
            // 重置
            reset () {
                this.date = [];
                this.data.Start = "";
                this.data.End = "";
                this.data.Name = "";
            },
            // 分页
            handleCurrentChange(val) {
                this.data.Page = val;
                this.recordData()
            },
        },
        mounted () {
            this.recordData()
        },
        watch:{
            $route(to,form) {
                this.date = [];
                this.data.Start = "";
                this.data.End = "";
                this.data.Name = "";
                this.data.Sort = "";
                this.data.SortType = "";
                this.data.Page = 1;
                this.tabPosition = '-1';
                this.recordData();
            }
        },
    }
</script>