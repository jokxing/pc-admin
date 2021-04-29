<template>
    <div class="home">
        <el-row class="home_top" :gutter="10">
            <h4 class="title">本月数据概览</h4>
            <el-col>
                <div class="bg">
                    <p class="primary-color">
                        <i class="el-icon-loading" v-show="dataLoading"></i>
                        {{ homeData.register_user }}
                    </p>
                    <span>注册会员(本月)</span>
                </div>
            </el-col>
            <el-col>
                <div class="bg">
                    <p class="primary-color">
                        <i class="el-icon-loading" v-show="dataLoading"></i>
                        {{ homeData.valid_user }}
                    </p>
                    <span>
                        有效会员(本月) 
                        <el-tooltip class="item" effect="dark" content="本月注册，存款500以上，流水2000以上" placement="bottom">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </span>
                </div>
            </el-col>
            <el-col>
                <div class="bg">
                    <p class="primary-color">
                        <i class="el-icon-loading" v-show="dataLoading"></i>
                        {{ homeData.user_num }}
                    </p>
                    <span>
                        活跃人数(本月)  
                        <el-tooltip class="item" effect="dark" content="本月登录过的玩家" placement="bottom">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </span>
                </div>
            </el-col>
            <el-col>
                <div class="bg last">
                    <p :class="{ 'primary-color' : homeData.payout >= 0, 'red': homeData.payout < 0 }">
                        <i class="el-icon-loading primary-color" v-show="dataLoading"></i>
                        {{ homeData.payout }}
                    </p>
                    <span class="primary-bg">
                        实际盈亏 
                        <el-tooltip class="item" effect="dark" content="负数代表玩家输钱，正数代表玩家赢钱" placement="bottom">
                            <i class="el-icon-info" style="color: #fff"></i>
                        </el-tooltip>
                    </span>
                </div>
            </el-col>
            <div class="commission_rate" v-if="bill_wtd">
                <el-progress type="dashboard" :percentage="homeData.rate" color="#5C7DEC" :width="190"></el-progress>
                <p>佣金比例</p>
            </div>
        </el-row>

        <el-row class="home_bot" v-loading="reporLoading">
            <h4 class="title">数据对比</h4>
            <!-- 选择日期 -->
            <div class="date">
                <el-date-picker
                    v-model="month"
                    type="month"
                    align="right"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM"
                    @change="indexReportData('isDate')"
                    placeholder="选择月">
                </el-date-picker>
            </div>
            <!-- 金额和人数Tab -->
            <div class="money_tab">
                <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content" style="line-height: 18px;">新注册存款金额：时间段内注册用户的累<br />计存款金额<br />老用户存款金额：所选时间之前注册用户,<br />在当前所选时间内存款的金额<br />首存金额：所选时间内注册用户的首次存<br />款金额<br />总存款金额：所选时间内用户的累计存款<br />金额<br />投注金额：所选时间内用户的累计投注金<br />额<br />有效投注：所选时间内用户的累计有效投<br />注金额<br />输赢：所选时间内用户的累计输赢
                    </div>
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </div>

            <!-- 数据 -->
            <div id="chartLine" style="width:100%; height:400px;"></div>

            <div class="data_tab">
                <ul>
                    <li v-for="(item, index) in dataTab" :key="index" :class="{ bor_active: dataTabNum == index }" @click="dataTabClick(item,index)">
                        <span></span>
                        {{ item }}
                    </li>
                </ul>
            </div>
        </el-row>
    </div>
</template>

<script>
    import { indexInfoApi,indexReportApi } from '../../http/api.js'
    export default {
        data() {
            var myDate = new Date();
            return {
                dataLoading: true,
                reporLoading: true,
                content: '新注册存款金额：时间段内注册用户的累计存款金额' + '\n' + '老用户存款金额：所选时间之前注册用户,在当前所选时间内存款的金额' + '\n' + '首存金额：所选时间内注册用户的首次存款金额' + '\n' + '总存款金额：所选时间内用户的累计存款金额' + '\n' + '投注金额：所选时间内用户的累计投注金额' + '\n' + '有效投注：所选时间内用户的累计有效投注金额' + '\n' + '输赢：所选时间内用户的累计输赢',
                month: myDate.getFullYear() + "-" + (myDate.getMonth() + 1),
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < (myDate.getTime() - 24*60*60*1000*31*3) || time.getTime() >= (Date.now())
                    }
                },
                option: {
                    tooltip: {
                        trigger: 'axis',
                    },
                    grid: {
                        left: 0,
                        right: 20,
                        bottom: 20,
                        top: 50,
                        containLabel: true
                    },
                    toolbox: {
                        feature: {}
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'当月',
                            type:'line',
                            color: '#5C7DEC',
                            data: [],
                        },
                        {
                            name:'上月',
                            type:'line',
                            color: "#00c01c",
                            data:[]
                        }
                    ]
                },
                dataTab: ['输赢金额','新注册人数','存提款金额','存提款人数','投注金额'],
                dataTabNum: 0,
                dataTabName: "输赢金额",
                // 首页-数据展示
                homeData: {},
                bill_wtd: false,
                // 首页-报表
                homeDeportData: '',
                homeDeport: ""
            }
        },
        methods: {
            // 数据
            indexInfoData () {
                var _this = this;
                indexInfoApi().then(res => {
                    _this.dataLoading = false;
                    _this.homeData = res.data.message;
                }).catch(err => {
                    _this.dataLoading = false;
                })
            },
            // 报表
            indexReportData (index) {
                var _this = this;
                this.reporLoading = true;
                indexReportApi(_this.month).then(res => {
                    _this.reporLoading = false;
                    _this.homeDeportData = res.data.message;
                    if(_this.dataTabNum == 0) {
                        _this.homeDeport = _this.homeDeportData.winCount
                    }else if(_this.dataTabNum == 1){
                        _this.homeDeport = _this.homeDeportData.newRegCount
                    }else if(_this.dataTabNum == 2){
                        _this.homeDeport = _this.homeDeportData.drawDepMoneyCount
                    }else if(_this.dataTabNum == 3){
                        _this.homeDeport = _this.homeDeportData.drawDepUserCount
                    }else{
                        _this.homeDeport = _this.homeDeportData.BeatCount
                    }
                }).catch(err => {
                    _this.reporLoading = false;
                })
            },
            // tab
            dataTabClick (item,index) {
                this.dataTabName = item;
                this.dataTabNum = index;
                if(index == 0) {
                    this.homeDeport = this.homeDeportData.winCount
                }else if(index == 1){
                    this.homeDeport = this.homeDeportData.newRegCount
                }else if(index == 2){
                    this.homeDeport = this.homeDeportData.drawDepMoneyCount
                }else if(index == 3){
                    this.homeDeport = this.homeDeportData.drawDepUserCount
                }else{
                    this.homeDeport = this.homeDeportData.BeatCount
                }
            }
        },
        created() {
            var myDate = new Date();
            var date = myDate.getDate();
            for(var i=1; i<=date; i++){
                this.option.xAxis.data.push(i + "日",)
            }
            this.indexReportData()
        },
        mounted() {
            var  _this = this;
            var myChart = this.$echarts.init(document.getElementById('chartLine'));
            myChart.setOption(this.option);
            
            var set = setInterval(function(){
                if(localStorage.getItem('bill_wtd')){
                    clearInterval(set);
                    _this.bill_wtd = JSON.parse(localStorage.getItem('bill_wtd'))
                }
            },200)

            this.indexInfoData()
        },
        watch: {
            homeDeport: {
                handler (newVal, oldVal) {
                    var months = this.month.split("-")
                    var nowDate = new Date();
                    var nowMonth = nowDate.getMonth() + 1;
                    if(parseFloat(months[1]) == nowMonth){
                        var date = nowDate.getDate();
                        var dateArr = []
                        for(var i=1; i<=date; i++){
                            dateArr.push(i + "日",)
                        }
                    }else{
                        var myDate = new Date(months[0],months[1],0);
                        var date = myDate.getDate();
                        var dateArr = []
                        for(var i=1; i<=date; i++){
                            dateArr.push(i + "日",)
                        }
                    }
                    if(this.homeDeport instanceof Array){
                        this.option = {
                            tooltip: {
                                trigger: 'axis',
                            },
                            grid: {
                                left: 0,
                                right: 20,
                                bottom: 20,
                                top: 50,
                                containLabel: true
                            },
                            toolbox: {
                                feature: {}
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: dateArr
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    type:'line',
                                    color: '#5C7DEC',
                                    data: this.homeDeport,
                                },
                            ]
                        }
                    }else{
                        if(this.dataTabName == '存提款金额'){
                            this.option = {
                                tooltip: {
                                    trigger: 'axis',
                                },
                                legend: {
                                    data:['取款金额','存款金额']
                                },
                                grid: {
                                    left: 0,
                                    right: 20,
                                    bottom: 20,
                                    top: 50,
                                    containLabel: true
                                },
                                toolbox: {
                                    feature: {}
                                },
                                xAxis: {
                                    type: 'category',
                                    boundaryGap: false,
                                    data: dateArr
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                series: [
                                    {
                                        name:'取款金额',
                                        type:'line',
                                        color: '#5C7DEC',
                                        data: this.homeDeport.draw,
                                    },
                                    {
                                        name:'存款金额',
                                        type:'line',
                                        color: '#00c01c',
                                        data: this.homeDeport.dpt,
                                    },
                                ]
                            }
                        }
                        if(this.dataTabName == '存提款人数'){
                            this.option = {
                                tooltip: {
                                    trigger: 'axis',
                                },
                                legend: {
                                    data:['取款人数','存款人数']
                                },
                                grid: {
                                    left: 0,
                                    right: 20,
                                    bottom: 20,
                                    top: 50,
                                    containLabel: true
                                },
                                toolbox: {
                                    feature: {}
                                },
                                xAxis: {
                                    type: 'category',
                                    boundaryGap: false,
                                    data: dateArr
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                series: [
                                    {
                                        name:'取款人数',
                                        type:'line',
                                        color: '#5C7DEC',
                                        data: this.homeDeport.draw,
                                    },
                                    {
                                        name:'存款人数',
                                        type:'line',
                                        color: '#00c01c',
                                        data: this.homeDeport.dpt,
                                    },
                                ]
                            }
                        }
                    }
                    var myChart = this.$echarts.init(document.getElementById('chartLine'));
                    myChart.clear()
                    myChart.setOption(this.option);
                },
                deep: true
            },
        },
    }
</script>

<style scoped>
    @import url(../../assets/css/home.css);
</style>