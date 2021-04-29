<template>
    <div class="memberBetDetails">
        <el-page-header @back="back" content="会员投注详情"></el-page-header>

        <!-- 表格 -->
        <el-row
            <el-table
                v-if="game.indexOf('体育') != -1"
                :data="tableData"
                v-loading="tableLoading"
                style="width: 100%">
                <el-table-column
                    prop=""
                    label="下注时间 派彩时间"
                    width="86">
                        <template slot-scope="scope">
                            <p>{{ scope.row.time }}</p>
                            <p class="red">{{ scope.row.beat_content.check.settleTime }}</p>
                        </template>
                </el-table-column>
                <el-table-column
                    prop=""
                    label="单号/备注"
                    width="150">
                        <template slot-scope="scope">
                            <p>{{ scope.row.beat_content.check.content }}</p>
                            <p>{{ scope.row.fundsn }}</p>
                            <p>{{ scope.row.beat_content.check.ipAddress }}</p>
                            <p v-if="isCountry">
                                <span v-if="scope.row.country">{{ scope.row.country }} {{ scope.row.regionName }} {{ scope.row.city }} </span>
                                <span class="grey" v-if="scope.row.isp">{{ scope.row.isp }}</span>
                            </p>
                            <p v-else>
                                <i class="el-icon-loading" v-if="scope.row.beat_content.check.ipAddress"></i>
                            </p>
                            <p>{{ scope.row.beat_content.check.channel }}</p>
                        </template>
                </el-table-column>
                <el-table-column
                    prop="beat_content.check.startTime"
                    label="比赛时间"
                    width="86">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="玩法"
                    width="80">
                        <template slot-scope="scope">
                            <p v-if="scope.row.beat_content.check.group">{{ scope.row.beat_content.check.group }}</p>
                            <p class="red" v-if="scope.row.beat_content.check.period && scope.row.beat_content.check.betType">{{ scope.row.beat_content.check.period }} - {{ scope.row.beat_content.check.betType }}</p>
                            <p class="red" v-if="scope.row.beat_content.check.TeamScore">{{ scope.row.beat_content.check.TeamScore }}</p>
                            <p class="red" v-if="scope.row.beat_content.check._TeamScore">{{ scope.row.beat_content.check._TeamScore }}</p>
                        </template>
                </el-table-column>
                <el-table-column
                    prop=""
                    label="下注内容">
                        <template slot-scope="scope">
                            <p v-for="(item,index) in scope.row.beat_content.show.split('|')" :key="index" style="text-align:left">{{ item }}</p>
                        </template>
                </el-table-column>
                <el-table-column
                    prop="beat_money"
                    label="投注金额"
                    width="54">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="会员">
                        <el-table-column
                            prop="back_flow_money"
                            label="返水"
                            width="54">
                        </el-table-column>
                        <el-table-column
                            label="结果"
                            width="54">
                                <template slot-scope="scope">
                                    <div :class="{ 'red': scope.row.payout < 0, 'green': scope.row.payout > 0 }">
                                        {{ scope.row.payout }}
                                    </div>
                                </template>
                        </el-table-column>
                </el-table-column>
                <el-table-column
                    prop="valid_betamt"
                    label="有效投注"
                    width="54">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="状态"
                    width="58">
                        <template>
                            <div class="green">
                                已派彩
                            </div>
                        </template>
                </el-table-column>
            </el-table>

            <el-table
                v-else
                :data="tableData"
                v-loading="tableLoading"
                style="width: 100%">
                <el-table-column
                    prop="time"
                    label="时间"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="单号/备注"
                    width="220">
                        <template slot-scope="scope">
                            <p>{{ scope.row.beat_content.check.content }}</p>
                            <p>{{ scope.row.fundsn }}</p>
                            <p>{{ scope.row.beat_content.check.ipAddress }}</p>
                            <p v-if="isCountry">
                                <span v-if="scope.row.country">{{ scope.row.country }} {{ scope.row.regionName }} {{ scope.row.city }} </span>
                                <span class="grey" v-if="scope.row.isp">{{ scope.row.isp }}</span>
                            </p>
                            <p v-else>
                                <i class="el-icon-loading" v-if="scope.row.beat_content.check.ipAddress"></i>
                            </p>
                            <p>{{ scope.row.beat_content.check.channel }}</p>
                        </template>
                </el-table-column>
                <el-table-column
                    prop=""
                    label="下注内容">
                        <template slot-scope="scope">
                            <p v-for="(item,index) in scope.row.beat_content.show.split('|')" :key="index" style="text-align:left">{{ item }}</p>
                        </template>
                </el-table-column>
                <el-table-column
                    prop="beat_money"
                    label="投注金额"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="会员">
                        <el-table-column
                            prop="back_flow_money"
                            label="返水"
                            width="54">
                        </el-table-column>
                        <el-table-column
                            label="结果"
                            width="54">
                                <template slot-scope="scope">
                                    <div :class="{ 'red': scope.row.payout < 0, 'green': scope.row.payout > 0 }">
                                        {{ scope.row.payout }}
                                    </div>
                                </template>
                        </el-table-column>
                </el-table-column>
                <el-table-column
                    prop="valid_betamt"
                    label="有效投注"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="状态"
                    width="70">
                        <template>
                            <div class="green">
                                已派彩
                            </div>
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
    import { GameReportDetailApi } from '../../http/api.js'
    export default {
        data() {
            return {
                isCountry: false,
                tableLoading: true,
                tableData: [],
                page: 1,
                pagesize: 0,
                total: 0,
                Sort: "",
                SortType: "",
                game: ''
            }
        },   
        methods: {
            // 初始化
            GameReportDetailData() {
                var _this = this;
                this.tableLoading = true;
                var gameArr = this.$cookies.get('gameArr');
                this.game = gameArr.game;
                var data = {
                    Plat: gameArr.Plat,
                    Start: gameArr.Start,
                    End: gameArr.End,
                    Name: gameArr.Name,
                    Page: this.page,
                    Sort: this.Sort,
                    SortType: this.SortType,
                    version: 2
                }

                GameReportDetailApi(data).then(res => {
                    _this.tableLoading = false;
                    _this.tableData = res.data.message.lists;
                    var result = [];
                    var dataNum = 0;
                    _this.tableData.forEach(async (person,index) => {
                        if(person.beat_content.check.ipAddress){
                            dataNum++
                            var ipUrl = '//apidata.chinaz.com/CallAPI/ip?key=9d8158ef2f0f43869f90e76213abc630&ip=' + person.beat_content.check.ipAddress
                            const num = await _this.getIpApi(ipUrl);
                            console.log(num.data.Result.Country)
                            _this.tableData[index]['country'] = num.data.Result.Country;
                            _this.tableData[index]['regionName'] = num.data.Result.Province;
                            _this.tableData[index]['city'] = num.data.Result.City;
                            _this.tableData[index]['isp'] = num.data.Result.Isp;

                            // 方便判断长度取消定时器
                            var vote = {};
                            vote.isp = num.data.isp;
                            result.push(vote)
                        }
                    })
                    var set = setInterval(function(){
                        if(result.length == dataNum){
                            _this.isCountry = true;
                            clearInterval(set)
                        }
                    },1000)
                    _this.total = res.data.message.total;
                    _this.pagesize = res.data.message.PageSize
                }).catch(err => {
                    _this.tableLoading = false;
                })
            },
            getIpApi (url) {
                return this.$http.get(url).then()
            },
            // 排序
            sortChange (column, prop, order) {
                this.Sort = column.prop;
                if(column.order == "ascending"){
                    this.SortType = "Asc"
                }else{
                    this.SortType = "Desc"
                }
                this.GameReportDetailData()
            },
            // 返回
            back () {
                this.$router.push({
                    name: 'gameRecord',
                    params: this.$cookies.get('gameArr')
                });
                this.$cookies.remove('gameArr')
            },
            // 分页
            handleCurrentChange(val) {
                this.page = val;
                this.GameReportDetailData()
            }
        },
        // mounted() {
        //     this.GameReportDetailData()
        // },
        created () {
            this.GameReportDetailData()
        }
    }
</script>

<style scoped>
    @import url(../../assets/css/memberRecord.css);
</style>