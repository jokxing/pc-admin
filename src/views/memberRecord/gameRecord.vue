<template>
    <div class="gameRecord">
        <h3 class="title">游戏记录</h3>

        <el-row :gutter="6" class="head">
            <el-form>
                <el-form-item style="margin-bottom: 10px">
                    <el-col :span="7">
                        <el-input placeholder="会员账号" v-model="data.Name"></el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-select placeholder="请选择游戏平台" v-model="data.Plat">
                            <el-option v-for="(item, index) in game" :key="index" :label="item.text" :value="item.Plat"></el-option>
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
                            end-placeholder="结束日期"
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
                    label="比赛类型"
                    width="120">
                    <template slot-scope="scope">
                        <span class="match_type primary-color" @click="matchTypeClick(scope.row)">{{ scope.row.game }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="注单笔数"
                    prop="number"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="投注金额"
                    prop="beat_money"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="会员"
                    align="center">
                    <el-table-column 
                        label="返水"
                        prop="back_flow_money" 
                        width="100" 
                        align="center">
                    </el-table-column>
                    <el-table-column 
                        label="结果" 
                        prop="payout" 
                        align="center">
                            <template slot-scope="scope">
                                <span :class="{ 'red': scope.row.payout < 0, 'green': scope.row.payout > 0 }">
                                    {{ scope.row.payout }}
                                </span>
                            </template>
                        </el-table-column>
                </el-table-column>
                <el-table-column
                    label="有效投注"
                    prop="valid_betamt"
                    width="150">
                </el-table-column>
            </el-table>
        </el-row>
    </div>
</template>

<script>
    import gameArr from '../../assets/js/gameArr.js';
    import { timeTab, selectTime } from '../../assets/js/utils';
    import { GameReportApi } from '../../http/api.js'
    export default {
        data() {
            var myDate = new Date();
            return {
                // 查询
                date: [myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-01", myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()],
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < (myDate.getTime() - 24*60*60*1000*31*3) || time.getTime() >= (Date.now())
                    }
                },
                data: {
                    Start: myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-01",
                    End: myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate(),
                    Name: "",
                    Plat: "",
                    version: 2
                },
                game: gameArr.game,
                timeTab: timeTab(),
                tabPosition: '-1',
                // 表格
                tableData:[],
                tableLoading: false
            }
        },   
        methods: {
            // 游戏列表接口
            gameReportData() {
                var _this = this;
                this.tableLoading = true;
                GameReportApi(_this.data).then(res => {
                    _this.tableLoading = false;
                    _this.tableData = res.data.message;
                }).catch(err => {
                    _this.tableLoading = false;
                    _this.$message.error(err.message)
                })
            },
            // 选择时间
            tabChange: function (tab, event) {
                this.date = selectTime(tab)

                if(this.data.Name != ""){
                    this.data.Start = this.date[0];
                    this.data.End = this.date[1];
                    this.gameReportData()
                }
            },
            // 查询
            query: function () {
                var date1 = new Date(this.date[0]).getTime();
                var date2 = new Date(this.date[1]).getTime();
                var dates = date2 - date1;
                var days = dates / (24*60*60*1000)

                this.data.Start = this.date[0];
                this.data.End = this.date[1];
                if(this.data.Name == ''){
                    this.$message.error('请输入字母或数字,长度6-10位的会员账号')
                }else{
                    this.gameReportData()
                }
            },
            // 重置
            reset () {
                var myDate = new Date();
                this.date = [myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-01", myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()];
                this.data.Start = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-01";
                this.data.End = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
                this.data.Name = "";
                this.data.Plat = "";
                this.tabPosition = "-1"
            },
            // 比赛类型进去详情页面
            matchTypeClick: function (val) {
                var data = {
                    Plat: val.gamePlat,
                    Start: this.data.Start,
                    End: this.data.End,
                    Name: this.data.Name,
                    game: val.game
                };
                this.$cookies.set("gameArr", data);
                this.$router.push('/gameRecord/memberBetDetails');
            },
        },
        mounted() {
            if(this.$route.query.name){
                this.data.Name = this.$route.query.name;
                this.gameReportData()
            }
            if(this.$route.params.Name){
                this.data.Name = this.$route.params.Name;
                this.data.Start = this.$route.params.Start;
                this.data.End = this.$route.params.End;
                this.date = [this.$route.params.Start, this.$route.params.End]
                this.gameReportData()
            }
            if(this.$route.query.Start && this.$route.query.End){
                this.data.Start = this.$route.query.Start;
                this.data.End = this.$route.query.End;
                this.date = [this.$route.query.Start, this.$route.query.End]
            }
        },
    }
</script>

<style scoped>
    @import url(../../assets/css/memberRecord.css);
</style>