<template>
    <div class="memberManage">
        <h4 class="title" v-if="$route.query.id">
            <el-page-header @back="$router.go(-1)" content="会员管理"></el-page-header>
        </h4>
        <h4 class="title" v-else>会员管理</h4>
        <el-row :gutter="10">
            <el-form>
                <el-form-item>
                    <el-col :span="6">
                        <el-input v-model="Name" placeholder="会员账号"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="Mobile" placeholder="手机号" maxlength="11"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="level_id" placeholder="玩家层级">
                            <el-option label="所有等级" value=""></el-option>
                            <el-option label="倔强铜" value="1"></el-option>
                            <el-option label="无畏银V1" value="2"></el-option>
                            <el-option label="无畏银V2" value="3"></el-option>
                            <el-option label="热血金V1" value="4"></el-option>
                            <el-option label="热血金V2" value="5"></el-option>
                            <el-option label="宝藏铂V1" value="6"></el-option>
                            <el-option label="宝藏铂V2" value="7"></el-option>
                            <el-option label="锦鲤钻V1" value="8"></el-option>
                            <el-option label="锦鲤钻V2" value="9"></el-option>
                            <el-option label="皇帝冠V1" value="10"></el-option>
                            <el-option label="皇帝冠V2" value="11"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="status" placeholder="状态" style="width: 88%">
                            <el-option label="请选择玩家状态" value=""></el-option>
                            <el-option label="静止户" value="11"></el-option>
                            <el-option label="正常户" value="1"></el-option>
                            <el-option label="停权户" value="0"></el-option>
                            <el-option label="密码锁定" value="5"></el-option>
                            <el-option label="内部试玩" value="6"></el-option>
                            <el-option label="沉默户" value="99"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="8">
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
                    <el-col :span="8" class="form_button">
                        <el-button class="primary-button" round @click="hanldQuery">查询</el-button>
                        <el-button plain round @click="hanldReset">重置</el-button>
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
                        prop="name"
                        label="账号"
                        width="98">
                    </el-table-column>
                    <el-table-column
                        prop="account"
                        label="姓名"
                        width="54">
                    </el-table-column>
                    <el-table-column
                        prop="mobile"
                        label="手机号"
                        width="108">
                    </el-table-column>
                    <el-table-column
                        v-if="agentLevel != 3"
                        prop="agent"
                        label="代理">
                    </el-table-column>
                    <el-table-column
                        prop="level_name"
                        label="等级"
                        width="64">
                    </el-table-column>
                    <el-table-column
                        label="存款"
                        width="70">
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip class="item" effect="dark" placement="top">
                                    <div slot="content" style="line-height: 18px;">最后一次存款<br />时间：{{ scope.row.last_dpt.created_at }}<br />金额：{{ scope.row.last_dpt.amount }}</div>
                                    <span style="cursor: pointer;" class="red">{{ scope.row.user_dpt_money }}</span>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="取款"
                        width="70">
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip class="item" effect="dark" placement="top">
                                    <div slot="content" style="line-height: 18px;">最后一次存款<br />时间：{{ scope.row.last_wtd.created_at }}<br />金额：{{ scope.row.last_wtd.amount }}</div>
                                    <span style="cursor: pointer;" class="green">{{ scope.row.wtd_money }}</span>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="ins_win"
                        label="总输赢"
                        width="96">
                        <template slot-scope="scope">
                            <span :class="{ red: scope.row.ins_win < 0, green: scope.row.ins_win > 0}">{{ scope.row.ins_win }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        width="90"
                        :render-header="statusHeader">
                            <template slot-scope="scope" >
                                <span 
                                    :class="{ red: scope.row.status_name == '停权户' || scope.row.status_name == '密码锁定', yellow: scope.row.status_name == '试玩'|| scope.row.status_name == '内部试玩', grey: scope.row.status_name == '注销', green: scope.row.status_name == '正常户' }">
                                    {{ scope.row.status_name }}
                                </span>
                            </template>
                    </el-table-column>
                    <el-table-column
                        prop="addTime"
                        label="注册时间"
                        width="96">
                    </el-table-column>
                    <el-table-column
                        prop="last_login_time"
                        label="最后登陆"
                        width="96">
                    </el-table-column>
                    <el-table-column
                        v-if="agentLevel == 3"
                        label="操作"
                        width="116">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="玩家代存" placement="top">
                                <i class="iconfont icon-cunkuan1" @click="operation('会员代存',scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="彩金赠送" placement="top">
                                <i class="iconfont icon-ai-profit" @click="operation('彩金赠送',scope.row)"></i>
                            </el-tooltip>
                            <br>
                            <el-tooltip class="item" effect="dark" content="游戏记录" placement="bottom">
                                <i class="el-icon-s-order" @click="$router.push('/gameRecord?name=' + scope.row.name)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="存提款记录" placement="bottom">
                                <i class="iconfont icon-qian" style="margin-top:6px" @click="$router.push('/userFund?name=' + scope.row.name)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="会员调级" placement="bottom">
                                <i class="iconfont icon-level" style="margin-top:6px" @click="operation('会员调级',scope.row)"></i>
                            </el-tooltip>
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

        <!-- 限制支付密码 -->
        <el-dialog
            title="温馨提示"
            :visible.sync="showPay"
            :show-close=false
            width="35%"
            center
            :close-on-click-modal=false
            class="reminder">
            <p>为了您的资金安全，请先设置支付密码</p>
            <span slot="footer" class="dialog-footer">
                <el-button round plain class="btn_bor_primary" @click="showPay = false;">取 消</el-button>
                <el-button type="primary" round @click="showPay = false; $router.push('/information')">去设置</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { MemberListApi,CheckChangeLeveApi } from '../../http/api.js'
    import { timeTab, selectTime } from '../../assets/js/utils'
    export default {
        data() {
            var myDate = new Date();
            return {
                agentLevel: localStorage.getItem('level_id'),
                tableLoading: true,
                date: [],
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < (myDate.getTime() - 24*60*60*1000*31*3) || time.getTime() >= (Date.now())
                    }
                },
                timeTab: timeTab(),
                tabPosition: '-1',
                Start: '',
                End: '',
                Mobile: "",
                Name: "",
                level_id: "",
                status: "",
                Sort: "",
                SortType: "",
                //  表格
                tableData: [],
                page: 1,
                total: 0,
                pagesize: 0,
                // 限制支付密码
                showPay: false
            }
        },   
        methods: {
            // 初始化
            MemberListData () {
                var _this = this;
                var data = {
                    Mobile: this.Mobile,
                    Start: this.Start,
                    End: this.End,
                    Name: this.Name,
                    Page: this.page,
                    Sort: this.Sort,
                    SortType: this.SortType,
                    level_id: this.level_id,
                    status: this.status
                };
                if(this.$route.query.id){
                    data['Agent_id'] = this.$route.query.id;
                    data.Start = this.$route.query.Start;
                    data.End = this.$route.query.End;
                    this.date = [data.Start, data.End]
                }
                this.tableLoading = true;
                MemberListApi(data).then(res => {
                    _this.tableLoading = false;
                    _this.tableData = res.data.message.Data;
                    _this.total = res.data.message.Total;
                    _this.pagesize = res.data.message.Pagesize
                }).catch(err => {
                    _this.tableLoading = false
                })
            },
            // 选择时间
            tabChange: function (tab, event) {
                this.date = selectTime(tab)
                
                if(this.Name != ""){
                    this.Start = this.date[0];
                    this.End = this.date[1];
                    this.MemberListData()
                }
            },
            // 查询
            hanldQuery: function () {
                this.page = 1;
                this.Start = this.date[0];
                this.End = this.date[1];
                this.MemberListData()
            },
            // 重置
            hanldReset: function () {
                this.Name = "";
                this.Mobile = "";
                var myDate = new Date();
                this.date = [myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-01", myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()];
                this.Start = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-01";
                this.End = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
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
            // 操作
            operation (type, row) {
                var _this = this;
                if(row.account){
                    if(type == '会员代存'){
                        if(localStorage.getItem('has_pay_pwd') == 'true'){
                            this.$router.push('/agentDeposit?name=' + row.name)
                        }else{
                            this.showPay = true
                        }
                    }
                    if(type == "彩金赠送"){
                        this.$router.push('/agentBonus?name=' + row.name)
                    }
                    if(type == '会员调级'){
                        if(row.status_name == '静止户'){
                            this.$alert('请完善好身份证与银行卡资料，需要正常户方可申请', '提示');
                        }else{
                            var data = {
                                Name: row.name
                            };
                            this.tableLoading = true
                            CheckChangeLeveApi(data).then(res => {
                                _this.tableLoading = false;
                                _this.$router.push('/changeLeve?name=' + row.name)
                            }).catch(err => {
                                _this.tableLoading = false;
                                _this.$alert(err.message, '提示');
                            })
                        }
                    }
                }else{
                    this.$alert('该会员资料未完善，需要正常户才能操作', '提示');
                }
            },
            // 分页
            handleCurrentChange(val) {
                this.page = val;
                this.MemberListData()
            }
        },
        mounted() {
            this.MemberListData()
        },
    }
</script>

<style scoped>
    @import url(../../assets/css/management.css);
</style>