<template>
    <el-row :gutter="24" class="memberLineApply_top" style="margin:0">
        <el-col :span="8" style="padding-left: 0">
            <div class="memberLineApply_top_list">
                <p>本月{{ name }}</p>
                <i class="el-icon-loading" v-show="loading"></i>
                <h4 v-show="!loading">{{ data.MonthCount }}</h4>
            </div>
        </el-col>
        <el-col :span="8">
            <div class="memberLineApply_top_list">
                <p>{{ name }}记录</p>
                <i class="el-icon-loading" v-show="loading"></i>
                <h4 v-show="!loading">{{ data.TotalCount }}</h4>
                <el-button plain round size="small" class="btn_bor_primary" @click="viewDetails">查看详情</el-button>
            </div>
        </el-col>
        <el-col :span="8" style="padding-right: 0">
            <div class="memberLineApply_top_list">
                <p>{{ name }}率</p>
                <i class="el-icon-loading" v-show="loading"></i>
                <h4 v-show="!loading">{{ data.Rate }}</h4>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    import { MonthChangeLineRecordApi,MonthChangeLeveRecordApi } from '../../http/api.js'
    export default {
        data() {
            return {
                loading: true,
                name: "",
                data: ""
            }
        },
        methods: {
            changeData () {
                var _this = this;
                if(this.$router.history.current.path == '/changeLine'){
                    MonthChangeLineRecordApi().then(res => {
                        _this.loading = false;
                        _this.data = res.data.message
                    }).catch(err => {
                        _this.loading = false;
                    })
                }else{
                    MonthChangeLeveRecordApi().then(res => {
                        _this.loading = false;
                        _this.data = res.data.message
                    }).catch(err => {
                        _this.loading = false;
                    })
                }
            },
            viewDetails() {
                if(this.$router.history.current.path == '/changeLine'){
                    this.$router.push('/changeLine/changeLineLogsList')
                }else{
                    this.$router.push('/changeLeve/transformRecord')
                }
            }
        },
        mounted() {
            if(this.$router.history.current.path == '/changeLine'){
                this.name = "转线"
            }else{
                this.name = "调级"
            };

            this.changeData()
        },
    }
</script>