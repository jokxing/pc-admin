<template>
    <el-aside width="218px">
        <el-row class="sponsor">
            <h5>赞助商</h5>
            <img src="../assets/img/sponsor1.png">
        </el-row>
        <el-row class="list list_home" v-if="isOne > 0">
            <router-link v-for="(item, index) in listOne" :to="item.url" :key="index" v-if="item.level.indexOf(level_id) != -1">
                <i :class="item.icon"></i>
                <span>{{ item.text }}</span>
            </router-link>
        </el-row>
        <el-row class="list list_notice" v-if="isTwo > 0">
            <router-link v-for="(item, index) in listTwo" :to="item.url" :key="index" v-if="item.level.indexOf(level_id) != -1">
                <i :class="item.icon"></i>
                <span>{{ item.text }}</span>
            </router-link>
        </el-row>
        <el-row class="list list_management" v-if="isThree > 0">
            <p>管理中心</p>
            <router-link v-for="(item, index) in listThree" :to="item.url" :key="index" v-if="item.level.indexOf(level_id) != -1">
                <i :class="item.icon"></i>
                <span>{{ item.text }}</span>
            </router-link>
        </el-row>
        <el-row class="list list_memberRecord" v-if="isFour > 0">
            <p>会员记录</p>
            <router-link v-for="(item, index) in listFour" :to="item.url" :key="index" v-if="item.level.indexOf(level_id) != -1">
                <i :class="item.icon"></i>
                <span>{{ item.text }}</span>
            </router-link>
        </el-row>
        <el-row class="list list_finance" v-if="isFive > 0">
            <p>财务中心</p>
            <a 
                href="javascript:;"
                v-for="(item, index) in listFive" 
                :key="index" 
                v-if="item.level.indexOf(level_id) != -1"
                :class="{ 'router-link-active': item.url == $route.path }"
                @click="goClick(item)">
                <i :class="item.icon"></i>
                <span>{{ item.text }}</span>
            </a>
        </el-row>
        <el-row class="list list_reportCenter" v-if="isSix > 0">
            <p>报表中心</p>
            <a 
                href="javascript:;"
                v-for="(item, index) in listSix" 
                :key="index" 
                v-if="item.level.indexOf(level_id) != -1"
                :class="{ 'router-link-active': item.url == $route.path }"
                @click="goClick(item)">
                <i :class="item.icon"></i>
                <span>{{ item.text }}</span>
            </a>
        </el-row>
        <el-row class="list list_promotionZone" v-if="isSeven > 0">
            <p>推广专区</p>
            <router-link v-for="(item, index) in listSeven" :to="item.url" :key="index" v-if="item.level.indexOf(level_id) != -1">
                <i :class="item.icon"></i>
                <span>{{ item.text }}</span>
            </router-link>
        </el-row>
        <el-row class="list list_personalCenter" style="border-bottom:none" v-if="isEight > 0">
            <p>个人中心</p>
            <a 
                href="javascript:;" 
                v-for="(item, index) in listEight" 
                :key="index" v-if="item.level.indexOf(level_id) != -1" 
                :class="{ 'router-link-active': item.url == $route.path }"
                @click="goClick(item)">
                <i :class="item.icon"></i>
                <span>{{ item.text }}</span>
            </a>
        </el-row>
    </el-aside>
</template>

<script>
    export default {
        data() {
            return {
                level_id: localStorage.getItem('level_id'),
                listOne:[
                    {
                        text: "首页",
                        icon: "iconfont icon-home",
                        url: '/home',
                        level: ['1','2','3']
                    },
                ],
                listTwo:[
                    {
                        text: "公告",
                        icon: "iconfont icon-gonggao1",
                        url: '/notice',
                        level: ['1','2','3']
                    }
                ],
                listThree:[
                    {
                        text: "会员管理",
                        icon: "iconfont icon-nav_user",
                        url: '/memberList',
                        level: ['1','2','3']
                    },
                    {
                        text: "会员注销查询",
                        icon: "iconfont icon-cancel_transfer",
                        url: '/checUser',
                        level: ['3']
                    },
                    {
                        text: "会员转线申请",
                        icon: "iconfont icon-invoice_apply_line",
                        url: '/changeLine',
                        level: ['3']
                    },
                    {
                        text: "会员调级申请",
                        icon: "iconfont icon-level",
                        url: '/changeLeve',
                        level: ['3']
                    },
                    {
                        text: "下级管理",
                        icon: "iconfont icon-yonghuguanli",
                        url: '/agentSubordinate',
                        level: ['1','2']
                    },
                ],    
                listFour:[
                    {
                        text: "游戏记录",
                        icon: "iconfont icon-chart",
                        url: '/gameRecord',
                        level: ['1','2','3']
                    },
                    {
                        text: "存提款记录",
                        icon: "iconfont icon-qian",
                        url: '/userFund',
                        level: ['1','2','3']
                    },
                ], 
                listFive:[
                    {
                        text: "提现专区",
                        icon: "iconfont icon-withdrawals",
                        url: '/withdraw',
                        level: ['1','2','3']
                    },
                    {
                        text: "会员代存",
                        icon: "iconfont icon-cunkuan",
                        url: '/agentDeposit',
                        level: ['3']
                    },
                    {
                        text: "彩金赠送",
                        icon: "iconfont icon-zengxianhuoke",
                        url: '/agentBonus',
                        level: ['3']
                    },
                    {
                        text: "代存转账记录",
                        icon: "iconfont icon-weibiaoti5",
                        url: '/agentFundflow',
                        level: ['1','2']
                    },
                ], 
                listSix:[
                    {
                        text: "输赢报表",
                        icon: "iconfont icon-yejibaobiao",
                        url: '/payoutReport',
                        level: ['1','2','3']
                    },
                    {
                        text: "佣金报表",
                        icon: "iconfont icon-baobiao",
                        url: '/commissionReport',
                        level: ['1','2','3']
                    },
                    {
                        text: "会员报表",
                        icon: "iconfont icon-zhanghubaobiao",
                        url: '/userReport',
                        level: ['3']
                    },
                    {
                        text: "邀请有奖报表（会员）",
                        icon: "iconfont icon-yusuanbaobiao",
                        url: '/invitationRewardReport',
                        level: ['3']
                    },
                    {
                        text: "代理邀请报表",
                        icon: "iconfont icon-xiaoshoubaobiao",
                        url: '/InvitAgentRewardReport',
                        level: [ JSON.parse(localStorage.getItem('bill_wtd')) == true ? '3' : "" ]
                    },
                ], 
                listSeven:[
                    {
                        text: "推广网址（会员）",
                        icon: "el-icon-link",
                        url: '/agentImport',
                        level: ['3']
                    },
                    {
                        text: "推广素材",
                        icon: "el-icon-picture",
                        url: '/agentSet',
                        level: ['3']
                    },
                    {
                        text: "代理邀请推广",
                        icon: "iconfont icon-huodongtuiguang",
                        url: '/generaAgentRegImport',
                        level: [ JSON.parse(localStorage.getItem('bill_wtd')) == true ? '3' : "" ]
                    },
                ], 
                listEight:[
                    {
                        text: "个人资料",
                        icon: "iconfont icon-personal-data",
                        url: '/information',
                        level: ['1','2','3']
                    },
                    {
                        text: "联系我们",
                        icon: "iconfont icon-message",
                        url: '/contactUs',
                        level: ['1','2','3']
                    },
                    {
                        text: "VIP专享",
                        icon: "iconfont icon-VIP",
                        url: '/vipOnly',
                        level: ['1','2','3']
                    },
                    {
                        text: "帮助中心",
                        icon: "iconfont icon-lifehelp",
                        url: '/supportCenter',
                        level: ['1','2','3']
                    },
                ], 
                isOne: 0,
                isTwo: 0,
                isThree: 0,
                isFour: 0,
                isFive: 0,
                isSix: 0,
                isSeven: 0,
                isEight: 0
            }
        },
        methods: {
            goClick(item){
                var bill_wtd = JSON.parse(localStorage.getItem('bill_wtd'))
                if(item.url == '/withdraw' || item.url == '/commissionReport'){
                    if(!bill_wtd){
                        this.$alert('暂时不开放', '提示');
                    }else{
                        this.$router.push(item.url)
                    }
                }else{
                    this.$router.push(item.url)
                }
            }  
        },
        created() {
            for(var i = 0; i < this.listOne.length; i++){
                if(this.listOne[i].level.indexOf(this.level_id) != -1){
                    this.isOne++
                }
            };
            for(var i = 0; i < this.listTwo.length; i++){
                if(this.listTwo[i].level.indexOf(this.level_id) != -1){
                    this.isTwo++
                }
            };
            for(var i = 0; i < this.listThree.length; i++){
                if(this.listThree[i].level.indexOf(this.level_id) != -1){
                    this.isThree++
                }
            };
            for(var i = 0; i < this.listFour.length; i++){
                if(this.listFour[i].level.indexOf(this.level_id) != -1){
                    this.isFour++
                }
            };
            for(var i = 0; i < this.listFive.length; i++){
                if(this.listFive[i].level.indexOf(this.level_id) != -1){
                    this.isFive++
                }
            };
            for(var i = 0; i < this.listSix.length; i++){
                if(this.listSix[i].level.indexOf(this.level_id) != -1){
                    this.isSix++
                }
            };
            for(var i = 0; i < this.listSeven.length; i++){
                if(this.listSeven[i].level.indexOf(this.level_id) != -1){
                    this.isSeven++
                }
            };
            for(var i = 0; i < this.listEight.length; i++){
                if(this.listEight[i].level.indexOf(this.level_id) != -1){
                    this.isEight++
                }
            }
        },
    }
</script>

<style scoped>
    .el-aside{
        min-height: 628px;
        background-color: #fff;
        border-radius: 10px;
        float: left;
    }
    .sponsor{
        width: 100%;
        padding: 16px 9px 20px 9px;
        position: relative;
    }
    .sponsor::before{
        content: '';
        width: 200px;
        height: 1px;
        background-color: #EFEFEF;
        position: absolute;
        bottom: 0;
        left: 9px;
    }
    .sponsor h5{
        text-align: center;
        margin-bottom: 12px;
    }
    .sponsor img{
        height: 68px;
        float: left;
        margin-top: 8px;
    }

    .list{
        width: 100%;
        position: relative;
    }
    .list::before{
        content: '';
        width: 200px;
        height: 1px;
        background-color: #EFEFEF;
        position: absolute;
        bottom: 0;
        left: 9px;
    }
    .list:last-child::before{
        height: 0;
    }
    .list a{
        font-size: 14px;
        line-height: 28px;
        display: block;
        padding: 5px 20px;
    }
    .list a:last-child{
        padding-bottom: 6px;
    }
    .list a i{
        color: #B7B7B7;
        margin-right: 16px;
        font-size: 18px;
        vertical-align: unset;
    }
    .list p{
        font-size: 13px;
        color: #8E8E8E;
        padding: 14px 14px 6px 14px;
    }

    .list_home a i,
    .list_notice a i{
        color: #2BB0EB;
    }
    .list_management a i{
        color: #80AEFF;
    }
    .list_memberRecord a i{
        color: #bba7ff;
    }
    .list_finance a i{
        color:#cc9809;
    }
    .list_reportCenter a i{
        color:#6EB2B4;
    }
    .list_promotionZone a i{
        color: #856eb4;
    }
    .list_personalCenter a i{
        color: #D391D8;
    }

    .router-link-active{
        position: relative;
    }
    .router-link-active::after{
        content: '';
        width: 5px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        border-radius: 0 3px 3px 0;
    }
</style>