<template>
    <div class="chec_user" v-loading="showLoading">
        <h4 class="title">会员账号</h4>
        <el-row :gutter="10">
            <el-form>
                <el-form-item>
                    <el-col :span="6">
                        <el-input v-model="Name" placeholder="会员账号" maxlength="10"></el-input>
                    </el-col>
                     <el-col :span="8" class="form_button">
                        <el-button class="primary-button" round @click="hanldQuery">查询</el-button>
                        <el-button plain round @click="hanldReset">重置</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-row>

        <el-row class="chec_user_main">
            <p v-show="message == ''"><i class="iconfont icon-bi"></i>请输入会员账号</p>
            <i class="el-icon-success green" v-show="showSuccess"></i>
            <i class="el-icon-warning red" v-show="showError"></i>
            <h5 v-show="message != ''">
                {{ message }}
                <el-tooltip class="item" effect="dark" content="符合条件的会员，申请注销后，可以用原来的资料重新注册，挂在新的代理线下。" placement="top">
                    <i class="el-tooltip el-icon-info" v-show="showSuccess"></i>
                </el-tooltip>
            </h5>
        </el-row>

        <el-row class="remarks">
            <h4>备注说明</h4>
            <p>1：日常玩家（需符合以下所有条件缺一不可）</p>
            <p>A. 没有充值超过30天以上，包括30天</p>
            <p>B. 充值次数少于等于5次，包括5次</p>
            <p>C. 充值金额小于等于5000，包括5000</p>
            <p>D. 注册时间超过一个月</p>
            <p>E. 注销次数不能超过3次</p>
            <br>
            <p>2：沉默户三个月没有存款可以注销</p>
        </el-row>
    </div>
</template>

<script>
    import { checUserStatusApi } from '../../http/api'
    export default {
        data() {
            return {
                showLoading: false,
                Name: "",
                showSuccess: false,
                showError: false,
                message: ""
            }
        },
        methods: {
            checUserInit: function () {
                var _this = this;
                this.showLoading = true;
                var data = {
                    Name: this.Name
                }
                checUserStatusApi(data).then(res => {
                    _this.showLoading = false;
                    _this.showSuccess = true;
                    _this.showError = false;
                    _this.message = res.data.message
                }).catch(err => {
                    _this.showLoading = false;
                    _this.showSuccess = false;
                    _this.showError = true;
                    _this.message = err.message
                })
            },
            // 查询
            hanldQuery: function () {
                if(this.Name == ''){
                    this.$message({
                        message: '请输入会员账号',
                        type: 'warning'
                    });
                }else{
                    this.checUserInit()
                }
            },
            // 重置
            hanldReset: function () {

            }
        }, 
    }
</script>

<style scoped>
    @import url(../../assets/css/management.css);
</style>