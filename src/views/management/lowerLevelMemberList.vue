<template>
    <div class="memberManage">
        <el-page-header @back="$router.go(-1)" content="会员管理"></el-page-header>

        <!-- 表格 -->
        <el-row>
            <el-table
                :data="tableData"
                style="width: 100%"
                v-loading="tableLoading">
                    <el-table-column
                        prop="user"
                        label="会员"
                        width="110">
                    </el-table-column>
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
                        prop="ins_win_money"
                        label="会员输赢"
                        width="90">
                        <template slot-scope="scope">
                            <span :class="{ red: scope.row.ins_win_money < 0, green: scope.row.ins_win_money > 0}">{{ scope.row.ins_win_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="bonus_money"
                        label="红利"
                        width="90">
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
                        width="90">
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
                        label="（汇/取）手续费"
                        width="140">
                    </el-table-column>
                    <el-table-column
                        prop="dpt_bonus_money"
                        label="存款优惠"
                        width="90">
                    </el-table-column>
                    <el-table-column
                        prop="game_fee"
                        label="平台费"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="dpt_money"
                        label="存款数额"
                        width="90">
                    </el-table-column>
                    <el-table-column
                        prop="wtd_money"
                        label="提款数额"
                        width="90">
                    </el-table-column>
                    <el-table-column
                        prop="transfer"
                        label="会员转账"
                        width="90">
                    </el-table-column>
                    <el-table-column
                        prop="real_win_lost"
                        label="代理输赢"
                        width="100">
                        <template slot-scope="scope">
                            <span :class="{ red: scope.row.real_win_lost < 0, green: scope.row.real_win_lost > 0}">{{ scope.row.real_win_lost }}</span>
                        </template>
                    </el-table-column>
            </el-table>
        </el-row>

        <!-- 分页 -->
        <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page.sync="page" 
            :total="total"
            :page-size="pagesize"
            :hide-on-single-page="true">
        </el-pagination>
    </div>
</template>

<script>
    import { AgentMemberListApi } from '../../http/api.js'
    export default {
        data() {
            return {
                agentLevel: localStorage.getItem('level_id'),
                tableLoading: true,
                Start: '',
                End: '',
                level_id: "",
                //  表格
                tableData: [],
                page: 1,
                total: 0,
                pagesize: 0,
            }
        },   
        methods: {
            // 初始化
            MemberListData () {
                var _this = this;
                var data = {
                    Agent_id: this.$route.query.id,
                    Start: this.Start,
                    End: this.End,
                    page: this.page,
                };
                
                this.tableLoading = true;
                AgentMemberListApi(data).then(res => {
                    _this.tableLoading = false;
                    _this.tableData = res.data.message.data;
                    
                    var sum = res.data.message.sum;
                    sum['user'] = '小计'
                    _this.tableData.push(sum)

                    _this.total = res.data.message.total;
                    _this.pagesize = res.data.message.per_page;
                }).catch(err => {
                    _this.tableLoading = false
                })
            },
            // 表头-状态
            statusHeader (h,{column}) {
                const inReview1 = '静止户-只是注册，未完善好手机，银行卡和身份证资料。'
                const inReview2 = '正常户-手机，银行卡，身份证资料已完善好。'
                const inReview3 = '注销-该客户达到一定条件，要求注销自己账号。'
                const inReview4 = '停权户-涉及会员风控，对会员进行停权，登陆不上平台。'
                const inReview5 = '密码锁定-连续5次输错密码，系统进行锁定。'
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
                                    'width':'310px',
                                    whiteSpace: 'normal',
                                    'margin-bottom': '10px'
                                }
                            }, inReview1),
                            h('div', {
                                slot: 'content',
                                style: {
                                    'width':'310px',
                                    whiteSpace: 'normal',
                                    'margin-bottom': '10px'
                                }
                            }, inReview2),
                            h('div', {
                                slot: 'content',
                                style: {
                                    'width':'310px',
                                    whiteSpace: 'normal',
                                    'margin-bottom': '10px'
                                }
                            }, inReview3),
                            h('div', {
                                slot: 'content',
                                style: {
                                    'width':'310px',
                                    whiteSpace: 'normal',
                                    'margin-bottom': '10px'
                                }
                            }, inReview4),
                            h('div', {
                                slot: 'content',
                                style: {
                                    'width':'310px',
                                    whiteSpace: 'normal',
                                    'margin-bottom': '10px'
                                }
                            }, inReview5),
                            h('i', {
                                class: 'el-icon-info',
                                style: 'margin-left:5px;vertical-align: middle;color: #d5d5d5'
                            })
                        ],)
                    ]
        　　　　 )
            },  
            // 分页
            handleCurrentChange(val) {
                this.page = val;
                this.MemberListData()
            }
        },
        mounted() {
            if(this.$route.query.id){
                this.Start = this.$route.query.Start;
                this.End = this.$route.query.End;
                this.date = [this.Start, this.End]
            }
            this.MemberListData()
        },
    }
</script>

<style scoped>
    @import url(../../assets/css/management.css);
</style>