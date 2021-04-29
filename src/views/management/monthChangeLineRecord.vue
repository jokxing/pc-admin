<template>
    <div>
        <el-page-header @back="$router.go(-1)" content="调级记录"></el-page-header>

        <div class="memberApply_form" v-loading.fullscreen.lock="fullscreenLoading">
            <h4>申请信息</h4>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="日期" prop="date">
                    <el-date-picker
                        v-model="ruleForm.date"
                        type="month"
                        placeholder="选择月">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="会员用户名" prop="name">
                    <el-input placeholder="请输入会员用户名" v-model="ruleForm.name" />
                </el-form-item>
                <el-form-item label="原等级" prop="oldLevel">
                    <el-select v-model="ruleForm.oldLevel" placeholder="请选择原等级">
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="调级后等级" prop="newLevel">
                    <el-select v-model="ruleForm.newLevel" placeholder="请选择等级">
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="ruleForm.state" placeholder="请选择状态">
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="原因" prop="reason">
                    <el-input type="textarea" v-model="ruleForm.reason"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="primary-button" @click="submitForm('ruleForm')">提交申请</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                ruleForm:{
                    date: "",
                    name: "",
                    oldLevel: "",
                    newLevel: "",
                    state: "",
                    reason: ""
                },
                rules: {
                    date: [
                        { required: true, message: '请选择日期', trigger: 'blur' },
                    ],
                    name: [
                        { required: true, message: '请输入会员用户名', trigger: 'blur' },
                    ],
                    oldLevel: [
                        { required: true, message: '请选择原等级', trigger: 'change' },
                    ],
                    newLevel: [
                        { required: true, message: '请选择等级', trigger: 'change' },
                    ],
                    state: [
                        { required: true, message: '请选择状态', trigger: 'change' },
                    ],
                },
                fullscreenLoading: false
            }
        },
        methods: {
            // 申请提交
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                        this.fullscreenLoading = true;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        },
    }
</script>

<style scoped>
    @import url(../../assets/css/management.css);
</style>