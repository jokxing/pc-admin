<template>
    <div class="changeLineLogs_list">
        <el-page-header @back="$router.go(-1)" content="调级记录"></el-page-header>

        <el-row :gutter="10">
            <el-form :model="ruleForm" ref="ruleForm">
                <el-form-item>
                    <el-col :span="7">
                        <el-input placeholder="会员账号" v-model="ruleForm.Name"></el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-select placeholder="全部" v-model="ruleForm.Status">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="审核中" value="0"></el-option>
                            <el-option label="成功" value="1"></el-option>
                            <el-option label="拒绝" value="2"></el-option>
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
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
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
                        <el-button class="primary-button" round @click="hanldQuery">查询</el-button>
                        <el-button plain round @click="hanldReset('ruleForm')">重置</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-row>

        <el-row>
            <el-table
                :data="tableData"
                style="width:100%"
                v-loading="tableLoading">
                    <el-table-column
                        prop="created_at"
                        label="提交时间"
                        width="150">
                    </el-table-column>    
                    <el-table-column
                        prop="post_member_name"
                        label="用户名">
                    </el-table-column>    
                    <el-table-column
                        prop="register_at"
                        label="注册时间"
                        width="150">
                    </el-table-column>    
                    <el-table-column
                        prop="before_level_id"
                        label="原级别">
                    </el-table-column>    
                    <el-table-column
                        prop="new_level_id"
                        label="调后级别">
                    </el-table-column>    
                    <el-table-column
                        label="状态">
                            <template slot-scope="scope">
                                <span class="yellow" v-if="scope.row.status == 0">待审核</span>
                                <span class="green" v-if="scope.row.status == 1">成功</span>
                                <span class="red" v-if="scope.row.status == 2">拒绝</span>
                            </template>
                    </el-table-column>   
                    <el-table-column
                        prop="verify_remark"
                        label="审核备注">
                    </el-table-column>   
            </el-table>
        </el-row>

        <!-- 分页 -->
        <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page.sync="ruleForm.Page" 
            :total="total"
            :page-size="pagesize"
            :hide-on-single-page="true">
        </el-pagination>
    </div>
</template>

<script>
    import { ChangeLevelLogsListApi } from '../../http/api.js';
    import { timeTab, selectTime } from '../../assets/js/utils'
    export default {
        data() {
            var myDate = new Date();
            return {
                tableLoading: true,
                date: [],
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < (myDate.getTime() - 24*60*60*1000*31*3) || time.getTime() >= (Date.now())
                    }
                },
                timeTab: timeTab(),
                tabPosition: '-1',
                ruleForm: {
                    Name: '',
                    Status: "",
                    Page: 1,
                    Start: "",
                    End: "",
                },
                tableData: [],
                total: 0,
                pagesize: 0
            }
        },
        methods: {
            changeLineLogsListData () {
                var _this = this;
                this.tableLoading = true;
                ChangeLevelLogsListApi(_this.ruleForm).then(res => {
                    _this.tableLoading = false;
                    _this.tableData = res.data.message.Data;
                    _this.total = res.data.message.Total;
                    _this.pagesize = res.data.message.Pagesize;
                }).catch(err => {
                    _this.tableLoading = false
                })
            },
            // 选择时间
            tabChange: function (tab, event) {
                this.date = selectTime(tab)

                if(this.ruleForm.Name != ""){
                    this.ruleForm.Start = this.date[0];
                    this.ruleForm.End = this.date[1];
                    this.changeLineLogsListData()
                }
            },
            // 查询
            hanldQuery () {
                this.ruleForm.Start = this.date[0];
                this.ruleForm.End = this.date[1];
                this.changeLineLogsListData()
            },
            // 重置
            hanldReset (formName) {
                this.ruleForm.Name = "";
                this.ruleForm.Status ="";
                var myDate = new Date();
                this.date = []
            },
            // 分页
            handleCurrentChange(val) {
                this.ruleForm.Page = val;
                this.changeLineLogsListData()
            }
        },
        mounted () {
            this.changeLineLogsListData();
        }
    }
</script>

<style scoped>
    @import url(../../assets/css/management.css);
</style>