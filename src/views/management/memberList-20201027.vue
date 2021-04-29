<template>
    <div class="memberManage">
        <h4 class="title">会员管理</h4>
        <el-row :gutter="10">
            <el-form>
                <el-form-item>
                    <el-col :span="6">
                        <el-input v-model="Name" placeholder="会员账号"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="level_id" placeholder="玩家层级">
                            <el-option label="所有等级" value=""></el-option>
                            <el-option label="青铜" value="1"></el-option>
                            <el-option label="白银V1" value="2"></el-option>
                            <el-option label="白银V2" value="3"></el-option>
                            <el-option label="黄金V1" value="4"></el-option>
                            <el-option label="黄金V2" value="5"></el-option>
                            <el-option label="铂金V1" value="6"></el-option>
                            <el-option label="铂金V2" value="7"></el-option>
                            <el-option label="钻石V1" value="8"></el-option>
                            <el-option label="钻石V2" value="9"></el-option>
                            <el-option label="星耀V1" value="10"></el-option>
                            <el-option label="星耀V2" value="11"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="7">
                        <el-select v-model="status" placeholder="状态" style="width: 88%">
                            <el-option label="请选择玩家状态" value=""></el-option>
                            <el-option label="静止户" value="11"></el-option>
                            <el-option label="正常户" value="1"></el-option>
                            <el-option label="停权户" value="0"></el-option>
                            <el-option label="密码锁定" value="5"></el-option>
                            <el-option label="内部试玩" value="6"></el-option>
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
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="8">
                         <el-radio-group v-model="tabPosition" @change="tabChange">
                            <el-radio-button label="1">今日</el-radio-button>
                            <el-radio-button label="2">昨日</el-radio-button>
                            <el-radio-button label="3">7天</el-radio-button>
                            <el-radio-button label="4">30天</el-radio-button>
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
                v-loading="tableLoading"
                @sort-change="changeSort">
                    <el-table-column
                        prop="name"
                        label="账号"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="account"
                        label="姓名"
                        width="65">
                    </el-table-column>
                    <el-table-column
                        prop="level_name"
                        label="等级"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="user_dpt_money"
                        label="存款"
                        sortable='custom'
                        width="76">
                    </el-table-column>
                    <el-table-column
                        prop="wtd_money"
                        label="取款"
                        sortable='custom'
                        width="76">
                    </el-table-column>
                    <el-table-column
                        prop="ins_win"
                        label="总输赢"
                        width="90">
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
                        label="注册时间/ip"
                        sortable='custom'
                        width="128">
                            <template slot-scope="scope">
                                {{ scope.row.addTime }} / {{ scope.row.addIp }}
                            </template>
                    </el-table-column>
                    <el-table-column
                        prop="last_login_time"
                        label="最后登陆/ip"
                        sortable='custom'
                        width="128">
                            <template slot-scope="scope">
                                {{ scope.row.last_login_time }} / {{ scope.row.last_login_ip }}
                            </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="120">
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
    </div>
</template>

<script>
    import { MemberListApi,CheckChangeLeveApi } from '../../http/api.js'
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
                tabPosition: '-1',
                Start: '',
                End: '',
                Name: "",
                level_id: "",
                status: "",
                Sort: "",
                SortType: "",
                //  表格
                tableData: [],
                page: 1,
                total: 0,
                pagesize: 0
            }
        },   
        methods: {
            // 初始化
            MemberListData () {
                var _this = this;
                var data = {
                    Start: this.Start,
                    End: this.End,
                    Name: this.Name,
                    Page: this.page,
                    Sort: this.Sort,
                    SortType: this.SortType,
                    level_id: this.level_id,
                    status: this.status
                };
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
                var myDate = new Date();
                if(tab == 1){
                    this.date = [this.getDate(myDate.getTime()), this.getDate(myDate.getTime())]
                }else if(tab == 2){
                    var yesterday = myDate.getTime() - 24*60*60*1000;
                    this.date = [this.getDate(yesterday), this.getDate(yesterday)]
                }else if(tab == 3){
                    var seven = myDate.getTime() - 24*60*60*1000*7;
                    this.date = [this.getDate(seven), this.getDate(myDate.getTime())]
                }else{
                    var thirty = myDate.getTime() - 24*60*60*1000*30;
                    this.date = [this.getDate(thirty), this.getDate(myDate.getTime())]
                }

                if(this.Name != ""){
                    this.Start = this.date[0];
                    this.End = this.date[1];
                    this.MemberListData()
                }
            },
            // 计算时间戳
            getDate: function (time) {
                var myDate = new Date(time);
                var year = myDate.getFullYear();
                var month = myDate.getMonth() + 1;
                var day = myDate.getDate();
                return year + "-" + month + "-" + day;
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
                        this.$router.push('/agentDeposit?name=' + row.name)
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
            // 排序
            changeSort (val) {
                // 获取排序的参数
                if(val.prop == "wtd_money"){
                    this.Sort = 'wtd'
                }else if(val.prop == "user_dpt_money"){
                    this.Sort = 'dpt'
                }else if (val.prop == 'addTime'){
                    this.Sort = 'created_at'
                }else{
                    this.Sort = 'login_at'
                }
                // 顺序还是倒序
                if(val.order == "descending"){
                    this.SortType = 'Desc'
                }else{
                    this.SortType = 'Asc'
                }
                // 默认第一页
                this.page = 1;

                this.MemberListData()
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