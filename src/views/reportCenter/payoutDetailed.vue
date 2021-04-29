<template>
    <div class="payout_report">
        <el-page-header @back="$router.go(-1);" content="输赢详细"></el-page-header>

        <!-- 表格 -->
        <el-row>
            <el-table
                :data="tableData"
                border
                style="width: 100%"
                v-loading="showLoading">
                <el-table-column
                    type="index"
                    label="序号"
                    width="60">
                </el-table-column>
                <el-table-column
                    prop="user.name"
                    label="会员账号"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="beat_num"
                    label="注单笔数"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="beat_money"
                    label="投注金额"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="valid_betamt"
                    label="有效投注"
                    width="120">
                </el-table-column>
                <el-table-column
                    label="投注盈亏"
                    width="120">
                    <template slot-scope="scope">
                        <span :class="{ 'green': scope.row.ins_win_money > 0, 'red': scope.row.ins_win_money < 0 }">
                            {{ scope.row.ins_win_money }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="bonus_money"
                    label="红利"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="agent_bonus"
                    label="代理彩金"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop="user_agent"
                    label="邀请有奖"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop="uservip_system"
                    label="VIP系统"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="bonus_system"
                    label="彩金系统"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop="water_money"
                    label="返水"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop="fee"
                    label="（提/取）手续费"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="dpt_bonus_money"
                    label="存款优惠"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="game_fee"
                    label="平台费"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="dpt_money"
                    label="存款数"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="wtd_money"
                    label="提款数"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="transfer"
                    label="会员转账"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop="real_win_lost"
                    label="实际盈亏"
                    width="100">
                        <template slot-scope="scope">
                            <span :class="{ 'green': scope.row.real_win_lost > 0, 'red': scope.row.real_win_lost < 0 }">
                                {{ scope.row.real_win_lost }}
                            </span>
                        </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :current-page.sync="Page" 
                :total="total"
                :page-size="PageSize"
                :hide-on-single-page="true">
            </el-pagination>
        </el-row>
    </div>
</template>

<script>
    import { companyReportDetailApi } from '../../http/api'
    export default {
        data() {
            return {
                showLoading: true,
                tableData: [],
                // 分页
                Page: 1,
                PageSize: 0,
                total: 0
            }
        },
        methods: {
            companyReportDetail() {
                var _this = this;
                var data = {
                    Start: this.$route.query.Start,
                    End: this.$route.query.End,
                    Page: this.Page
                }
                this.showLoading = true;
                companyReportDetailApi(data).then(res => {
                    _this.showLoading = false;
                    _this.tableData = res.data.message.data;
                    _this.total = res.data.message.total;
                    _this.PageSize = res.data.message.per_page
                }).catch(err => {
                    _this.showLoading = false
                })
            },
            // 分页
            handleCurrentChange(val) {
                this.Page = val;
                this.companyReportDetail()
            },
        },
        mounted () {
            this.companyReportDetail()
        }
    }
</script>